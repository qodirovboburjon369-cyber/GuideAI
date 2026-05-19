// ===== THEME =====
(function () {
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();

// ===== TYPEWRITER =====
const typedSpan = document.querySelector(".hero__title .bluue");
if (typedSpan) {
  const fullText = typedSpan.dataset.text || "Anywhere You Go";
  typedSpan.textContent = "";
  const style = document.createElement("style");
  style.textContent = `@keyframes blink{0%,100%{border-color:#6366f1}50%{border-color:transparent}}`;
  document.head.appendChild(style);
  typedSpan.style.borderRight = "3px solid #6366f1";
  typedSpan.style.paddingRight = "4px";
  typedSpan.style.animation = "blink 0.7s step-end infinite";
  let i = 0;
  function type() {
    if (i < fullText.length) { typedSpan.textContent += fullText[i++]; setTimeout(type, 110); }
    else { setTimeout(() => { typedSpan.style.borderRight="none"; typedSpan.style.animation="none"; typedSpan.style.paddingRight="0"; }, 800); }
  }
  type();
}

// ===== HERO BUTTONS =====
const heroImageBtn = document.querySelector("button.image");
const heroMapBtn   = document.querySelector("button.map");
if (heroImageBtn) heroImageBtn.addEventListener("click", () => { window.location.href = "/pages/ai.html"; });
if (heroMapBtn)   heroMapBtn.addEventListener("click",   () => { window.location.href = "/pages/map.html"; });

// ===== INDEXEDDB — rasm saqlash =====
const DB_NAME = "guideai_db";
const DB_STORE = "images";
const DB_KEY = "last_image";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = e => e.target.result.createObjectStore(DB_STORE);
    req.onsuccess = e => resolve(e.target.result);
    req.onerror = () => reject();
  });
}

async function saveImageToDB(blob) {
  try {
    const db = await openDB();
    const tx = db.transaction(DB_STORE, "readwrite");
    tx.objectStore(DB_STORE).put(blob, DB_KEY);
  } catch(e) { console.warn("DB save error", e); }
}

async function loadImageFromDB() {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const req = db.transaction(DB_STORE).objectStore(DB_STORE).get(DB_KEY);
      req.onsuccess = e => resolve(e.target.result || null);
      req.onerror = () => resolve(null);
    });
  } catch(e) { return null; }
}

async function clearImageDB() {
  try {
    const db = await openDB();
    db.transaction(DB_STORE, "readwrite").objectStore(DB_STORE).delete(DB_KEY);
  } catch(e) {}
}

// ===== AI PAGE =====
const imageInput = document.getElementById("imageInput");
const previewImg = document.getElementById("previewImage");
const previewBox = document.querySelector(".scan__preview");
const resultBox  = document.querySelector(".scan__result");
const resultText = document.getElementById("aiResult");
const langSelect = document.getElementById("langSelect");

if (imageInput) {

  // ===== RESTORE STATE ON LOAD =====
  (async function restoreState() {
    const savedText = sessionStorage.getItem("ai_result");
    const savedLang = sessionStorage.getItem("ai_lang");
    if (savedLang && langSelect) langSelect.value = savedLang;

    // Rasmni IndexedDB dan yuklash
    const savedBlob = await loadImageFromDB();
    if (savedBlob) {
      previewImg.src = URL.createObjectURL(savedBlob);
      previewBox.style.display = "block";
    }

    // Matnni sessionStorage dan yuklash
    if (savedText && !savedText.startsWith("❌")) {
      resultBox.style.display = "block";
      resultText.style.display = "block";
      resultText.value = savedText;
      buildAudioPlayer();
    }
  })();

  // Drag & drop
  const uploadInner = document.querySelector(".scan__upload-inner");
  if (uploadInner) {
    uploadInner.addEventListener("dragover", (e) => { e.preventDefault(); uploadInner.style.background = "rgba(99,102,241,0.05)"; });
    uploadInner.addEventListener("dragleave", () => { uploadInner.style.background = ""; });
    uploadInner.addEventListener("drop", (e) => {
      e.preventDefault(); uploadInner.style.background = "";
      const f = e.dataTransfer.files[0];
      if (f && f.type.startsWith("image/")) handleNewFile(f);
    });
  }

  imageInput.addEventListener("change", function () {
    if (this.files[0]) handleNewFile(this.files[0]);
  });

  // Yangi fayl kelganda — DB ni tozalab qayta yuklash
  async function handleNewFile(file) {
    // Eski state ni tozala
    sessionStorage.removeItem("ai_result");
    await clearImageDB();
    removeAudioPlayer();

    // Rasmni DB ga saqlash va preview
    await saveImageToDB(file);
    previewImg.src = URL.createObjectURL(file);
    previewBox.style.display = "block";

    // Agar avvalgi natija ko'rinib turgan bo'lsa — tozala
    resultText.value = "";
    resultBox.style.display = "block";
    resultText.style.display = "none";

    sendToFlask(file);
  }

  async function sendToFlask(file) {
    resultText.value = "";
    removeAudioPlayer();

    // Spinner
    let spinner = resultBox.querySelector(".scan__loading");
    if (!spinner) {
      spinner = document.createElement("div");
      spinner.className = "scan__loading";
      spinner.innerHTML = `<div class="scan__spinner"></div><span>AI analysing...</span>`;
      resultBox.insertBefore(spinner, resultText);
    }
    spinner.style.display = "flex";
    resultText.style.display = "none";

    const lang = langSelect ? langSelect.value : "uz";
    sessionStorage.setItem("ai_lang", lang);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("lang", lang);

    try {
      const res = await fetch("http://127.0.0.1:5000/analyze-image", { method: "POST", body: formData });
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      const text = data.description || "No response.";

      spinner.style.display = "none";
      resultText.style.display = "block";

      // Sessionga saqlash
      sessionStorage.setItem("ai_result", text);

      typewriterResult(text, () => buildAudioPlayer());

    } catch (err) {
      console.error(err);
      spinner.style.display = "none";
      resultText.style.display = "block";
      resultText.value = "❌ Flask server is not running!\nRun: python app.py";
    }
  }

  function typewriterResult(text, onDone) {
    let i = 0; resultText.value = "";
    function tick() {
      if (i < text.length) { resultText.value += text[i++]; resultText.scrollTop = resultText.scrollHeight; setTimeout(tick, 14); }
      else if (onDone) onDone();
    }
    tick();
  }
}

// ===== TELEGRAM AUDIO PLAYER =====
let isPlaying = false;
let waveHeights = [];
let waveTimer = null;
let progressTimer = null;
let ttsStartTime = 0;
let ttsDuration = 0;
let muxlisaAudioCtx = null;
let muxlisaSource = null;
let muxlisaBuffer = null;
let muxlisaStartTime = 0;

function removeAudioPlayer() {
  stopAll();
  const el = document.querySelector(".tg-audio");
  if (el) el.remove();
  muxlisaBuffer = null;
  muxlisaAudioCtx = null;
}

function buildAudioPlayer() {
  removeAudioPlayer();
  if (!resultBox) return;

  waveHeights = Array.from({ length: 44 }, () => 6 + Math.random() * 22);

  const player = document.createElement("div");
  player.className = "tg-audio";
  player.innerHTML = `
    <button class="tg-audio__play" id="tgPlayBtn" type="button">
      <i class="fa-solid fa-headphones"></i>
    </button>
    <div class="tg-audio__wave" id="tgWave"></div>
    <span class="tg-audio__time" id="tgTime">0:00</span>
  `;
  resultBox.appendChild(player);

  const wave = document.getElementById("tgWave");
  waveHeights.forEach(h => {
    const bar = document.createElement("div");
    bar.className = "tg-audio__bar";
    bar.style.height = h + "px";
    wave.appendChild(bar);
  });

  document.getElementById("tgPlayBtn").addEventListener("click", toggleAudio);
}

async function toggleAudio() {
  const btn = document.getElementById("tgPlayBtn");
  const text = resultText ? resultText.value : "";
  if (!text || text.startsWith("❌")) return;

  if (isPlaying) {
    stopAll();
    if (btn) btn.innerHTML = '<i class="fa-solid fa-play"></i>';
    return;
  }

  const lang = langSelect ? langSelect.value : "uz";

  if (lang === "en") {
    playBrowserTTS(text);
    return;
  }

  // Muxlisa — buffer bor bo'lsa qayta ishlatish
  if (muxlisaBuffer && muxlisaAudioCtx) {
    playMuxlisaFromBuffer();
    return;
  }

  if (btn) { btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>'; btn.disabled = true; }

  const chunks = [];
  for (let i = 0; i < text.length; i += 500) chunks.push(text.slice(i, i + 500));

  try {
    const responses = await Promise.all(
      chunks.map(chunk =>
        fetch("http://127.0.0.1:5000/speak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: chunk, lang }),
        }).then(r => { if (!r.ok) throw new Error("Muxlisa " + r.status); return r.arrayBuffer(); })
      )
    );

    muxlisaAudioCtx = new AudioContext();
    const decoded = await Promise.all(responses.map(b => muxlisaAudioCtx.decodeAudioData(b)));
    const totalLen = decoded.reduce((s, b) => s + b.length, 0);
    const combined = muxlisaAudioCtx.createBuffer(1, totalLen, decoded[0].sampleRate);
    let offset = 0;
    for (const b of decoded) { combined.copyToChannel(b.getChannelData(0), 0, offset); offset += b.length; }
    muxlisaBuffer = combined;
    ttsDuration = combined.duration;
    if (btn) btn.disabled = false;
    playMuxlisaFromBuffer();

  } catch (err) {
    console.error("Muxlisa xato:", err);
    if (btn) { btn.innerHTML = '<i class="fa-solid fa-headphones"></i>'; btn.disabled = false; }
    playBrowserTTS(text);
  }
}

function playMuxlisaFromBuffer() {
  if (!muxlisaBuffer || !muxlisaAudioCtx) return;
  const btn = document.getElementById("tgPlayBtn");
  muxlisaSource = muxlisaAudioCtx.createBufferSource();
  muxlisaSource.buffer = muxlisaBuffer;
  muxlisaSource.connect(muxlisaAudioCtx.destination);
  muxlisaSource.start(0);
  muxlisaStartTime = muxlisaAudioCtx.currentTime;
  isPlaying = true;
  if (btn) btn.innerHTML = '<i class="fa-solid fa-stop"></i>';
  startWaveAnim();
  startMuxlisaTimer();
  muxlisaSource.onended = () => {
    if (!isPlaying) return;
    isPlaying = false; clearTimers();
    const b = document.getElementById("tgPlayBtn");
    if (b) b.innerHTML = '<i class="fa-solid fa-play"></i>';
    setTime(ttsDuration); fillWaveFull();
  };
}

function playBrowserTTS(text) {
  const btn = document.getElementById("tgPlayBtn");
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  const lang = langSelect ? langSelect.value : "en";
  utt.lang = lang === "uz" ? "uz-UZ" : lang === "ru" ? "ru-RU" : "en-US";
  utt.rate = 0.9;
  const wordCount = text.trim().split(/\s+/).length;
  ttsDuration = (wordCount / 150) * 60 / 0.9;
  ttsStartTime = Date.now();
  isPlaying = true;
  if (btn) btn.innerHTML = '<i class="fa-solid fa-stop"></i>';
  startWaveAnim();
  startBrowserTTSTimer();
  utt.onend = () => {
    isPlaying = false; clearTimers();
    const b = document.getElementById("tgPlayBtn");
    if (b) b.innerHTML = '<i class="fa-solid fa-play"></i>';
    setTime(ttsDuration); fillWaveFull();
  };
  utt.onerror = () => {
    isPlaying = false; clearTimers();
    const b = document.getElementById("tgPlayBtn");
    if (b) b.innerHTML = '<i class="fa-solid fa-headphones"></i>';
  };
  window.speechSynthesis.speak(utt);
}

function stopAll() {
  window.speechSynthesis.cancel();
  if (muxlisaSource) { try { muxlisaSource.onended = null; muxlisaSource.stop(); } catch(e){} }
  isPlaying = false; clearTimers(); resetWave(); setTime(0);
}

function startMuxlisaTimer() {
  clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    if (!muxlisaAudioCtx || !isPlaying) return;
    const e = muxlisaAudioCtx.currentTime - muxlisaStartTime;
    setTime(e); updateProgress(e / ttsDuration);
  }, 120);
}

function startBrowserTTSTimer() {
  clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    if (!isPlaying) return;
    const e = (Date.now() - ttsStartTime) / 1000;
    setTime(e); updateProgress(e / ttsDuration);
  }, 120);
}

function startWaveAnim() {
  clearInterval(waveTimer); let frame = 0;
  waveTimer = setInterval(() => {
    const played = document.querySelectorAll(".tg-audio__bar.played").length;
    document.querySelectorAll(".tg-audio__bar:not(.played)").forEach((bar, i) => {
      bar.style.height = ((waveHeights[played + i] || 14) * (0.5 + 0.5 * Math.sin((frame + i * 1.8) * 0.35))) + "px";
    });
    frame++;
  }, 75);
}

function clearTimers() { clearInterval(waveTimer); clearInterval(progressTimer); }

function setTime(secs) {
  const el = document.getElementById("tgTime"); if (!el) return;
  const s = Math.floor(secs % 60), m = Math.floor(secs / 60);
  el.textContent = m + ":" + (s < 10 ? "0" : "") + s;
}

function updateProgress(ratio) {
  const bars = document.querySelectorAll(".tg-audio__bar");
  const n = Math.floor(Math.min(ratio, 1) * bars.length);
  bars.forEach((bar, i) => { bar.classList.toggle("played", i < n); if (i < n) bar.style.height = waveHeights[i] + "px"; });
}

function fillWaveFull() {
  document.querySelectorAll(".tg-audio__bar").forEach((bar, i) => { bar.classList.add("played"); bar.style.height = waveHeights[i] + "px"; });
}

function resetWave() {
  document.querySelectorAll(".tg-audio__bar").forEach((bar, i) => { bar.classList.remove("played"); bar.style.height = (waveHeights[i] || 14) + "px"; });
}