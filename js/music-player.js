// js/music-player.js
let globalAudio = new Audio();
let musicPlayer = null;

let playerState = {
  isPlaying: false,
  currentTrackIndex: 0,
  currentTime: 0,
  volume: 0.7,
  shuffle: false,
};

globalAudio.volume = playerState.volume;

class MusicPlayer {
  constructor() {
    this.audio = globalAudio;
    this.isPlaying = playerState.isPlaying;
    this.currentTrackIndex = playerState.currentTrackIndex || 0;
    this.shuffle = playerState.shuffle;

    this.playlist = [
      {
        title: "Squarepusher - Midi Sans Frontieres (Avec Batterie)",
        file: "assets/music/Squarepusher - Midi Sans Frontieres (Avec Batterie).opus",
      },
      {
        title: "Have a Nice Life - Bloodhail",
        file: "assets/music/Have a Nice Life - Bloodhail.opus",
      },
      { title: "Aphex Twin - #3", file: "assets/music/Aphex Twin - 3.opus" },
      { title: "bôa - Duvet", file: "assets/music/bôa - Duvet.opus" },
      {
        title: "Aphex Twin - D-Scape",
        file: "assets/music/Aphex Twin - D-Scape.opus",
      },
      {
        title: "Aphex Twin - Flim",
        file: "assets/music/Aphex Twin - Flim.opus",
      },
      {
        title: "Aphex Twin - Heliosphan",
        file: "assets/music/Aphex Twin - Heliosphan.opus",
      },
      {
        title: "Taxi - Sózinho",
        file: "assets/music/Taxi - Sózinho [hq audio + letra].opus",
      },
      {
        title: "Aphex Twin - Isoprophlex (Slow) (Cr7E Version)",
        file: "assets/music/Aphex Twin - Isoprophlex (Slow) (Cr7E Version).opus",
      },
      {
        title: "Aphex Twin - Ventolin (Marazanvose Mix)",
        file: "assets/music/Aphex Twin - Ventolin (Marazanvose Mix).opus",
      },
      {
        title: "Aphex Twin - Ventolin (Plain-An-Gwarry Mix)",
        file: "assets/music/Aphex Twin - Ventolin (Plain-An-Gwarry Mix).opus",
      },
      {
        title: "Aphex Twin - Windowlicker",
        file: "assets/music/Aphex Twin - Windowlicker [Chosen by fans on Warp20.opus",
      },
      {
        title: "Blksmiith - GORE-TEX COVERS MY SOUL",
        file: "assets/music/Blksmiith - GORE-TEX COVERS MY SOUL.opus",
      },
      {
        title: "Crystal Castles - Empathy",
        file: "assets/music/Crystal Castles - Empathy.opus",
      },
      {
        title: "Crystal Castles - Violent Dreams",
        file: "assets/music/Crystal Castles - Violent Dreams.opus",
      },
      {
        title: "Have a Nice Life - Deep, Deep",
        file: "assets/music/Have a Nice Life - Deep, Deep.opus",
      },
      {
        title: "Have a Nice Life - Holy Fucking Shit 40,000",
        file: "assets/music/Have a Nice Life - Holy Fucking Shit  40,000.opus",
      },
      {
        title: "Have a Nice Life - I Don't Love",
        file: "assets/music/Have a Nice Life - I Don t Love.opus",
      },
      {
        title: "Have a Nice Life - Music Will Untune the Sky",
        file: "assets/music/Have a Nice Life - Music Will Untune the Sky.opus",
      },
      {
        title: "Have a Nice Life - Sisyphus - Demo",
        file: "assets/music/Have a Nice Life - Sisyphus - Demo.opus",
      },
      {
        title: "Have a Nice Life - The Big Gloom",
        file: "assets/music/Have a Nice Life - The Big Gloom.opus",
      },
      {
        title: "I Monster - These Are Our Children",
        file: "assets/music/I Monster - These Are Our Children.opus",
      },
      {
        title: "Infinity Frequencies - Implanted Memories",
        file: "assets/music/Infinity Frequencies - Implanted Memories.opus",
      },
      {
        title: "KyonPalm - ｃｉｔｙｓｃａｐｅ",
        file: "assets/music/KyonPalm - ｃｉｔｙｓｃａｐｅ.opus",
      },
      {
        title: "Machine Girl - Ghost",
        file: "assets/music/Machine Girl - Ghost.opus",
      },
      {
        title: "Oneohtrix Point Never - Cryo",
        file: "assets/music/Oneohtrix Point Never - Cryo.opus",
      },
      {
        title: "Radiohead - Exit Music (For A Film)",
        file: "assets/music/Radiohead - Exit Music (For A Film).opus",
      },
      {
        title: "Slipknot - .execute.",
        file: "assets/music/Slipknot - .execute.opus",
      },
      {
        title: "Squarepusher - I Wish You Could Talk",
        file: "assets/music/Squarepusher - I Wish You Could Talk.opus",
      },
      {
        title: "Radiohead - The King Of Limbs CD 1 TRACK 1",
        file: "assets/music/The King Of Limbs CD 1 TRACK 1.opus",
      },
      { title: "Yung Lain - Ciel", file: "assets/music/Yung Lain - Ciel.opus" },
    ];

    this.rebindElements();
    this.initEventListeners();
    this.updateUIFromAudio();
  }

  rebindElements() {
    this.playButton = document.getElementById("play-button");
    this.prevButton = document.getElementById("prev-button");
    this.nextButton = document.getElementById("next-button");
    this.shuffleButton = document.getElementById("shuffle-button");
    this.volumeSlider = document.getElementById("volume-slider");
    this.nowPlaying = document.querySelector(".now-playing");
    this.trackTime = document.querySelector(".track-time");
    this.progressContainer = document.querySelector(".progress-container");
    this.progressBar = document.querySelector(".progress-bar");

    if (this.volumeSlider) {
      this.volumeSlider.addEventListener("input", () => {
        this.audio.volume = this.volumeSlider.value;
      });
    }

    if (this.progressContainer) {
      this.progressContainer.addEventListener("click", (e) => {
        const width = this.progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audio.duration;
        if (!isNaN(duration)) {
          this.audio.currentTime = (clickX / width) * duration;
        }
      });
    }

    this.updateUIFromAudio();
  }

  initEventListeners() {
    this.audio.removeEventListener("ended", this._handleEnded);
    this.audio.removeEventListener("timeupdate", this._handleTimeUpdate);
    this.audio.removeEventListener("loadedmetadata", this._handleMetadata);
    this.audio.removeEventListener("error", this._handleError);

    this._handleEnded = () => this.next();
    this._handleTimeUpdate = () => this.updateProgress();
    this._handleMetadata = () => this.updateTrackTime();
    this._handleError = (e) => {
      console.error("Audio error:", e);
      this.nowPlaying.textContent = "Error loading track";
      setTimeout(() => this.next(), 2000);
    };

    this.audio.addEventListener("ended", this._handleEnded);
    this.audio.addEventListener("timeupdate", this._handleTimeUpdate);
    this.audio.addEventListener("loadedmetadata", this._handleMetadata);
    this.audio.addEventListener("error", this._handleError);
  }

  updateUIFromAudio() {
    if (!this.volumeSlider) return;

    this.volumeSlider.value = this.audio.volume;
    if (this.audio.paused) {
      this.isPlaying = false;
      this.playButton?.classList.remove("active");
      this.playButton && (this.playButton.textContent = "PLAY");
    } else {
      this.isPlaying = true;
      this.playButton?.classList.add("active");
      this.playButton && (this.playButton.textContent = "STOP");
    }

    if (this.audio.src) {
      const decodedSrc = decodeURIComponent(this.audio.src);

      const match = this.playlist.find((track) =>
        decodedSrc.endsWith(track.file),
      );

      if (match && this.nowPlaying) {
        this.nowPlaying.textContent = match.title;
      } else {
        this.nowPlaying && (this.nowPlaying.textContent = "Unknown Track 🎵");
      }
    } else {
      this.nowPlaying && (this.nowPlaying.textContent = "Nothing playing");
    }

    this.shuffleButton?.classList.toggle("active", this.shuffle);
  }

  togglePlay() {
    if (!this.audio.src) {
      this.loadTrack(this.currentTrackIndex);
    }

    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.audio.play();
    this.isPlaying = true;
    playerState.isPlaying = true;
    this.playButton?.classList.add("active");
    this.playButton && (this.playButton.textContent = "STOP");
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    playerState.isPlaying = false;
    this.playButton?.classList.remove("active");
    this.playButton && (this.playButton.textContent = "PLAY");
  }

  next() {
    if (this.shuffle) {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * this.playlist.length);
      } while (
        nextIndex === this.currentTrackIndex &&
        this.playlist.length > 1
      );
      this.loadTrack(nextIndex);
    } else {
      this.loadTrack(this.currentTrackIndex + 1);
    }
  }

  previous() {
    if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
    } else {
      this.loadTrack(this.currentTrackIndex - 1);
    }
  }

  loadTrack(index) {
    if (index < 0) index = this.playlist.length - 1;
    if (index >= this.playlist.length) index = 0;

    this.currentTrackIndex = index;
    playerState.currentTrackIndex = index;
    const track = this.playlist[index];

    this.nowPlaying && (this.nowPlaying.textContent = track.title);
    this.progressBar && (this.progressBar.style.width = "0%");
    this.trackTime && (this.trackTime.textContent = "0:00 / 0:00");

    this.audio.src = track.file;
    this.audio.load();

    if (this.isPlaying) {
      this.play();
    }
  }

  findCurrentTrack() {
    if (!this.audio.src) return;

    const currentFile = this.audio.src.split("/").pop();
    let foundIndex = -1;

    for (let i = 0; i < this.playlist.length; i++) {
      if (
        this.playlist[i].file.includes(currentFile) ||
        currentFile.includes(this.playlist[i].file.split("/").pop())
      ) {
        foundIndex = i;
        break;
      }
    }

    if (foundIndex >= 0) {
      this.currentTrackIndex = foundIndex;
      playerState.currentTrackIndex = foundIndex;
      return this.playlist[foundIndex].title;
    }

    return "Unknown track";
  }

  toggleShuffle() {
    this.shuffle = !this.shuffle;
    playerState.shuffle = this.shuffle;
    this.shuffleButton?.classList.toggle("active", this.shuffle);
  }

  updateProgress() {
    if (!this.progressBar) return;
    const progressPercent =
      (this.audio.currentTime / (this.audio.duration || 1)) * 100;
    this.progressBar.style.width = `${progressPercent}%`;
    this.updateTrackTime();
  }

  updateTrackTime() {
    if (!this.trackTime) return;
    const currentTime = this.formatTime(this.audio.currentTime);
    const duration = this.formatTime(this.audio.duration || 0);
    this.trackTime.textContent = `${currentTime} / ${duration}`;
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }
}

function initMusicPlayer() {
  if (!musicPlayer && document.getElementById("play-button")) {
    console.log("Initializing music player");
    musicPlayer = new MusicPlayer();
  }
}

document.addEventListener("click", (e) => {
  if (!musicPlayer) return;

  const id = e.target.id;

  switch (id) {
    case "play-button":
      musicPlayer.togglePlay();
      break;
    case "next-button":
      musicPlayer.next();
      break;
    case "prev-button":
      musicPlayer.previous();
      break;
    case "shuffle-button":
      musicPlayer.toggleShuffle();
      break;
  }
});

document.addEventListener("keydown", (e) => {
  if (!musicPlayer) return;
  if (e.target.tagName.toLowerCase() === "input") return;

  switch (e.key) {
    case " ":
      musicPlayer.togglePlay();
      e.preventDefault();
      break;
    case "n":
    case "ArrowRight":
      musicPlayer.next();
      break;
    case "p":
    case "ArrowLeft":
      musicPlayer.previous();
      break;
    case "r":
      musicPlayer.toggleShuffle();
      break;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1) {
          if (
            node.querySelector?.("#play-button") ||
            node.id === "play-button"
          ) {
            if (!musicPlayer) {
              initMusicPlayer();
            } else {
              musicPlayer.rebindElements();
            }
            return; // only act once
          }
        }
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  initMusicPlayer();
});
