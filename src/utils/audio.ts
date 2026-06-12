/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioSynth {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playTap() {
    try {
      const ctx = this.init();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      // Audio context might be blocked or unsupported in preview frame
    }
  }

  playCoin() {
    try {
      const ctx = this.init();
      const now = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5

      gain.gain.setValueAtTime(0.10, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(now + 0.25);
    } catch (e) {
      // Ignored
    }
  }

  playBuzzer() {
    try {
      const ctx = this.init();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.22);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(now + 0.22);
    } catch (e) {
      // Ignored
    }
  }

  playLevelUp() {
    try {
      const ctx = this.init();
      const now = ctx.currentTime;

      const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.08, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.25);
      });
    } catch (e) {
      // Ignored
    }
  }
}

class CompanionVoice {
  private activeAudio: HTMLAudioElement | null = null;
  private TOGGLE_KEY = "clats_companion_narration_enabled_v2";
  private VOICE_FILES_KEY = "clats_companion_voice_urls_v2";

  // Check if narration is enabled for a given age group
  isNarrationEnabled(ageGroup: string): boolean {
    const ag = ageGroup?.toLowerCase() || "";
    if (ag.includes("early") || ag.includes("explorers") || ag === "early explorers") {
      // Ages 2-5 ("early explorers") is enabled by default
      const stored = localStorage.getItem(this.TOGGLE_KEY + "_early");
      return stored === null ? true : stored === "true";
    }
    // Ages 6-18 ("young innovators", "future builders") has toggle (default off till turned on)
    const stored = localStorage.getItem(this.TOGGLE_KEY + "_" + ag.replace(/\s+/g, "_"));
    return stored === "true";
  }

  setNarrationEnabled(ageGroup: string, enabled: boolean) {
    const ag = (ageGroup || "").toLowerCase().replace(/\s+/g, "_");
    const key = ag.includes("early") ? "early" : ag;
    localStorage.setItem(this.TOGGLE_KEY + "_" + key, String(enabled));
  }

  // Retrieve stored voice paths/URLs (Supabase storage or fallback local static files)
  getVoiceUrls(): { kobe: string; chibi: string } {
    try {
      const stored = localStorage.getItem(this.VOICE_FILES_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}

    return {
      kobe: "Kobe_Greeting_Intro_Nigeria.mp3",
      chibi: "Chibi_Bedtime_Story_Axe_Senegal.mp3"
    };
  }

  setVoiceUrls(urls: { kobe: string; chibi: string }) {
    localStorage.setItem(this.VOICE_FILES_KEY, JSON.stringify(urls));
  }

  // Play audio file from Supabase storage or fall back to high quality voice synthesis
  async speak(text: string, character: "kobe" | "chibi", ageGroup: string, checkToggle: boolean = true) {
    if (checkToggle && !this.isNarrationEnabled(ageGroup)) {
      return;
    }

    try {
      // Cancel any ongoing speech synthesis
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      // Stop any ongoing static file playback
      if (this.activeAudio) {
        this.activeAudio.pause();
        this.activeAudio = null;
      }

      const normText = text.toLowerCase().trim();
      const urls = this.getVoiceUrls();

      let shouldPlayFile = false;
      let fileUrl = "";

      // If the text is specifically a general welcome, play the file!
      if (character === "kobe" && (normText.includes("hello") || normText.includes("welcome") || normText.includes("kobe!"))) {
        shouldPlayFile = true;
        fileUrl = urls.kobe;
      } else if (character === "chibi" && (normText.includes("hello") || normText.includes("welcome") || normText.includes("chibi!"))) {
        shouldPlayFile = true;
        fileUrl = urls.chibi;
      }

      if (shouldPlayFile && fileUrl) {
        const finalUrl = (fileUrl.startsWith("http") || fileUrl.startsWith("/"))
          ? fileUrl
          : `/api/companion-voices/${fileUrl}`;

        const audio = new Audio(finalUrl);
        this.activeAudio = audio;
        audio.volume = 1.0;

        // Play the audio
        audio.play().catch(playErr => {
          console.warn("Audio file blocked or not found, falling back to TTS:", playErr);
          this.speakTTS(text, character, ageGroup);
        });
      } else {
        // Dynamic text-to-speech fallback
        this.speakTTS(text, character, ageGroup);
      }
    } catch (e) {
      console.warn("CompanionVoice speak error:", e);
    }
  }

  // Custom high precision speech synthesizer matching companion personality
  speakTTS(text: string, character: "kobe" | "chibi", ageGroup: string) {
    if (!("speechSynthesis" in window)) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";

      if (character === "kobe") {
        utterance.pitch = 0.90;
        utterance.rate = 0.95;
      } else {
        utterance.pitch = 1.25;
        utterance.rate = 1.02;
      }

      if (window.speechSynthesis.getVoices) {
        const voices = window.speechSynthesis.getVoices();
        let selectedVoice = null;

        if (character === "chibi") {
          selectedVoice = voices.find(v =>
            v.lang.startsWith("en") &&
            (v.name.toLowerCase().includes("female") ||
             v.name.toLowerCase().includes("zira") ||
             v.name.toLowerCase().includes("samantha") ||
             v.name.toLowerCase().includes("hazel") ||
             v.name.toLowerCase().includes("google us english"))
          );
        } else {
          selectedVoice = voices.find(v =>
            v.lang.startsWith("en") &&
            (v.name.toLowerCase().includes("male") ||
             v.name.toLowerCase().includes("david") ||
             v.name.toLowerCase().includes("google uk english male"))
          );
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("CompanionVoice speakTTS error:", e);
    }
  }

  stop() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (this.activeAudio) {
      this.activeAudio.pause();
      this.activeAudio = null;
    }
  }
}

export const companionVoice = new CompanionVoice();
export const sfx = new AudioSynth();
