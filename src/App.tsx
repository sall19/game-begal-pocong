/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, 
  Battery, 
  DoorClosed, 
  Eye, 
  MessageSquare, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Skull, 
  Award, 
  HelpCircle, 
  CheckCircle2, 
  FileText,
  Volume1,
  Sparkles,
  Info
} from 'lucide-react';
import { Visitor, ChatMessage, GameState } from './types';
import { VISITORS_DATABASE, NIGHTS_CONFIG } from './data/visitors';
import { PhoneChat } from './components/PhoneChat';
import { Peephole } from './components/Peephole';
import { horrorAudio } from './utils/audio';

// Path for generated images
const SPOOKY_DOOR_IMG = "/src/assets/images/spooky_door_view_1779779041409.png";
const JUMPSCARE_IMG = "/src/assets/images/begal_pocong_jumpscare_1779779064168.png";

export default function App() {
  // Game state
  const [gameState, setGameState] = useState<GameState>({
    currentNight: 1,
    currentHour: 0, // 00:00 (Midnight)
    stressLevel: 10,
    batteryLevel: 100,
    score: 0,
    gamePhase: 'intro',
    activeVisitor: null,
    revealedClues: {
      feet: false,
      hands: false,
      shroud: false,
      face: false,
      voice: false,
      scent: false
    },
    logEntries: ['Pukul 00:00 - Malam sunyi dimulai...'],
    flashlightOn: false,
    peepSpotlightPos: { x: 150, y: 150 }
  });

  // UI state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'door' | 'peephole'>('door');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [dialogueText, setDialogueText] = useState<string>('Pintu dalam keadaan terkunci rapat.');
  const [scentText, setScentText] = useState<string>('');
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [jumpscareActive, setJumpscareActive] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);

  // Audio start trigger on first interaction
  const handleStartGame = () => {
    horrorAudio.startSpookyDrone();
    horrorAudio.playNotificationDing();
    
    // Initialise Night 1 visitor
    setupNight(1);
  };

  // Set up a specific night
  const setupNight = (nightNum: number) => {
    const config = NIGHTS_CONFIG[nightNum - 1];
    if (!config) return;

    // Load initial chat messages for the night
    const rawMessages: ChatMessage[] = config.whatsappClues.map((clue, idx) => ({
      id: `night_${nightNum}_hint_${idx}`,
      sender: idx === 0 ? 'Pak RT Heru (🚨)' : 'Bu Minah (Grosir)',
      senderRole: idx === 0 ? 'rt' : 'news',
      content: clue,
      timestamp: `23:${45 + idx * 7}`,
      isHint: true
    }));

    setChatMessages(rawMessages);
    setUnreadChatCount(rawMessages.length);

    // Pick first visitor
    const visitorsPool = config.visitorList;
    const firstVisitorId = visitorsPool[0];
    const initialVisitor = VISITORS_DATABASE[firstVisitorId] || VISITORS_DATABASE['kang_paket'];

    setGameState(prev => ({
      ...prev,
      currentNight: nightNum,
      currentHour: 0,
      stressLevel: 15,
      batteryLevel: 100,
      gamePhase: 'playing',
      activeVisitor: initialVisitor,
      revealedClues: {
        feet: false,
        hands: false,
        shroud: false,
        face: false,
        voice: false,
        scent: false
      },
      logEntries: [
        `Malam ${nightNum}: ${config.title}`,
        `00:00 - ${config.subtitle}`,
        `Seseorang sedang mendekati rumahmu...`
      ],
      flashlightOn: false
    }));

    setDialogueText('Terdengar gesekan rimbun daun pisang di luar... lalu kesunyian malam dipecah.');
    setScentText('');
    setIsChatOpen(false);
    setActiveTab('door');
    setJumpscareActive(false);

    // Play initial heavy knocking sound shortly
    setTimeout(() => {
      horrorAudio.playDoorKnock(initialVisitor.isBegal);
    }, 1500);
  };

  // Audio volume changes
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    horrorAudio.setVolume(newVol);
  };

  // Audio muting toggle
  const toggleMute = () => {
    const isMuted = horrorAudio.toggleMute();
    setAudioMuted(isMuted);
  };

  // Tick stress level & battery level
  useEffect(() => {
    if (gameState.gamePhase !== 'playing' && gameState.gamePhase !== 'peephole') {
      horrorAudio.stopHeartbeat();
      return;
    }

    const interval = setInterval(() => {
      setGameState(prev => {
        // Battery drain if flashlight is on
        let nextBattery = prev.batteryLevel;
        if (prev.flashlightOn && prev.gamePhase === 'peephole') {
          nextBattery = Math.max(0, prev.batteryLevel - 0.45);
        }

        // Auto-turn off flashlight if batteries are dead
        let nextFlashlight = prev.flashlightOn;
        if (nextBattery <= 0 && prev.flashlightOn) {
          nextFlashlight = false;
          horrorAudio.playFlashlightClick();
        }

        // Stress tick - slowly grows over time if player hesitates
        const strainSpeed = prev.activeVisitor?.role === 'ghost' ? 1.8 : prev.activeVisitor?.isBegal ? 1.2 : 0.65;
        const nextStress = Math.min(100, prev.stressLevel + strainSpeed);

        // Heartbeat frequency adjustment based on stress
        if (nextStress > 30) {
          horrorAudio.playHeartbeat(nextStress);
        } else {
          horrorAudio.stopHeartbeat();
        }

        // Stress check - collapse / panic heart attack at 100%
        if (nextStress >= 100) {
          clearInterval(interval);
          return {
            ...prev,
            stressLevel: 100,
            gamePhase: 'gameover',
            logEntries: [...prev.logEntries, "Kamu mengalami serangan jantung hebat karena ketakutan ekstrem!"]
          };
        }

        return {
          ...prev,
          batteryLevel: nextBattery,
          flashlightOn: nextFlashlight,
          stressLevel: nextStress
        };
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      horrorAudio.stopHeartbeat();
    };
  }, [gameState.gamePhase, gameState.flashlightOn, gameState.activeVisitor]);

  // Handle clue discovery via Peephole spotlight
  const discoverClue = (category: 'face' | 'shroud' | 'hands' | 'feet' | 'voice' | 'scent') => {
    if (!gameState.activeVisitor) return;

    setGameState(prev => {
      if (prev.revealedClues[category]) return prev; // already discovered

      const nextClues = { ...prev.revealedClues, [category]: true };
      const fieldDesc = {
        face: 'Detail wajah',
        shroud: 'Tanda kain kafan',
        hands: 'Genggaman barang/senjata',
        feet: 'Alas kaki',
        voice: 'Karakter suara',
        scent: 'Bau aroma pintu'
      }[category];

      return {
        ...prev,
        revealedClues: nextClues,
        score: prev.score + 10,
        logEntries: [...prev.logEntries, `Berhasil menganalisis: ${fieldDesc}`]
      };
    });
  };

  // ASKING IDENTITY ("Tanya Siapa?")
  const handleAskIdentity = () => {
    if (!gameState.activeVisitor) return;
    horrorAudio.playRadioStatic(true);

    discoverClue('voice');
    setDialogueText(gameState.activeVisitor.dialogues.respondToQuestion);
    
    // Slight stress increase when visitor answers defensively
    setGameState(prev => ({
      ...prev,
      stressLevel: Math.min(95, prev.stressLevel + 5),
      logEntries: [...prev.logEntries, `Kamu bertanya 'Siapa di luar?' -- Pengunjung merespon.`]
    }));
  };

  // SNIFF DOOR CRACK ("Endus Celah Pintu")
  const handleSniffDoor = () => {
    if (!gameState.activeVisitor) return;
    horrorAudio.playRadioStatic(false);

    discoverClue('scent');
    setScentText(`Kamu mendekatkan hidung ke celah kayu... Kamu mencium: ${gameState.activeVisitor.scentClue}`);
    
    setGameState(prev => ({
      ...prev,
      stressLevel: Math.min(95, prev.stressLevel + 2),
      logEntries: [...prev.logEntries, `Kamu mengendus celah pintu.`]
    }));
  };

  // CHECK PHONE GROUP CHAT
  const handleOpenWhatsApp = () => {
    setUnreadChatCount(0);
    setIsChatOpen(true);
  };

  // OPEN THE DOOR (BUKA PINTU)
  const handleOpenDoor = () => {
    const visitor = gameState.activeVisitor;
    if (!visitor) return;

    if (visitor.isBegal) {
      // DEATH JUMPSCARE!
      horrorAudio.playJumpscare();
      setJumpscareActive(true);
      setGameState(prev => ({
        ...prev,
        gamePhase: 'gameover',
        logEntries: [...prev.logEntries, `KAMU MATI! Kamu membuka pintu untuk ${visitor.secretIdentity}. Dia merampokmu menggunakan celurit!`]
      }));
    } else if (visitor.role === 'ghost') {
      // GHOST INTRUSION!
      horrorAudio.playJumpscare();
      setJumpscareActive(true);
      setGameState(prev => ({
        ...prev,
        gamePhase: 'gameover',
        logEntries: [...prev.logEntries, `KAMU KERASUKAN! Kamu mengizinkan Pocong Asli masuk ke rumahmu. Jiwamu terikat selamanya!`]
      }));
    } else {
      // Safe visitor opened! Success
      horrorAudio.playSuccessChime();
      
      // Grant rewards
      let batteryBonus = 0;
      let stressReduction = 0;
      if (visitor.id === 'kang_paket') {
        batteryBonus = 50;
      } else if (visitor.id === 'mbah_darmo') {
        stressReduction = 30;
      } else if (visitor.id === 'bu_rt') {
        stressReduction = 20;
        batteryBonus = 25;
      } else if (visitor.id === 'kang_ronda') {
        batteryBonus = 40;
        stressReduction = 100; // Reset
      }

      setGameState(prev => {
        const nextHour = prev.currentHour + 1;
        const nightFinished = nextHour >= 5; // survive 5 hours
        const newScore = prev.score + 100;
        
        let nextPhase = prev.gamePhase;
        if (nightFinished) {
          nextPhase = prev.currentNight === 5 ? 'victory' : 'playing'; // If cleared night 5, you win.
        }

        return {
          ...prev,
          currentHour: nextHour,
          batteryLevel: Math.min(100, prev.batteryLevel + batteryBonus),
          stressLevel: stressReduction === 100 ? 5 : Math.max(5, prev.stressLevel - stressReduction),
          score: newScore,
          logEntries: [
            ...prev.logEntries,
            `Membuka pintu untuk ${visitor.name}.`,
            `Kemajuan waktu: Pukul 0${nextHour}:00.`
          ],
          gamePhase: nextPhase
        };
      });

      setDialogueText(`Interaksi Sukses: ${visitor.dialogues.onOpenSuccess}`);
      setScentText('');

      // Move to next visitor if night is not finished
      if (gameState.currentHour + 1 < 5) {
        progressNextVisitor(gameState.currentHour + 1);
      } else {
        // Night clear sound
        if (gameState.currentNight < 5) {
          setDialogueText("Hari sudah menjelang Subuh (05:00). Berkas matahari mengusir seluruh ancaman malam ini! Selamat.");
        }
      }
    }
  };

  // REJECT / GO AWAY (TOLAK / USIR)
  const handleRejectVisitor = () => {
    const visitor = gameState.activeVisitor;
    if (!visitor) return;

    horrorAudio.playDoorKnock(true); // Knock of defense / banging

    setGameState(prev => {
      const nextHour = prev.currentHour + 1;
      const nightFinished = nextHour >= 5;
      const wasBegal = visitor.isBegal || visitor.role === 'ghost';
      const scoreAdd = wasBegal ? 150 : 50; // higher points for locking out the bad guys
      const stressChange = wasBegal ? -15 : 20; // locking out neighbors increases stress because of guilt/fines!

      let nextPhase = prev.gamePhase;
      if (nightFinished) {
        nextPhase = prev.currentNight === 5 ? 'victory' : 'playing';
      }

      return {
        ...prev,
        currentHour: nextHour,
        score: prev.score + scoreAdd,
        stressLevel: Math.max(10, Math.min(95, prev.stressLevel + stressChange)),
        logEntries: [
          ...prev.logEntries,
          `Menolak pintu untuk sosok di luar.`,
          wasBegal 
            ? `Keputusan tepat! Sosok jahat teridentifikasi mundur kesal.`
            : `Menyesatkan! Kamu mengunci tetangga aman ${visitor.name}.`,
          `Kemajuan waktu: Pukul 0${nextHour}:00.`
        ],
        gamePhase: nextPhase
      };
    });

    if (visitor.isBegal || visitor.role === 'ghost') {
      setDialogueText(`Mengunci Pintu: Sosok di luar mengumpat marah, mengetuk jendela dengan keras lalu pergi menjauh! Kamu aman dari ancaman.`);
    } else {
      setDialogueText(`Mengunci Pintu: Tetanggamu bingung karena diacuhkan: "${visitor.dialogues.respondToQuestion}" Lalu berjalan pergi dengan kecewa.`);
    }

    setScentText('');

    // Advance queue
    if (gameState.currentHour + 1 < 5) {
      progressNextVisitor(gameState.currentHour + 1);
    } else {
      if (gameState.currentNight < 5) {
        setDialogueText("Teror berakhir menjelang Shubuh (05:00). Cahaya fajar mengusir seluruh begal.");
      }
    }
  };

  // Feed next visitor to queue
  const progressNextVisitor = (hour: number) => {
    const config = NIGHTS_CONFIG[gameState.currentNight - 1];
    if (!config) return;

    const visitorsPool = config.visitorList;
    // We pick visitor sequentially or loop
    const nextVisitorId = visitorsPool[hour % visitorsPool.length];
    const nextVisitor = VISITORS_DATABASE[nextVisitorId] || VISITORS_DATABASE['kang_paket'];

    // Send new dynamic hints in WhatsApp group chat
    setTimeout(() => {
      const senders = ['Sonda Pos Hansip', 'Pak RT Heru', 'Bu RT Tuti', 'Roni Siskamling'];
      const currentSender = senders[hour % senders.length];
      
      const newMsg: ChatMessage = {
        id: `m_hour_${hour}_${Date.now()}`,
        sender: currentSender,
        senderRole: 'neighbor',
        content: nextVisitor.isBegal 
          ? `Waspada warga! Seseorang mencurigakan dengan ciri: ${nextVisitor.gossipWarning || "memakai kain kafan palsu"} terlihat mendekati perumahan!`
          : `Info aman: ${nextVisitor.name} terpantau sedang melintasi area barat menuju rumah warga. Mohon dibantu jika mengetuk pintu.`,
        timestamp: `0${hour}:12`
      };

      setChatMessages(prev => [...prev, newMsg]);
      setUnreadChatCount(prev => prev + 1);
      horrorAudio.playNotificationDing();

      // Trigger heavy knocks
      setTimeout(() => {
        horrorAudio.playDoorKnock(nextVisitor.isBegal);
      }, 1000);
    }, 4500);

    setGameState(prev => ({
      ...prev,
      activeVisitor: nextVisitor,
      revealedClues: {
        feet: false,
        hands: false,
        shroud: false,
        face: false,
        voice: false,
        scent: false
      }
    }));
  };

  // Skip night transition (Survive -> Next Level)
  const handleNextNight = () => {
    const nextNightNum = gameState.currentNight + 1;
    if (nextNightNum <= 5) {
      setupNight(nextNightNum);
    }
  };

  // Restart entire game from Night 1
  const handleRestartAll = () => {
    horrorAudio.stopSpookyDrone();
    setGameState(prev => ({
      ...prev,
      gamePhase: 'intro',
      currentNight: 1,
      currentHour: 0
    }));
    setDialogueText('Pintu dalam keadaan terkunci rapat.');
    setScentText('');
    setJumpscareActive(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] flex flex-col font-serif relative overflow-x-hidden overflow-y-auto select-none">
      
      {/* VIGNETTE GLOW OVERLAYS FROM ARTISTIC FLAIR */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(75,0,0,0.22)_0%,transparent_70%)] z-0" />
      <div className="absolute inset-0 opacity-10 pointer-events-none noise-bg z-0" />
      
      {/* SCANLINE CRT RETRO VIBE OVERLAY */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90.00deg,rgba(255,0,0,0.04),rgba(0,255,0,0.01),rgba(0,0,255,0.04))] pointer-events-none z-40 bg-[size:100%_4px,3px_100%]" />

      {/* HEADER BAR (ARTISTIC FLAIR STYLE) */}
      <header className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center z-10 border-b border-[#331111] pb-6 mb-8 mt-6 px-4 shrink-0 gap-4">
        <div className="space-y-1">
          <h1 
            id="heading_title"
            onClick={handleRestartAll}
            className="text-4xl sm:text-5xl font-black tracking-tighter leading-none text-[#ff2200] italic uppercase transform -skew-x-6 select-none cursor-pointer hover:opacity-90 active:scale-95 transition-all"
          >
            TEROR BEGAL POCONG
          </h1>
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#888888]">
            {gameState.gamePhase === 'playing' || gameState.gamePhase === 'peephole' 
              ? `Malam Ke-${gameState.currentNight}: Desa Bayang Sunyi` 
              : "Malam Ke-3: Desa Bayang Sunyi"}
          </p>
        </div>

        <div className="text-right flex flex-col items-end gap-1.5 w-full sm:w-auto">
          <div className="text-[10px] text-[#888888] font-mono tracking-widest uppercase">TINGKAT KEWASPADAAN</div>
          <div className="flex gap-1.5 justify-end">
            {[1, 2, 3, 4, 5].map((block) => {
              const activeBlocks = Math.ceil(gameState.stressLevel / 20);
              const active = block <= activeBlocks;
              return (
                <div 
                  key={block} 
                  className={`w-3.5 h-3.5 transition-all duration-300 ${
                    active ? "bg-[#ff2200] shadow-[0_0_8px_#ff2200]" : "bg-[#331111]"
                  }`} 
                />
              );
            })}
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <button
              id="how_to_play_btn"
              onClick={() => {
                horrorAudio.playFlashlightClick();
                setShowHowToPlay(true);
              }}
              className="p-1 px-2 border border-[#331111] bg-[#110505] text-[#888888] hover:text-[#e0e0e0] text-[9px] font-mono tracking-wider uppercase transition-colors cursor-pointer"
              title="Cara Bermain"
            >
              CARA MAIN
            </button>
            <button
              id="btn_toggle_mute"
              onClick={toggleMute}
              className="p-1 px-3 border border-[#331111] bg-[#110505] text-[#888888] hover:text-[#ff2200] text-[9px] font-mono tracking-wider uppercase transition-colors cursor-pointer"
            >
              {audioMuted ? "MUTE : ON" : `VOL: ${Math.round(volume * 100)}%`}
            </button>
          </div>
        </div>
      </header>

      {/* HELP / HOW TO PLAY MODAL */}
      <AnimatePresence>
        {showHowToPlay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-50 overflow-y-auto"
          >
            <motion.div 
              style={{ backgroundImage: 'linear-gradient(to bottom, #09090b, #030303)' }}
              className="max-w-md w-full border-2 border-[#ff2200]/30 rounded-lg p-6 relative font-serif"
            >
              <h2 className="text-lg font-black tracking-wider text-red-500 font-mono flex items-center gap-2 mb-4 italic transform -skew-x-3 uppercase">
                <Info className="w-5 h-5 text-red-500 animate-pulse" />
                CATATAN INTELEKTUAL SURVIVAL
              </h2>
              
              <div className="space-y-4 text-xs text-zinc-300 leading-relaxed max-h-96 overflow-y-auto pr-2">
                <p>
                  Kamu berdiam diri di gubuk pedalaman. Desas-desus gencar tentang adanya <strong className="text-red-400">Begal Pocong</strong>—manusia licik berselimut putih ketat yang berpura-pura jadi hantu dengan maksud merampas nyawamu memakai sabit celurit maut.
                </p>

                <div className="bg-[#110505] border border-[#331111] p-3 rounded font-serif">
                  <h3 className="font-bold text-[#ff2200] mb-1.5 text-[11px] uppercase tracking-wider font-mono">🔍 ANALISIS KONDISI BEGAL (MANUSIA PALSU)</h3>
                  <ul className="list-disc pl-4 space-y-1 text-zinc-400">
                    <li><strong className="text-zinc-200">Kaki:</strong> Begal pocong menapak tanah! Mereka memakai sepatu olahraga bermerk, sandal karet biasa, atau bot penuh lumpur. (Pocong asli tidak memiliki kaki menapak).</li>
                    <li><strong className="text-zinc-200">Tangan/Senjata:</strong> Mereka menggenggam celurit tajam, menodong senjata api, atau pisau tersembunyi di saku.</li>
                    <li><strong className="text-zinc-200">Kafan:</strong> Sprei buatan pabrikan bermotif indah atau sprei terlalu steril yang tidak menyerupai kafan tanah kuburan asli.</li>
                    <li><strong className="text-zinc-200">Suara:</strong> Defensive saat ditanya identitas atau berpura-pura menjadi aparat keamanan siskamling / kurir paket buru-buru.</li>
                  </ul>
                </div>

                <div className="bg-[#110505] border border-[#331111] p-3 rounded font-serif">
                  <h3 className="font-bold text-emerald-500 mb-1.5 text-[11px] uppercase tracking-wider font-mono">🤝 WARGA AMAN (TETANGGA / REKAN)</h3>
                  <ul className="list-disc pl-4 space-y-1 text-zinc-400">
                    <li>Kamu <strong className="text-emerald-400">wajib mempersilakan masuk</strong> warga kampung yang ramah (seperti Mbah Darmo, Bu RT, kurir pos paket, siskamling ronda malam).</li>
                    <li>Mengunci pintu di depan tetangga murni yang ramah akan memicu rasa bersalah (menaikkan stress penyesalan!).</li>
                  </ul>
                </div>

                <p className="text-[10px] text-[#888888] italic">
                  Gunakan Senter di Lubang Intip guna mendeteksi seluruh area tubuh mereka. Pantau chat WA group warga secara berkala untuk petunjuk akurat!
                </p>
              </div>

              <button
                id="close_howto_btn"
                onClick={() => {
                  horrorAudio.playFlashlightClick();
                  setShowHowToPlay(false);
                }}
                className="w-full mt-6 py-2 px-4 bg-[#ff2200] hover:bg-red-500 text-black font-black text-xs cursor-pointer uppercase transition-all tracking-widest"
              >
                SAYA FAHAMI
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GAME CONTENT CONTAINER */}
      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col items-center justify-center p-4 gap-6 z-10 self-center">
        
        {/* VIEW 1: INTRO STATE (ARTISTIC DESIGN) */}
        {gameState.gamePhase === 'intro' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-lg p-8 bg-[#0a0a0a] border border-[#331111] shadow-[0_0_30px_rgba(255,34,0,0.05)] rounded relative"
          >
            {/* Ambient Red Aura */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#ff2200]/5 rounded-full blur-3xl" />
            
            <div className="w-20 h-20 bg-[#110505] border-2 border-[#331111] mx-auto flex items-center justify-center text-4xl mb-6 shadow-md shadow-red-950/20">
              ☠️
            </div>
            
            <h2 className="text-3xl font-black text-[#ff2200] font-mono tracking-wide uppercase italic transform -skew-x-6">
              KETUKAN MAUT
            </h2>
            <p className="text-[#888888] text-xs mt-1 mb-6 font-mono tracking-[0.2em] uppercase">TEROR BEGAL POCONG KOSPLAY</p>
            
            <p className="text-sm text-zinc-300 leading-relaxed max-w-md mx-auto mb-8">
              Kabisat 2026. Kampung Sidoasri dilanda ketakutan hebat akibat aksi perampokan bersenjata tajam berpakaian kain kafan pocong ketat. Mengetuk pintu rumah tengah malam dengan kelicikan. Amati detail terendus, cocokkan data siskamling, lalu putuskan malam penyelamatan.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                id="start_game_btn"
                onClick={handleStartGame}
                className="group relative cursor-pointer"
              >
                <div className="absolute -inset-2 bg-[#ff2200] opacity-25 blur-md group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-[#ff2200] text-black px-8 py-3.5 font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform duration-200">
                  MULAI BERTAHAN HIDUP
                </div>
              </button>
              
              <button
                id="intro_rules_btn"
                onClick={() => {
                  horrorAudio.playFlashlightClick();
                  setShowHowToPlay(true);
                }}
                className="border-2 border-[#e0e0e0] text-[#e0e0e0] px-8 py-3 font-bold text-xs uppercase tracking-widest hover:bg-[#e0e0e0] hover:text-black transition-all cursor-pointer"
              >
                PETUNJUK KONDISI
              </button>
            </div>

            <p className="text-[10px] text-zinc-600 mt-8 font-mono uppercase tracking-widest">
              DIOPTIMALKAN DENGAN CONTEKSTUAL HOROR ENGINE
            </p>
          </motion.div>
        )}

        {/* VIEW 2: PLAYING STATE (ARTISTIC DESIGN) */}
        {(gameState.gamePhase === 'playing' || gameState.gamePhase === 'peephole') && (
          <div className="w-full flex flex-col lg:flex-row gap-8 relative items-stretch">
            
            {/* LUBANG MONITOR VIEW (VINTAGE MONITOR CANVASES) */}
            <div className="flex-1 lg:w-2/3 flex flex-col bg-[#0a0a0a] border-4 border-[#1a1a1a] shadow-[inset_0_0_100px_#000] relative rounded p-5">
              
              {/* Stress Border Animation Accent */}
              <div 
                className="absolute inset-0 border-2 pointer-events-none transition-colors duration-500 z-10"
                style={{
                  borderColor: gameState.stressLevel > 70 
                    ? `rgba(255, 34, 0, ${0.15 + (Math.sin(Date.now() / 150) * 0.08)})` 
                    : gameState.stressLevel > 40 
                      ? 'rgba(255, 34, 0, 0.07)' 
                      : 'rgba(26, 26, 26, 0.4)'
                }}
              />

              {/* Stress level shaking simulated */}
              <div className={`flex-1 flex flex-col relative justify-between gap-4 ${gameState.stressLevel > 75 ? 'animate-[shake_0.4s_infinite]' : ''}`}>
                
                {/* HUD: Hours & Battery Status */}
                <div className="flex justify-between items-center z-10">
                  <div className="flex items-center gap-2 bg-[#110505] border border-[#331111] px-3 py-1 font-mono text-[10px]">
                    <span className="text-[#888888]">STRESS:</span>
                    <span className="text-[#ff2200] font-bold">{Math.floor(gameState.stressLevel)}%</span>
                  </div>

                  <div className="bg-[#110505] border border-[#331111] px-4 py-1 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#ff2200] animate-pulse"></div>
                    <span className="font-mono text-xs font-black text-[#ff2200] tracking-wider">
                      0{gameState.currentHour}:00 AM
                    </span>
                  </div>
                </div>

                {/* CENTRAL GRAPHIC DISPLAY ZONE */}
                <div className="my-2 flex-1 flex items-center justify-center relative min-h-[250px] sm:min-h-[300px]">
                  {activeTab === 'door' ? (
                    <div className="relative w-full h-full min-h-[250px] sm:min-h-[300px] border-2 border-[#1a1a1a] bg-[#050505] flex items-center justify-center overflow-hidden">
                      <img 
                        src={SPOOKY_DOOR_IMG} 
                        alt="Porch Door" 
                        className="w-full h-full object-cover select-none pointer-events-none brightness-[0.4]"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Aura of suspicious presence */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,34,0,0.1)_0%,transparent_60%)] pointer-events-none" />

                      {/* Informative Floating text */}
                      {gameState.activeVisitor && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                          <motion.div 
                            animate={{ scale: [1, 1.03, 1] }}
                            transition={{ duration: 1.8, repeat: Infinity }}
                            className="bg-[#050505]/95 px-4 py-2 border border-[#331111] text-xs font-mono text-[#ff2200] tracking-wider flex items-center gap-2 text-center"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff2200] animate-ping" />
                            <span>*TOK TOK TOK...* Seseorang sedang berdiri di depan rumahmu!</span>
                          </motion.div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full">
                      <Peephole 
                        visitor={gameState.activeVisitor}
                        onClueDiscovered={discoverClue}
                        revealedClues={gameState.revealedClues}
                        batteryLevel={gameState.batteryLevel}
                        flashlightOn={gameState.flashlightOn}
                        toggleFlashlight={() => setGameState(prev => ({ ...prev, flashlightOn: !prev.flashlightOn }))}
                      />
                    </div>
                  )}
                </div>

                {/* LOGS, AUDIO DIALOGS & SCENTS */}
                <div className="bg-[#110505] p-3 border border-[#331111] text-xs shrink-0 flex flex-col justify-between min-h-[70px] relative">
                  <div className="text-[10px] uppercase font-mono text-[#888888] mb-1 flex justify-between items-center">
                    <span>SUARA & AROMA TERDEKSI</span>
                    {activeTab === 'peephole' && <span className="text-yellow-500 animate-pulse font-mono font-bold text-[9px]">SENTER INTIP PERIKSA</span>}
                  </div>
                  
                  <p className="text-[#e0e0e0] leading-normal mb-1 sm:text-sm italic">
                    {dialogueText}
                  </p>

                  {scentText && (
                    <p className="text-[11px] text-[#ff2200] tracking-wide font-serif">
                       {scentText}
                    </p>
                  )}
                </div>

              </div>

              {/* TAB SELECTORS (ARTISTIC DESIGN) */}
              <div className="bg-[#050505] border border-[#1a1a1a] p-1.5 flex gap-2 shrink-0 mt-4">
                <button
                  id="tab_door_btn"
                  onClick={() => {
                    horrorAudio.playFlashlightClick();
                    setActiveTab('door');
                    setGameState(prev => ({ ...prev, gamePhase: 'playing' }));
                  }}
                  className={`flex-1 py-1.5 px-3 text-xs font-bold font-mono transition-all duration-200 cursor-pointer uppercase ${
                    activeTab === 'door' 
                      ? 'bg-[#1a1515] text-[#ff2200] border border-[#ff2200]/40' 
                      : 'text-[#888888] hover:text-[#e0e0e0] border border-transparent'
                  }`}
                >
                  🚪 RUANG TAMU MALAM
                </button>
                <button
                  id="tab_peephole_btn"
                  onClick={() => {
                    if (gameState.batteryLevel <= 0) {
                      setDialogueText("Baterai Senter mati! Kamu tidak bisa mengamati lewat lubang intip.");
                      return;
                    }
                    horrorAudio.playFlashlightClick();
                    setActiveTab('peephole');
                    setGameState(prev => ({ ...prev, gamePhase: 'peephole', flashlightOn: true }));
                  }}
                  className={`flex-1 py-1.5 px-3 text-xs font-bold font-mono transition-all duration-200 cursor-pointer uppercase ${
                    activeTab === 'peephole' 
                      ? 'bg-[#1a1515] text-[#ff2200] border border-[#ff2200]/40' 
                      : 'text-[#888888] hover:text-[#e0e0e0] border border-transparent'
                  }`}
                >
                  👁️ INTIP LUBANG PINTU
                </button>
              </div>

            </div>

            {/* ARTISTIC DESCRIPTORS & THEME ACTIONS COLUMN */}
            <div className="w-full lg:w-1/3 flex flex-col justify-between gap-6 shrink-0">
              
              {/* WhatsApp phone trigger bubble */}
              <div className="bg-[#110505] border border-[#331111] p-4 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 bg-[#ff2200]/5 rounded-full blur-xl pointer-events-none" />
                
                <div className="relative mb-3">
                  <button
                    id="btn_open_chat"
                    onClick={() => {
                      horrorAudio.playFlashlightClick();
                      handleOpenWhatsApp();
                    }}
                    className="w-12 h-12 rounded bg-[#ff2200]/10 border border-[#ff2200]/40 flex items-center justify-center hover:bg-[#ff2200] hover:text-black text-[#ff2200] transition-all cursor-pointer shadow-lg"
                  >
                    <MessageSquare className="w-6 h-6" />
                  </button>
                  {unreadChatCount > 0 && (
                    <span className="absolute -top-1 -right-1.5 w-5 h-5 bg-[#ff2200] border-2 border-black rounded-full font-bold font-mono text-[9px] text-black flex items-center justify-center animate-bounce">
                      {unreadChatCount}
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-xs uppercase text-zinc-100 font-mono tracking-widest">GRUP WA SISKAMLING</h4>
                <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">Pemberitahuan darurat warga siskamling ronda malam.</p>
              </div>

              {/* ARTISTIC DISCOVERED CONDITIONS (border-l-2 style) */}
              {gameState.activeVisitor && (
                <div className="border-l-2 border-[#ff2200] pl-6 py-4 font-serif space-y-3">
                  <h2 className="text-xs font-mono text-[#ff2200] uppercase tracking-widest mb-1">Kondisi Terendus</h2>
                  <ul className="space-y-3 text-xs leading-normal">
                    <li className="flex flex-col">
                      <span className="text-[9px] text-[#666666] uppercase font-mono">Suara</span>
                      <span className="italic text-zinc-300">
                        {gameState.revealedClues.voice ? gameState.activeVisitor.dialogues.respondToQuestion : "Tanyakan id untuk mendengar suaranya."}
                      </span>
                    </li>
                    <li className="flex flex-col">
                      <span className="text-[9px] text-[#666666] uppercase font-mono">Aroma</span>
                      <span className={`italic ${gameState.revealedClues.scent ? "text-[#ff2200]" : "text-zinc-500"}`}>
                        {gameState.revealedClues.scent ? gameState.activeVisitor.scentClue : "Mengendus celah untuk aroma."}
                      </span>
                    </li>
                    <li className="flex flex-col">
                      <span className="text-[9px] text-[#666666] uppercase font-mono font-bold">Visual Intipan</span>
                      <span className="italic text-zinc-400">
                        {gameState.revealedClues.face || gameState.revealedClues.shroud || gameState.revealedClues.hands || gameState.revealedClues.feet ? (
                          <span className="space-y-1 block mt-1">
                            {gameState.revealedClues.face && <span className="block text-amber-500">Wajah: {gameState.activeVisitor.visualClues.face}</span>}
                            {gameState.revealedClues.shroud && <span className="block text-emerald-400 font-bold">Kafan: {gameState.activeVisitor.visualClues.shroud}</span>}
                            {gameState.revealedClues.hands && <span className="block text-[#ff2200] font-bold">Tangan: {gameState.activeVisitor.visualClues.hands}</span>}
                            {gameState.revealedClues.feet && <span className="block text-cyan-400">Kaki: {gameState.activeVisitor.visualClues.feet}</span>}
                          </span>
                        ) : (
                          "Gunakan senter di lubang intip."
                        )}
                      </span>
                    </li>
                  </ul>
                </div>
              )}

              {/* ACTION PACK HOVER GLOW SYSTEM */}
              <div className="bg-[#110505] border border-[#331111] p-4 flex flex-col gap-3 relative">
                <span className="text-[9px] font-mono text-[#888888] uppercase tracking-wider mb-0.5">OPSI INVESTIGASI</span>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="action_ask_identity"
                    onClick={handleAskIdentity}
                    className="py-2.5 px-3 bg-transparent border border-[#331111] hover:border-[#ff2200] hover:text-[#ff2200] transition-colors text-xs font-mono tracking-wider text-zinc-300 font-bold uppercase text-center cursor-pointer"
                  >
                    TANYA ID
                  </button>

                  <button
                    id="action_sniff_crack"
                    onClick={handleSniffDoor}
                    className="py-2.5 px-3 bg-transparent border border-[#331111] hover:border-[#ff2200] hover:text-[#ff2200] transition-colors text-xs font-mono tracking-wider text-zinc-300 font-bold uppercase text-center cursor-pointer"
                  >
                    ENDUS CELAH
                  </button>
                </div>

                <div className="my-1 border-t border-[#331111]" />

                {/* THE PRIZED GLOW ACTIONS */}
                <div className="flex flex-col gap-3">
                  {/* BUKA PINTU UTAMA */}
                  <button
                    id="action_open_door"
                    onClick={handleOpenDoor}
                    className="group relative w-full cursor-pointer"
                  >
                    <div className="absolute -inset-1.5 bg-[#ff2200] opacity-20 blur-md group-hover:opacity-40 transition-opacity"></div>
                    <div className="relative bg-[#ff2200] text-black py-4 font-black text-sm uppercase tracking-widest text-center hover:scale-102 transition-transform duration-200">
                      BUKA PINTU
                    </div>
                  </button>

                  {/* ABAIKAN / TOLAK */}
                  <button
                    id="action_reject_visitor"
                    onClick={handleRejectVisitor}
                    className="group relative w-full cursor-pointer"
                  >
                    <div className="relative border-2 border-[#e0e0e0] text-[#e0e0e0] py-[13px] font-black text-sm uppercase tracking-widest text-center hover:bg-[#e0e0e0] hover:text-black transition-all">
                      ABAIKAN / USIR
                    </div>
                  </button>
                </div>
              </div>

              {/* HISTORIC JOURNAL ENTRY */}
              <div className="bg-[#110505] p-3 border border-[#331111] max-h-[120px] flex flex-col font-serif">
                <span className="text-[9px] font-mono text-[#666666] uppercase mb-1.5 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" /> BUKU LOG HARIAN
                </span>
                <div className="overflow-y-auto space-y-1.5 pr-1 flex-1 font-mono text-[9px] leading-snug text-zinc-400">
                  {gameState.logEntries.slice().reverse().map((log, i) => (
                    <div key={i} className="border-l border-[#331111] pl-2 text-zinc-400">
                      {log}
                    </div>
                  ))}
                </div>
              </div>

              {/* CATATAN KAKEK FROM DESIGN HTML */}
              <div className="bg-[#110505] border border-[#331111] p-4 font-serif">
                <p className="text-xs text-[#888888] leading-relaxed">
                  "Jika kau mencium bau melati, itu mungkin ibumu. Jika kau mencium bau bangkai atau kapur barus pekat, jangan pernah tarik selot pintunya!"
                </p>
                <p className="text-[10px] text-[#444444] mt-2 font-mono">— Catatan Kakek</p>
              </div>

            </div>

          </div>
        )}

        {/* VIEW 3: GAMEOVER STATE (ARTISTIC DESIGN) */}
        {gameState.gamePhase === 'gameover' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-lg p-8 bg-[#110505] border-2 border-[#ff2200]/40 rounded relative overflow-hidden"
          >
            {jumpscareActive ? (
              <div className="w-full h-48 sm:h-56 bg-black rounded overflow-hidden mb-6 border border-[#331111] relative">
                <img 
                  src={JUMPSCARE_IMG} 
                  alt="Begal Pocong!" 
                  className="w-full h-full object-cover select-none pointer-events-none animate-[bounce_0.25s_infinite]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-red-950/40 pointer-events-none animate-pulse" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-[#1a0505] border border-[#ff2200]/50 mx-auto flex items-center justify-center text-4xl mb-6">
                ☠️
              </div>
            )}

            <h2 className="text-3xl font-black text-[#ff2200] font-mono tracking-wide uppercase italic transform -skew-x-6">
              DIHABISI BEGAL
            </h2>
            <p className="text-zinc-300 text-sm mt-3 mb-6 leading-relaxed">
              {gameState.logEntries[gameState.logEntries.length - 1] || "Begal pocong membobol pertahanan rumahmu!"}
            </p>

            <div className="bg-black/80 p-4 border border-[#331111] text-xs text-zinc-500 mb-8 max-w-sm mx-auto">
              💡 <strong>CATATAN:</strong> Amati detail intipan menggunakan senter. Begal pocong adalah manusia penyamar berdarah dingin—mereka mengenakan alas kaki kets beralas lumpur dan memegang celulrit.
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                id="btn_retry_level"
                onClick={() => setupNight(gameState.currentNight)}
                className="group relative cursor-pointer"
              >
                <div className="absolute -inset-1.5 bg-[#ff2200] opacity-25 blur shadow-md"></div>
                <div className="relative bg-[#ff2200] text-black px-8 py-3 font-bold text-xs uppercase tracking-widest hover:scale-103 transition-transform">
                  ULANGI MALAM {gameState.currentNight}
                </div>
              </button>
              <button
                id="btn_back_home"
                onClick={handleRestartAll}
                className="border-2 border-[#e0e0e0] text-[#e0e0e0] px-8 py-3 font-bold text-xs uppercase tracking-widest hover:bg-[#e0e0e0] hover:text-black transition-colors cursor-pointer"
              >
                MENU UTAMA
              </button>
            </div>
          </motion.div>
        )}

        {/* VIEW 4: SURVIVED LEVEL COMPLETE (ARTISTIC DESIGN) */}
        {gameState.gamePhase === 'playing' && gameState.currentHour >= 5 && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md p-8 bg-[#050505] border border-emerald-900/60 shadow-[0_0_40px_rgba(16,185,129,0.05)] rounded relative flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-emerald-950/40 border border-emerald-500 flex items-center justify-center text-3xl mb-5 animate-bounce">
              🌅
            </div>

            <h2 className="text-2xl font-black text-emerald-400 font-mono tracking-wide uppercase italic transform -skew-x-6">
              MALAM SUKSES DILEWATI
            </h2>
            <p className="text-xs text-emerald-300 mt-1 mb-5">
              Cahaya fajar mengusir makhluk malam pukul 05:00 AM!
            </p>

            <div className="bg-[#110505] p-4 border border-[#331111] w-full mb-6 text-xs text-left space-y-2.5 font-serif">
              <div className="flex justify-between border-b border-[#331111] pb-1.5">
                <span className="text-[#888888] font-mono">STATUS:</span>
                <span className="text-[#e0e0e0] font-bold font-mono">BERTAHAN HIDUP (SURVIVED)</span>
              </div>
              <div className="flex justify-between border-b border-[#331111] pb-1.5">
                <span className="text-[#888888] font-mono">AKUMULASI SCORE:</span>
                <span className="text-emerald-400 font-bold font-mono">{gameState.score} Pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#888888] font-mono">INTELLIGENCE BEGAL:</span>
                <span className="text-red-500 font-mono font-bold tracking-wide">TERINDENTIFIKASI</span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 mb-8 leading-relaxed">
              Kamu berhasil menolak begal palsu dan menyelamatkan tetangga sismkamling warga dengan baik. Malam selanjutnya akan lebih berbahaya!
            </p>

            <div className="w-full">
              {gameState.currentNight < 5 ? (
                <button
                  id="btn_continue_next_night"
                  onClick={handleNextNight}
                  className="group relative w-full cursor-pointer"
                >
                  <div className="absolute -inset-1.5 bg-emerald-500 opacity-20 blur"></div>
                  <div className="relative bg-emerald-500 text-black py-4 font-black text-xs uppercase tracking-widest text-center">
                    LANJUT MALAM {gameState.currentNight + 1}
                  </div>
                </button>
              ) : (
                <button
                  id="btn_go_victory"
                  onClick={() => setGameState(prev => ({ ...prev, gamePhase: 'victory' }))}
                  className="group relative w-full cursor-pointer"
                >
                  <div className="absolute -inset-1.5 bg-emerald-500 opacity-20 blur"></div>
                  <div className="relative bg-emerald-500 text-black py-4 font-black text-xs uppercase tracking-widest text-center">
                    Saksikan Epilog Tamat Game
                  </div>
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* VIEW 5: ENTIRE VICTORY SCREEN (ARTISTIC DESIGN) */}
        {gameState.gamePhase === 'victory' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-lg p-8 bg-[#0a0a0a] border border-[#ff2200]/20 shadow-[0_0_40px_rgba(255,215,0,0.05)] rounded relative"
          >
            <div className="w-20 h-20 bg-yellow-950/20 border border-yellow-500 flex items-center justify-center text-4xl mb-6 mx-auto animate-pulse">
              👑
            </div>

            <h2 className="text-3xl font-black text-yellow-500 font-mono tracking-wide uppercase italic transform -skew-x-6">
              DESA SIDOASRI KEMBALI AMAN!
            </h2>
            <p className="text-[#888888] text-xs uppercase font-mono tracking-widest mt-1 mb-6">KAMPUNG KEMBALI SEJAHTERA</p>

            <p className="text-sm text-zinc-300 leading-relaxed max-w-md mx-auto mb-6">
              Dengan pemahaman investigasi yang luar biasa dan ketelitian tiada tara, kamu berhasil menetralisir seluruh siasat jahat Begal Pocong selama 5 malam penuh kepanikan. Aparat kapolsek setempat akhirnya menyergap geng begal palsu bersenjatakan celurit berkat informasi akurat darimu!
            </p>

            <div className="bg-[#110505] p-5 border border-[#331111] max-w-sm mx-auto mb-8">
              <div className="text-[10px] text-[#888888] font-mono uppercase tracking-widest mb-1.5">SKOR PENYELAMATAN SEJATI</div>
              <div className="text-3xl font-black text-emerald-400 font-mono tracking-widest">{gameState.score} PTS</div>
              <span className="text-[9px] text-[#666666] font-mono uppercase mt-1 block">Pangkat: Detektif Keamanan Siskamling</span>
            </div>

            <button
              id="btn_restart_game_complete"
              onClick={handleRestartAll}
              className="group relative cursor-pointer"
            >
              <div className="absolute -inset-1.5 bg-yellow-500 opacity-20 blur"></div>
              <div className="relative bg-yellow-500 text-black px-10 py-3.5 font-bold text-xs uppercase tracking-widest text-center hover:scale-103 transition-transform">
                MAIN UTAMA LAGI
              </div>
            </button>
          </motion.div>
        )}

      </main>

      {/* WHATSAPP SIDEBAR OVERLAY */}
      <PhoneChat 
        messages={chatMessages}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        nightNumber={gameState.currentNight}
      />

      {/* FOOTER CO-FOUNDERS NOTE */}
      <footer className="w-full text-center py-6 border-t border-[#331111] flex flex-col sm:flex-row justify-between items-center z-10 px-6 font-mono text-[10px] text-[#444444] tracking-widest mt-12 gap-2">
        <div>INDIE DEV PROJECT // TEROR_BEGAL_POCONG_V1.5</div>
        <div className="flex gap-4">
          <span>FPS: 60.00</span>
          <span>LATENCY: 12MS</span>
          <span className="text-[#ff2200] animate-pulse">SISTEM AKTIF: PERTAHANAN RUMAH</span>
        </div>
      </footer>
    </div>
  );
}
