export interface Visitor {
  id: string;
  name: string;
  role: 'neighbor' | 'ronda' | 'relative' | 'courier' | 'begal' | 'ghost';
  isBegal: boolean;
  secretIdentity: string;
  // Clues that players must inspect and cross-verify with their phone/rules
  visualClues: {
    feet: string;        // e.g., "Memakai sepatu kets merah", "Kaki melayang tidak menyentuh tanah", "Kaki berlumur tanah basah"
    hands: string;       // e.g., "Tangan kiri menenteng celurit berkilau", "Tangan memakai jam Casio emas", "Tangan terikat erat di kapur"
    shroud: string;      // e.g., "Kain kafan putih bersih dengan lipatan pabrik", "Kain kafan lusuh berlumuran tanah", "Kain kafan dengan logo distro gantung"
    face: string;        // e.g., "Wajah memakai topeng plastik badut di sela kafan", "Mata merah menyala kosong", "Mata berkerut memakai kacamata hitam"
  };
  audioClue: string;     // The sound or voice they make
  scentClue: string;     // What they smell like through the door gaps
  gossipWarning?: string;// Specific rumor circulating about them in WhatsApp or Radio
  
  // Custom responses
  dialogues: {
    intro: string;       // First words when they knock
    respondToQuestion: string; // How they respond when you ask "Siapa ya?" or ask details
    onOpenSuccess: string;  // What happens if you open it (if friendly)
    onOpenFail: string;     // What happens if you open it (if Begal / Hostile)
  };
}

export interface ChatMessage {
  id: string;
  sender: string;
  senderRole: 'rt' | 'ronda' | 'neighbor' | 'spon' | 'news';
  content: string;
  timestamp: string;
  isHint?: boolean;
}

export interface GameState {
  currentNight: number;   // Level 1 to 5
  currentHour: number;    // 00:00 to 05:00 (5 hours to survive per night)
  stressLevel: number;    // 0 to 100%, if too high, visual shakes and panic sounds
  batteryLevel: number;   // 0 to 100% for flashlight
  score: number;          // Survivor points
  gamePhase: 'intro' | 'playing' | 'peephole' | 'whatsapp' | 'gameover' | 'victory' | 'ending_cutscene';
  activeVisitor: Visitor | null;
  revealedClues: {
    feet: boolean;
    hands: boolean;
    shroud: boolean;
    face: boolean;
    voice: boolean;
    scent: boolean;
  };
  logEntries: string[];
  flashlightOn: boolean;
  peepSpotlightPos: { x: number; y: number };
}

export interface NightConfig {
  nightNumber: number;
  title: string;
  subtitle: string;
  description: string;
  whatsappClues: string[]; // hints sent during the chat
  visitorList: string[];   // Visitor IDs that appear this night
}
