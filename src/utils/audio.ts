/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Custom Web Audio API horror sound synthesizer.
// Eliminates the need for external MP3 assets, guaranteeing perfect performance and no network failures.

class HorrorAudioEngine {
  private ctx: AudioContext | null = null;
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private heartbeatInterval: any = null;
  private currentVolume: number = 0.5;
  private isMuted: boolean = false;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (this.droneGain && this.ctx) {
      this.droneGain.gain.setValueAtTime(this.currentVolume * 0.15, this.ctx.currentTime);
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      if (this.droneGain) this.droneGain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
    } else {
      if (this.droneGain && this.ctx) {
        this.droneGain.gain.setValueAtTime(this.currentVolume * 0.15, this.ctx.currentTime);
      }
    }
    return this.isMuted;
  }

  getMuted() {
    return this.isMuted;
  }

  // Plays a low-frequency bone-chilling drone
  startSpookyDrone() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.droneOsc) this.stopSpookyDrone();

      const ctx = this.ctx;
      this.droneOsc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      
      this.droneGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      this.droneOsc.type = 'sawtooth';
      this.droneOsc.frequency.setValueAtTime(55, ctx.currentTime); // Low A

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(55.5, ctx.currentTime); // Detuned for beating effect

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, ctx.currentTime);
      filter.Q.setValueAtTime(4, ctx.currentTime);

      this.droneGain.gain.setValueAtTime(this.isMuted ? 0 : this.currentVolume * 0.15, ctx.currentTime);

      // Connect nodes
      this.droneOsc.connect(filter);
      osc2.connect(filter);
      filter.connect(this.droneGain);
      this.droneGain.connect(ctx.destination);

      this.droneOsc.start();
      osc2.start();

      // Slow volume modulation simulating wind
      const modulation = () => {
        if (!this.droneGain || this.isMuted) return;
        const now = ctx.currentTime;
        const volumeFactor = 0.05 + Math.random() * 0.1;
        this.droneGain.gain.linearRampToValueAtTime(this.currentVolume * volumeFactor, now + 2 + Math.random() * 3);
        setTimeout(modulation, 4000);
      };
      modulation();

    } catch (e) {
      console.warn("Audio Context failed to start:", e);
    }
  }

  stopSpookyDrone() {
    if (this.droneOsc) {
      try {
        this.droneOsc.stop();
      } catch (e) {}
      this.droneOsc = null;
    }
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // Synthesizes a rapid thump for heartbeats in tense moments
  playHeartbeat(stressPercent: number) {
    this.init();
    if (!this.ctx || this.isMuted) return;

    // Clear existing interval if any
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    // Determine interval speed based on stress (stress ranges from 0 to 100)
    // 0 stress = 1200ms interval, 100 stress = 350ms interval
    const intervalMs = Math.max(350, 1300 - (stressPercent * 9.5));

    this.heartbeatInterval = setInterval(() => {
      this.triggerSingleHeartbeat();
    }, intervalMs);
  }

  triggerSingleHeartbeat() {
    if (!this.ctx || this.isMuted) return;
    const ctx = this.ctx;
    
    // Beat consists of two quick low thumps (lub-dub)
    const playThump = (offset: number, freq: number, duration: number, volFactor: number) => {
      const now = ctx.currentTime + offset;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(5, now + duration);

      gain.gain.setValueAtTime(this.currentVolume * volFactor * 0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    };

    // "Lub"
    playThump(0, 60, 0.15, 0.7);
    // "Dub"
    playThump(0.18, 55, 0.18, 0.5);
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // Flashlight click sound
  playFlashlightClick() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.setValueAtTime(150, now + 0.02);

    gain.gain.setValueAtTime(this.currentVolume * 0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Eerie Wood Door knocking sounds
  playDoorKnock(heavy: boolean = false) {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Simulate 3 standard knocks
    const numKnocks = heavy ? 4 : 3;
    const gap = heavy ? 0.22 : 0.28;

    for (let i = 0; i < numKnocks; i++) {
      const time = now + (i * gap);
      
      const osc = ctx.createOscillator();
      const noise = ctx.createGain(); // filter noise
      const gain = ctx.createGain();

      osc.type = 'triangle';
      // Heavy knock is lower pitch and louder
      osc.frequency.setValueAtTime(heavy ? 65 : 85, time);
      osc.frequency.exponentialRampToValueAtTime(10, time + 0.12);

      gain.gain.setValueAtTime(heavy ? this.currentVolume * 0.8 : this.currentVolume * 0.5, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + 0.16);
    }
  }

  // WhatsApp notification ring
  playNotificationDing() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.51, now);
    osc2.frequency.setValueAtTime(1975.53, now + 0.08); // B6

    gain.gain.setValueAtTime(this.currentVolume * 0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + 0.45);
    osc2.stop(now + 0.45);
  }

  // Horror Celurit Slash jump scare (sickle slice + distorted scream)
  playJumpscare() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // 1. Blade Slash Sound: High frequency white noise explosion filtered
    const bufferSize = ctx.sampleRate * 0.5; // 0.5 sec
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;

    const slashFilter = ctx.createBiquadFilter();
    slashFilter.type = 'bandpass';
    slashFilter.frequency.setValueAtTime(2000, now);
    slashFilter.frequency.exponentialRampToValueAtTime(400, now + 0.3);

    const slashGain = ctx.createGain();
    slashGain.gain.setValueAtTime(this.currentVolume * 0.9, now);
    slashGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    noiseNode.connect(slashFilter);
    slashFilter.connect(slashGain);
    slashGain.connect(ctx.destination);
    noiseNode.start(now);

    // 2. Chilling Screech Jumpscare: Low detuned frequencies and screaming oscillators
    const numOscs = 4;
    for (let i = 0; i < numOscs; i++) {
      const osc = ctx.createOscillator();
      const oGain = ctx.createGain();
      
      osc.type = i % 2 === 0 ? 'sawtooth' : 'square';
      // Eerie dissonant chords
      const baseFreq = 80 + (i * 123.45);
      osc.frequency.setValueAtTime(baseFreq, now);
      // Sweeping frequency violently for panic
      osc.frequency.linearRampToValueAtTime(baseFreq * (2.5 + Math.random()), now + 1.2);
      
      oGain.gain.setValueAtTime(this.currentVolume * 0.35, now);
      oGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      osc.connect(oGain);
      oGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.6);
    }

    // 3. Low Impact Doom hit
    const doomOsc = ctx.createOscillator();
    const doomGain = ctx.createGain();
    doomOsc.type = 'triangle';
    doomOsc.frequency.setValueAtTime(45, now);
    doomOsc.frequency.linearRampToValueAtTime(20, now + 0.7);
    doomGain.gain.setValueAtTime(this.currentVolume * 0.8, now);
    doomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    doomOsc.connect(doomGain);
    doomGain.connect(ctx.destination);
    doomOsc.start(now);
    doomOsc.stop(now + 0.9);
  }

  // Safe chime on level clear or correct verification
  playSuccessChime() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(this.currentVolume * 0.15, now + idx * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.5);
    });
  }

  // Eerie radio white noise / whisper
  playRadioStatic(state: boolean) {
    this.init();
    if (!this.ctx || this.isMuted) return;
    // We can simulate radio noise or just static bursts during dialogues
    if (state) {
      const ctx = this.ctx;
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, ctx.currentTime);
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(this.currentVolume * 0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    }
  }
}

export const horrorAudio = new HorrorAudioEngine();
