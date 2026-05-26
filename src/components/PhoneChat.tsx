/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { Shield, MessageSquare, AlertTriangle, Send, User } from 'lucide-react';
import { horrorAudio } from '../utils/audio';

interface PhoneChatProps {
  messages: ChatMessage[];
  isOpen: boolean;
  onClose: () => void;
  nightNumber: number;
}

export const PhoneChat: React.FC<PhoneChatProps> = ({ messages, isOpen, onClose, nightNumber }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when chat updates or opens
  useEffect(() => {
    if (isOpen && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col font-sans text-white transition-all duration-300 transform translate-x-0">
      {/* Top Bar of the Phone Simulation */}
      <div className="bg-emerald-900 px-4 py-3 flex items-center justify-between border-b border-emerald-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-white shadow-inner relative">
            🚨
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-emerald-900 animate-pulse"></span>
          </div>
          <div>
            <h3 className="font-semibold text-sm leading-tight text-emerald-50">SIAGA WARGA RT 04</h3>
            <span className="text-xs text-emerald-300">Hubungan Masyarakat Siskamling</span>
          </div>
        </div>
        <button 
          id="close_chat_btn"
          onClick={() => {
            horrorAudio.playFlashlightClick();
            onClose();
          }}
          className="text-emerald-100 hover:text-white px-3 py-1 rounded bg-emerald-800/50 hover:bg-emerald-800 text-xs transition-colors"
        >
          KEMBALI
        </button>
      </div>

      {/* Network / Status Info Banner */}
      <div className="bg-zinc-900 px-4 py-1.5 flex justify-between items-center text-[10px] text-zinc-400 border-b border-zinc-800 shrink-0 select-none">
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3 text-emerald-500" />
          <span>Enkripsi 256-bit Terenkripsi</span>
        </div>
        <span className="font-mono text-xs text-red-400 font-bold animate-pulse">MALAM {nightNumber}</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950/95 scrollbar-thin scrollbar-thumb-zinc-800" style={{ backgroundImage: 'radial-gradient(circle, rgba(16,185,129,0.03) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        <div className="text-center my-2">
          <span className="bg-zinc-800/80 text-[10px] text-zinc-400 px-3 py-1 rounded-full border border-zinc-700">
            HARI INI
          </span>
        </div>

        {messages.map((msg) => {
          const isLokalInfo = msg.senderRole === 'news' || msg.senderRole === 'rt';
          return (
            <div 
              key={msg.id} 
              className={`flex flex-col max-w-[85%] ${
                isLokalInfo ? 'mx-auto w-full text-center' : 'ml-0'
              }`}
            >
              {isLokalInfo ? (
                // Official Alert Message Style
                <div id={`chat_alert_${msg.id}`} className="bg-red-950/40 border border-red-900/60 rounded-xl p-3 my-2 text-left relative overflow-hidden backdrop-blur-sm shadow-md animate-fade-in">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-red-900/10 rounded-full blur-xl translate-x-4 -translate-y-4 pointer-events-none"></div>
                  <div className="flex gap-2 text-xs font-bold text-red-400 mb-1 items-center">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{msg.sender.toUpperCase()}</span>
                    <span className="text-[9px] text-zinc-500 font-normal ml-auto font-mono">{msg.timestamp}</span>
                  </div>
                  <p className="text-xs text-zinc-200 leading-relaxed font-sans">{msg.content}</p>
                </div>
              ) : (
                // Regular Neighbor Message Bubble
                <div id={`chat_bubble_${msg.id}`} className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-none p-3 shadow-md transition-all hover:border-zinc-700">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer">{msg.sender}</span>
                    <span className="text-[9px] text-zinc-500 font-mono">{msg.timestamp}</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed break-words">{msg.content}</p>
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Spooky Tip Banner */}
      <div className="p-3 bg-red-950/20 border-t border-zinc-800 text-xs text-red-300 flex gap-2 items-start shrink-0">
        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5 animate-pulse" />
        <p className="leading-tight">
          Cek WA secara berkala jika ada ketukan malam. Begal pocong adalah manusia dengan pakaian palsu—periksa detail kets, celurit, dan aromanya!
        </p>
      </div>
    </div>
  );
};
