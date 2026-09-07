// SRE Survival — Cyber & Among Us Style Audio Synthesizer (Web Audio API)
class CyberAudio {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('sre_sound_muted') === 'true';
    this.lastStepTime = 0;
  }

  init() {
    if (!this.ctx && typeof AudioContext !== 'undefined') {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {}
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('sre_sound_muted', this.muted ? 'true' : 'false');
    const btn = document.getElementById('btn-sound-toggle');
    if (btn) btn.textContent = this.muted ? '🔇' : '🔊';
    return this.muted;
  }

  playTone(freq, type, duration, startVol = 0.05, endVol = 0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(startVol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, endVol), this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  // Soft footstep sound (like Among Us footsteps)
  footstep() {
    if (this.muted) return;
    const now = Date.now();
    if (now - this.lastStepTime < 240) return;
    this.lastStepTime = now;
    this.playTone(180 + Math.random() * 40, 'triangle', 0.04, 0.02, 0.001);
  }

  // 2-tone PagerDuty / OpsGenie alert chime
  pagerAlert() {
    if (this.muted) return;
    this.init();
    const tones = [
      { f: 880, t: 0, d: 0.12 },
      { f: 587.33, t: 0.14, d: 0.14 },
      { f: 880, t: 0.32, d: 0.18 },
      { f: 1174.66, t: 0.54, d: 0.25 }
    ];
    tones.forEach(tone => {
      setTimeout(() => {
        this.playTone(tone.f, 'square', tone.d, 0.07, 0.001);
      }, tone.t * 1000);
    });
  }

  // Near task station proximity tone
  stationNear() {
    this.playTone(740, 'sine', 0.06, 0.03, 0.001);
  }

  // Use button click (open task)
  openTask() {
    this.playTone(600, 'triangle', 0.08, 0.05, 0.001);
    setTimeout(() => this.playTone(900, 'sine', 0.1, 0.05, 0.001), 60);
  }

  // Close task / cancel
  closeTask() {
    this.playTone(500, 'sine', 0.06, 0.04, 0.001);
  }

  // Task completed chord (classic Among Us victory chime)
  taskComplete() {
    if (this.muted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.22, 0.06, 0.001);
      }, i * 70);
    });
  }

  // Emergency Incident meeting siren (klaxon)
  emergencySiren() {
    if (this.muted) return;
    [0, 220, 440].forEach((delay) => {
      setTimeout(() => {
        this.playTone(880, 'sawtooth', 0.18, 0.08, 0.01);
        setTimeout(() => this.playTone(660, 'sawtooth', 0.18, 0.08, 0.01), 90);
      }, delay);
    });
  }

  // Map open whoosh
  mapToggle() {
    this.playTone(400, 'sine', 0.08, 0.04, 0.001);
  }
}

window.cyberAudio = new CyberAudio();
