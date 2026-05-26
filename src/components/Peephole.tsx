/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Visitor } from '../types';
import { Eye, HelpCircle, Flame, EyeOff, Sparkles, AlertTriangle } from 'lucide-react';
import { horrorAudio } from '../utils/audio';

interface PeepholeProps {
  visitor: Visitor | null;
  onClueDiscovered: (category: 'face' | 'shroud' | 'hands' | 'feet' | 'voice' | 'scent') => void;
  revealedClues: {
    feet: boolean;
    hands: boolean;
    shroud: boolean;
    face: boolean;
    voice: boolean;
    scent: boolean;
  };
  batteryLevel: number;
  flashlightOn: boolean;
  toggleFlashlight: () => void;
}

export const Peephole: React.FC<PeepholeProps> = ({
  visitor,
  onClueDiscovered,
  revealedClues,
  batteryLevel,
  flashlightOn,
  toggleFlashlight
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pointerPos, setPointerPos] = useState({ x: 150, y: 150 });
  const [activeRegion, setActiveRegion] = useState<'face' | 'shroud' | 'hands' | 'feet' | null>(null);

  // Update spotlight position on mouse move or touch drag
  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || !flashlightOn || batteryLevel <= 0) return;

    const rect = containerRef.current.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches[0]) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        return;
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
    setPointerPos({ x, y });

    // Determine regions based on relative Y coordinates
    const relativeYPercent = (y / rect.height) * 100;
    let region: 'face' | 'shroud' | 'hands' | 'feet' | null = null;

    if (relativeYPercent < 32) {
      region = 'face';
    } else if (relativeYPercent >= 32 && relativeYPercent < 58) {
      region = 'shroud';
    } else if (relativeYPercent >= 58 && relativeYPercent < 78) {
      region = 'hands';
    } else {
      region = 'feet';
    }

    setActiveRegion(region);

    // Call callback to trigger state discovery
    if (region && visitor) {
      onClueDiscovered(region);
    }
  };

  const handlePointerLeave = () => {
    setActiveRegion(null);
  };

  // Sound effect on turning flashlight toggle
  const handleToggleSenter = () => {
    horrorAudio.playFlashlightClick();
    toggleFlashlight();
  };

  // Eerie breathing effect on visitor load
  useEffect(() => {
    if (visitor && flashlightOn) {
      // Simulate heavy suspense heartbeat
      horrorAudio.playHeartbeat(65);
    } else {
      horrorAudio.stopHeartbeat();
    }
  }, [visitor, flashlightOn]);

  // Use the generated circular empty peephole background
  const emptyPeepholeImg = "/src/assets/images/peep_hole_view_empty_1779779086076.png";

  return (
    <div className="flex flex-col items-center bg-zinc-950 p-4 border border-zinc-900 rounded-2xl max-w-md w-full mx-auto select-none">
      <div className="w-full flex items-center justify-between mb-3 text-xs text-zinc-400">
        <span className="flex items-center gap-1.5 text-zinc-300 font-bold font-mono">
          <Eye className="w-4 h-4 text-emerald-500 animate-pulse" />
          LUBANG INTIP PINTU (PEEPHOLE)
        </span>
        
        {/* Battery Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-[10px]">Baterai Senter:</span>
          <div className="w-12 h-3.5 bg-zinc-900 border border-zinc-700 rounded p-0.5 relative flex overflow-hidden">
            <div 
              style={{ width: `${batteryLevel}%` }}
              className={`h-full rounded-sm transition-all duration-300 ${
                batteryLevel > 50 ? 'bg-emerald-500' : batteryLevel > 20 ? 'bg-amber-500' : 'bg-red-600 animate-pulse'
              }`}
            ></div>
            <span className="absolute inset-0 text-[8px] font-mono font-bold text-center flex items-center justify-center text-white">
              {Math.floor(batteryLevel)}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Fish-Eye Peephole Canvas Frame */}
      <div 
        id="peephole_viewer"
        ref={containerRef}
        onMouseMove={handlePointerMove}
        onTouchMove={handlePointerMove}
        onMouseLeave={handlePointerLeave}
        className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-full border-4 border-zinc-800 bg-black relative overflow-hidden cursor-crosshair shadow-[0_0_40px_rgba(0,0,0,0.95)] transition-all duration-300 hover:border-zinc-700"
        style={{
          boxShadow: 'inset 0 0 50px rgba(0,0,0,1), 0 0 30px rgba(0,0,0,0.8)'
        }}
      >
        {/* Render empty misty yard background underneath */}
        <img 
          src={emptyPeepholeImg} 
          alt="Mist Porch" 
          className="w-full h-full object-cover select-none pointer-events-none opacity-50 absolute inset-0"
          referrerPolicy="no-referrer"
        />

        {/* Spooky Visitor Silhouette overlay when light is OFF */}
        {visitor && (
          <div 
            className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${
              flashlightOn && batteryLevel > 0 ? 'opacity-85' : 'opacity-20 animate-pulse'
            }`}
          >
            {/* Vector Spooky Human/Pocong shape contour */}
            <div className={`w-32 h-64 bg-zinc-950/90 filter blur-sm transition-all duration-300 rounded-3xl ${visitor.role === 'ghost' ? 'mt-[-10px] animate-bounce' : 'mt-4'}`} style={{ animationDuration: '4s' }}>
              {/* Shroud knots rendering */}
              <div className="w-10 h-6 bg-zinc-900 mx-auto rounded-full mt-2 border border-zinc-800"></div>
            </div>
          </div>
        )}

        {/* FLASH LIGHT SPOTLIGHT EFFECT OVERLAY via Radial Gradient mask */}
        {flashlightOn && batteryLevel > 0 ? (
          <div 
            className="absolute inset-0 pointer-events-none transition-all duration-75"
            style={{
              background: `radial-gradient(circle 50px at ${pointerPos.x}px ${pointerPos.y}px, transparent 100%, rgba(0, 0, 0, 0.98) 100%)`
            }}
          />
        ) : (
          /* Pitch Black Cover when senter is OFF or dead battery */
          <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center pointer-events-none p-4">
            <EyeOff className="w-12 h-12 text-zinc-800 mb-2" />
            <p className="text-[10px] text-zinc-600 text-center uppercase tracking-wider font-mono">Gelap Gulita. Nyalakan senter untuk mengintip!</p>
          </div>
        )}

        {/* Dynamic Interactive Clue Overlays. Only visible inside the matching flashlight coordinate spotlight */}
        {visitor && flashlightOn && batteryLevel > 0 && (
          <>
            {/* AREA 1: FACE (W Y < 32%) */}
            <div 
              style={{ top: '15%' }}
              className={`absolute inset-x-0 mx-auto w-[85%] text-center p-2 rounded-lg bg-zinc-950/90 border border-zinc-800 shadow-lg text-[10px] pointer-events-none transition-all duration-200 ${
                activeRegion === 'face' ? 'opacity-100 translate-y-0 scale-100 border-yellow-500/50' : 'opacity-0 scale-95'
              }`}
            >
              <div className="flex items-center gap-1.5 text-yellow-500 font-bold mb-0.5 justify-center">
                <Flame className="w-3 h-3 text-red-500 animate-pulse" />
                <span>BAGIAN WAJAH</span>
              </div>
              <p className="text-zinc-200 leading-normal font-sans italic">{visitor.visualClues.face}</p>
            </div>

            {/* AREA 2: SHROUD (32% <= Y < 58%) */}
            <div 
              style={{ top: '38%' }}
              className={`absolute inset-x-0 mx-auto w-[85%] text-center p-2 rounded-lg bg-zinc-950/90 border border-zinc-800 shadow-lg text-[10px] pointer-events-none transition-all duration-200 ${
                activeRegion === 'shroud' ? 'opacity-100 translate-y-0 scale-100 border-emerald-500/50' : 'opacity-0 scale-95'
              }`}
            >
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-0.5 justify-center">
                <Sparkles className="w-3 h-3 animate-spin" />
                <span>PAKAIAN / KAFAN</span>
              </div>
              <p className="text-zinc-200 leading-normal font-sans italic">{visitor.visualClues.shroud}</p>
            </div>

            {/* AREA 3: HANDS (58% <= Y < 78%) */}
            <div 
              style={{ top: '60%' }}
              className={`absolute inset-x-0 mx-auto w-[85%] text-center p-2 rounded-lg bg-zinc-950/90 border border-zinc-800 shadow-lg text-[10px] pointer-events-none transition-all duration-200 ${
                activeRegion === 'hands' ? 'opacity-100 translate-y-0 scale-100 border-red-500/50' : 'opacity-0 scale-95'
              }`}
            >
              <div className="flex items-center gap-1.5 text-red-500 font-bold mb-0.5 justify-center">
                <AlertTriangle className="w-3 h-3 animate-bounce" />
                <span>BAGIAN TANGAN / BARANG</span>
              </div>
              <p className="text-zinc-200 leading-normal font-sans italic">{visitor.visualClues.hands}</p>
            </div>

            {/* AREA 4: FEET (Y >= 78%) */}
            <div 
              style={{ bottom: '12%' }}
              className={`absolute inset-x-0 mx-auto w-[85%] text-center p-2 rounded-lg bg-zinc-950/90 border border-zinc-800 shadow-lg text-[10px] pointer-events-none transition-all duration-200 ${
                activeRegion === 'feet' ? 'opacity-100 translate-y-0 scale-100 border-cyan-500/50' : 'opacity-0 scale-95'
              }`}
            >
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-0.5 justify-center">
                <HelpCircle className="w-3 h-3" />
                <span>BAGIAN KAKI / SEPATU</span>
              </div>
              <p className="text-zinc-100 leading-normal font-sans italic">{visitor.visualClues.feet}</p>
            </div>
          </>
        )}
      </div>

      {/* Control Buttons */}
      <div className="w-full mt-4 flex gap-2">
        <button
          id="btn_toggle_senter"
          onClick={handleToggleSenter}
          disabled={batteryLevel <= 0}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-2 ${
            flashlightOn && batteryLevel > 0
              ? 'bg-amber-600 text-black border-amber-500 hover:bg-amber-500 shadow-lg'
              : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700 hover:text-white'
          }`}
        >
          {flashlightOn && batteryLevel > 0 ? 'MATIKAN SENTER' : 'NYALAKAN SENTER'}
        </button>
      </div>

      {/* Guide label */}
      <p className="text-[10px] text-zinc-500 mt-2.5 text-center leading-relaxed font-sans">
        💡 <span className="text-zinc-400 font-bold">CARA MENGINTIP:</span> Gerakkan kursor/sentuhan melingkar di lubang intip guna menyinari bagian atas (Wajah), tengah (Kafan/Tangan), maupun bawah (Kaki) secara saksama.
      </p>
    </div>
  );
};
