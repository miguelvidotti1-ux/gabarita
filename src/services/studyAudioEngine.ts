/**
 * StudyAudioEngine: Web Audio API synthesizer for study music and ambient focus tones.
 * Generates relaxing chords, lo-fi textures, and rain/piano pads with real-time volume control.
 */

class StudyAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private currentVolume = 0.7; // 0.0 to 1.0
  private oscillators: OscillatorNode[] = [];
  private noiseNode: AudioNode | null = null;
  private timerInterval: any = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(volPercent: number) {
    const clamped = Math.max(0, Math.min(100, volPercent)) / 100;
    this.currentVolume = clamped;
    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(clamped, this.ctx.currentTime + 0.05);
      } catch (e) {
        this.masterGain.gain.value = clamped;
      }
    }
  }

  public getVolumePercent(): number {
    return Math.round(this.currentVolume * 100);
  }

  public startSound(type: 'lofi' | 'classical' | 'ambient' | 'piano' | 'acoustic' = 'lofi') {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.stopSound();
    this.isPlaying = true;

    try {
      // Base chords for peaceful study
      const baseFreqs = type === 'classical' 
        ? [220, 261.63, 329.63, 440] // A minor / C major peaceful
        : type === 'piano'
        ? [174.61, 220, 261.63, 349.23] // F major 7
        : [130.81, 164.81, 196.00, 246.94]; // C major 7 lo-fi warmth

      // Create gentle oscillators with subtle detuning and lowpass filter for warmth
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(type === 'lofi' ? 450 : 800, this.ctx.currentTime);
      filter.connect(this.masterGain);

      baseFreqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        // Gentle vibrato / lofi flutter
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.2 + idx * 0.1, this.ctx.currentTime);
        lfoGain.gain.setValueAtTime(1.5, this.ctx.currentTime);
        lfo.connect(osc.frequency);
        lfo.start();

        oscGain.gain.setValueAtTime(0.12 / baseFreqs.length, this.ctx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(filter);

        osc.start();
        this.oscillators.push(osc, lfo as any);
      });

      // Subtle atmospheric noise (tape hiss / light rain texture)
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.015; // very quiet pink-like floor
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1000, this.ctx.currentTime);
      noiseFilter.Q.setValueAtTime(1.0, this.ctx.currentTime);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain);

      whiteNoise.start();
      this.noiseNode = whiteNoise;
    } catch (e) {
      console.warn('Audio synthesis note:', e);
    }
  }

  public stopSound() {
    this.isPlaying = false;
    this.oscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    this.oscillators = [];

    if (this.noiseNode) {
      try {
        (this.noiseNode as any).stop?.();
        this.noiseNode.disconnect();
      } catch (e) {}
      this.noiseNode = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const studyAudio = new StudyAudioEngine();
