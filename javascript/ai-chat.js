// ===== THEME =====
(function () {
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();

// ===== GLOBAL STATE =====
let currentAnalysisId = 0;
let typewriteAbort = false;
let isWaitingForResponse = false;

// Audio player state
let playing = false;
let waveH = [];
let waveTmr = null;
let progTmr = null;
let ttsStart = 0;
let ttsDur = 0;
let mxCtx = null;
let mxSrc = null;
let mxBuf = null;
let mxStart = 0;

// ===== DOM READY =====
document.addEventListener("DOMContentLoaded", async function () {
  // Theme toggle
  const themeBtn = document.querySelector(".lightmode");
  if (themeBtn) {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    themeBtn.innerHTML = isDark
      ? '<i class="fa-solid fa-moon"></i>'
      : '<i class="fa-solid fa-sun"></i>';
    themeBtn.addEventListener("click", () => {
      const dark = document.documentElement.getAttribute("data-theme") === "dark";
      document.documentElement[dark ? "removeAttribute" : "setAttribute"](
        "data-theme",
        "dark"
      );
      themeBtn.innerHTML = dark
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
      localStorage.setItem("theme", dark ? "light" : "dark");
    });
  }

  // DOM Elements
  const chatInput = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");
  const imageUploadBtn = document.getElementById("imageUploadBtn");
  const imageInputChat = document.getElementById("imageInputChat");
  const chatMessages = document.getElementById("chatMessages");
  const chatLangSelect = document.getElementById("chatLangSelect");

  if (!chatInput || !sendBtn) {
    console.error("Chat elements not found!");
    return;
  }

  // Restore language preference
  const savedLang = localStorage.getItem("ai_lang");
  if (savedLang && chatLangSelect) {
    chatLangSelect.value = savedLang;
  }

  // Auto-resize textarea
  function resizeTextarea() {
    chatInput.style.height = "auto";
    const newHeight = Math.min(chatInput.scrollHeight, 80);
    chatInput.style.height = newHeight + "px";
  }

  chatInput.addEventListener("input", resizeTextarea);
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Image upload
  imageUploadBtn.addEventListener("click", () => {
    imageInputChat.click();
  });

  imageInputChat.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        addMessage("user", null, event.target.result);
        sendAnalysis(file, null);
      };
      reader.readAsDataURL(file);
    }
    imageInputChat.value = "";
  });

  // Send button
  sendBtn.addEventListener("click", sendMessage);

  // ===== SEND MESSAGE =====
  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text || isWaitingForResponse) return;

    addMessage("user", text);
    chatInput.value = "";
    chatInput.style.height = "auto";

    sendAnalysis(null, text);
  }

  // ===== SEND ANALYSIS =====
  async function sendAnalysis(file, text) {
    currentAnalysisId++;
    const myAnalysisId = currentAnalysisId;
    typewriteAbort = false;
    isWaitingForResponse = true;
    sendBtn.disabled = true;
    imageUploadBtn.disabled = true;

    // Show loading
    const loadingId = `loading-${myAnalysisId}`;
    addMessage("bot", null, null, loadingId, true);

    const lang = chatLangSelect?.value || "uz";
    localStorage.setItem("ai_lang", lang);

    const form = new FormData();
    if (file) {
      form.append("image", file);
      form.append("type", "image");
    } else if (text) {
      form.append("text", text);
      form.append("type", "text");
    }
    form.append("lang", lang);

    try {
      const res = await fetch(`${API_BASE}/analyze-hybrid`, {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const responseText = data.description || "No response.";

      // Remove loading
      const loadingEl = document.getElementById(loadingId);
      if (loadingEl) {
        loadingEl.remove();
      }

      // Check if cancelled
      if (myAnalysisId !== currentAnalysisId) {
        isWaitingForResponse = false;
        sendBtn.disabled = false;
        imageUploadBtn.disabled = false;
        return;
      }

      // Add response with typewrite
      const msgId = `msg-${myAnalysisId}`;
      const msgEl = addMessage("bot", "", null, msgId);

      await typewrite(responseText, msgEl, myAnalysisId);

      // Add audio player
      if (myAnalysisId === currentAnalysisId && !typewriteAbort) {
        addAudioPlayer(msgEl, responseText, lang);
      }

      isWaitingForResponse = false;
      sendBtn.disabled = false;
      imageUploadBtn.disabled = false;
      chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (err) {
      console.error("Error:", err);
      const loadingEl = document.getElementById(loadingId);
      if (loadingEl) {
        loadingEl.remove();
      }
      addMessage(
        "bot",
        "❌ Error! Flask not running or API issue.\nRun: python app.py"
      );
      isWaitingForResponse = false;
      sendBtn.disabled = false;
      imageUploadBtn.disabled = false;
    }
  }

  // ===== ADD MESSAGE =====
  function addMessage(role, text, imageUrl, elementId, isLoading) {
    const msgEl = document.createElement("div");
    msgEl.className = `chat-msg ${role}`;
    if (elementId) msgEl.id = elementId;

    const avatarEl = document.createElement("div");
    avatarEl.className = "chat-msg__avatar";
    avatarEl.innerHTML =
      role === "user"
        ? '<i class="fa-solid fa-user"></i>'
        : '<i class="fa-solid fa-robot"></i>';

    const bubbleEl = document.createElement("div");
    bubbleEl.className = "chat-msg__bubble";

    if (isLoading) {
      const spinner = document.createElement("div");
      spinner.className = "chat-spinner";
      bubbleEl.appendChild(spinner);
    } else if (imageUrl) {
      const img = document.createElement("img");
      img.className = "chat-msg__image";
      img.src = imageUrl;
      bubbleEl.appendChild(img);
    } else if (text) {
      bubbleEl.textContent = text;
    }

    msgEl.appendChild(avatarEl);
    msgEl.appendChild(bubbleEl);
    chatMessages.appendChild(msgEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return bubbleEl;
  }

  // ===== TYPEWRITE =====
  function typewrite(fullText, contentEl, analysisId) {
    return new Promise((resolve) => {
      let i = 0;
      contentEl.textContent = "";

      const tick = () => {
        if (typewriteAbort || analysisId !== currentAnalysisId) {
          resolve();
          return;
        }

        if (i < fullText.length) {
          contentEl.textContent += fullText[i];
          i++;
          chatMessages.scrollTop = chatMessages.scrollHeight;
          setTimeout(tick, 4);
        } else {
          resolve();
        }
      };

      tick();
    });
  }

  // ===== ADD AUDIO PLAYER =====
  function addAudioPlayer(msgEl, text, lang) {
    const playerEl = document.createElement("div");
    playerEl.className = "chat-msg__audio";

    const audioHTML = `
      <div class="chat-audio">
        <button class="chat-audio__btn ai-audio-btn" type="button">
          <i class="fa-solid fa-headphones"></i>
        </button>
        <div class="chat-audio__wave ai-audio-wave"></div>
        <span class="chat-audio__time ai-audio-time">0:00</span>
      </div>
    `;
    playerEl.innerHTML = audioHTML;
    msgEl.appendChild(playerEl);

    // Initialize waves
    waveH = Array.from({ length: 32 }, () => 4 + Math.random() * 12);
    const waveEl = playerEl.querySelector(".ai-audio-wave");
    waveH.forEach((h) => {
      const bar = document.createElement("div");
      bar.className = "chat-audio__bar";
      bar.style.height = h + "px";
      waveEl.appendChild(bar);
    });

    const playBtn = playerEl.querySelector(".chat-audio__btn");
    playBtn.addEventListener("click", () => toggleAudio(text, lang, playBtn));
  }

  // ===== AUDIO TOGGLE =====
  async function toggleAudio(text, lang, btn) {
    if (isWaitingForResponse) return;

    if (playing) {
      stopAudio();
      btn.innerHTML = '<i class="fa-solid fa-play"></i>';
      return;
    }

    // Browser TTS
    if (lang === "en" || lang === "zh") {
      playBrowserTTS(text, lang, btn);
      return;
    }

    // Muxlisa buffer exists
    if (mxBuf && mxCtx) {
      playMuxlisa(btn);
      return;
    }

    // Load Muxlisa
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    btn.disabled = true;

    const chunks = [];
    for (let i = 0; i < text.length; i += 500) {
      chunks.push(text.slice(i, i + 500));
    }

    try {
      const bufs = await Promise.all(
        chunks.map((chunk) =>
          fetch(`${API_BASE}/speak`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: chunk, lang }),
          }).then((r) => {
            if (!r.ok) throw new Error(r.status);
            return r.arrayBuffer();
          })
        )
      );

      mxCtx = new AudioContext();
      const decoded = await Promise.all(
        bufs.map((b) => mxCtx.decodeAudioData(b))
      );
      const total = decoded.reduce((s, b) => s + b.length, 0);
      const combined = mxCtx.createBuffer(1, total, decoded[0].sampleRate);
      let off = 0;
      decoded.forEach((b) => {
        combined.copyToChannel(b.getChannelData(0), 0, off);
        off += b.length;
      });
      mxBuf = combined;
      ttsDur = combined.duration;
      btn.disabled = false;
      playMuxlisa(btn);
    } catch (err) {
      console.error("Muxlisa error:", err);
      btn.innerHTML = '<i class="fa-solid fa-headphones"></i>';
      btn.disabled = false;
      playBrowserTTS(text, lang, btn);
    }
  }

  function playMuxlisa(btn) {
    mxSrc = mxCtx.createBufferSource();
    mxSrc.buffer = mxBuf;
    mxSrc.connect(mxCtx.destination);
    mxSrc.start(0);
    mxStart = mxCtx.currentTime;
    playing = true;
    btn.innerHTML = '<i class="fa-solid fa-stop"></i>';
    animWave();
    timerMx();
    mxSrc.onended = () => {
      if (!playing) return;
      playing = false;
      clearTmr();
      btn.innerHTML = '<i class="fa-solid fa-play"></i>';
      setTime(ttsDur);
      fillWave();
    };
  }

  function playBrowserTTS(text, lang, btn) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const langMap = {
      uz: "uz-UZ",
      ru: "ru-RU",
      en: "en-US",
      zh: "zh-CN",
    };
    u.lang = langMap[lang] || "en-US";
    u.rate = 0.9;
    ttsDur = (text.trim().split(/\s+/).length / 150) * 60 / 0.9;
    ttsStart = Date.now();
    playing = true;
    btn.innerHTML = '<i class="fa-solid fa-stop"></i>';
    animWave();
    timerBrowser();
    u.onend = () => {
      playing = false;
      clearTmr();
      btn.innerHTML = '<i class="fa-solid fa-play"></i>';
      setTime(ttsDur);
      fillWave();
    };
    u.onerror = () => {
      playing = false;
      clearTmr();
      btn.innerHTML = '<i class="fa-solid fa-headphones"></i>';
    };
    window.speechSynthesis.speak(u);
  }

  function stopAudio() {
    window.speechSynthesis.cancel();
    if (mxSrc) {
      try {
        mxSrc.onended = null;
        mxSrc.stop();
      } catch (e) {}
    }
    playing = false;
    clearTmr();
    resetWave();
    setTime(0);
  }

  function animWave() {
    clearInterval(waveTmr);
    let f = 0;
    waveTmr = setInterval(() => {
      const bars = document.querySelectorAll(".ai-audio-wave .chat-audio__bar");
      const playedCount = Array.from(bars).filter((b) =>
        b.classList.contains("played")
      ).length;

      bars.forEach((b, i) => {
        if (i >= playedCount) {
          b.style.height =
            (waveH[i] || 8) *
              (0.5 + 0.5 * Math.sin((f + i * 1.8) * 0.35)) +
            "px";
        }
      });
      f++;
    }, 75);
  }

  function timerMx() {
    clearInterval(progTmr);
    progTmr = setInterval(() => {
      if (!mxCtx || !playing) return;
      const elapsed = mxCtx.currentTime - mxStart;
      setTime(elapsed);
      progWave(elapsed / ttsDur);
    }, 100);
  }

  function timerBrowser() {
    clearInterval(progTmr);
    progTmr = setInterval(() => {
      if (!playing) return;
      const elapsed = (Date.now() - ttsStart) / 1000;
      setTime(elapsed);
      progWave(elapsed / ttsDur);
    }, 100);
  }

  function setTime(seconds) {
    const timeEls = document.querySelectorAll(".ai-audio-time");
    timeEls.forEach((el) => {
      const sec = Math.floor(seconds % 60);
      const min = Math.floor(seconds / 60);
      el.textContent = min + ":" + (sec < 10 ? "0" : "") + sec;
    });
  }

  function progWave(ratio) {
    const bars = document.querySelectorAll(".ai-audio-wave .chat-audio__bar");
    const n = Math.floor(Math.min(ratio, 1) * bars.length);
    bars.forEach((b, i) => {
      b.classList.toggle("played", i < n);
      if (i < n) b.style.height = waveH[i] + "px";
    });
  }

  function fillWave() {
    const bars = document.querySelectorAll(".ai-audio-wave .chat-audio__bar");
    bars.forEach((b, i) => {
      b.classList.add("played");
      b.style.height = waveH[i] + "px";
    });
  }

  function resetWave() {
    const bars = document.querySelectorAll(".ai-audio-wave .chat-audio__bar");
    bars.forEach((b, i) => {
      b.classList.remove("played");
      b.style.height = (waveH[i] || 8) + "px";
    });
  }

  function clearTmr() {
    clearInterval(waveTmr);
    clearInterval(progTmr);
  }
});