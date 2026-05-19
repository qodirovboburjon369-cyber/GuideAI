// ===== THEME =====
(function () {
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();

// ===== INDEXEDDB =====
const DB_NAME = "guideai_db", DB_STORE = "images", DB_KEY = "last_img";

function openDB() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB_NAME, 1);
    r.onupgradeneeded = e => e.target.result.createObjectStore(DB_STORE);
    r.onsuccess = e => res(e.target.result);
    r.onerror = () => rej();
  });
}
async function saveImg(blob) {
  try { const db = await openDB(); db.transaction(DB_STORE,"readwrite").objectStore(DB_STORE).put(blob, DB_KEY); } catch(e){}
}
async function loadImg() {
  try {
    const db = await openDB();
    return new Promise(res => {
      const r = db.transaction(DB_STORE).objectStore(DB_STORE).get(DB_KEY);
      r.onsuccess = e => res(e.target.result || null);
      r.onerror = () => res(null);
    });
  } catch(e) { return null; }
}
async function clearImg() {
  try { const db = await openDB(); db.transaction(DB_STORE,"readwrite").objectStore(DB_STORE).delete(DB_KEY); } catch(e){}
}

// ===== GLOBAL STATE =====
let typewriteInProgress = false;
let typewriteAbort = false;  // To'xtatish uchun flag
let currentFullText = "";
let currentAnalysisId = 0;  // Har bir analiz session uchun unique ID

// ===== DOM READY =====
document.addEventListener("DOMContentLoaded", async function () {

  // Theme toggle
  const themeBtn = document.querySelector(".lightmode");
  if (themeBtn) {
    themeBtn.innerHTML = document.documentElement.getAttribute("data-theme") === "dark"
      ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
    themeBtn.addEventListener("click", () => {
      const dark = document.documentElement.getAttribute("data-theme") === "dark";
      document.documentElement[dark ? "removeAttribute" : "setAttribute"]("data-theme", "dark");
      themeBtn.innerHTML = dark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
      localStorage.setItem("theme", dark ? "light" : "dark");
    });
  }

  // Elements
  const imageInput  = document.getElementById("imageInput");
  const previewImg  = document.getElementById("previewImage");
  const previewBox  = document.querySelector(".scan__preview");
  const resultBox   = document.querySelector(".scan__result");
  const aiResult    = document.getElementById("aiResult");
  const langSelect  = document.getElementById("langSelect");
  const uploadInner = document.querySelector(".scan__upload-inner");

  if (!imageInput) return;

  // ===== STATE RESTORE =====
  const savedLang = sessionStorage.getItem("ai_lang");
  const savedText = sessionStorage.getItem("ai_text");
  if (savedLang && langSelect) langSelect.value = savedLang;

  const savedBlob = await loadImg();
  if (savedBlob) {
    previewImg.src = URL.createObjectURL(savedBlob);
    previewBox.classList.remove("hidden");
    previewBox.style.display = "block";
  }
  if (savedText) {
    resultBox.classList.remove("hidden");
    resultBox.style.display = "block";
    aiResult.style.display = "block";
    aiResult.value = savedText;  // Direct set, no typewrite
    currentFullText = savedText;
    buildPlayer();
  }

  // ===== UPLOAD ZONE CLICK — FIX =====
  if (uploadInner) {
    uploadInner.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      imageInput.click();
    });

    const scanBtn = uploadInner.querySelector(".scan__btn");
    if (scanBtn) {
      scanBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        imageInput.click();
      });
    }

    // Drag & drop
    uploadInner.addEventListener("dragover", e => {
      e.preventDefault();
      uploadInner.style.background = "rgba(99,102,241,0.05)";
    });
    uploadInner.addEventListener("dragleave", () => {
      uploadInner.style.background = "";
    });
    uploadInner.addEventListener("drop", e => {
      e.preventDefault();
      uploadInner.style.background = "";
      const f = e.dataTransfer.files[0];
      if (f?.type.startsWith("image/")) handleFile(f);
    });
  }

  // ===== FILE INPUT =====
  imageInput.addEventListener("click", function () {
    this.value = "";
  });
  imageInput.addEventListener("change", function () {
    if (this.files[0]) handleFile(this.files[0]);
  });

  // ===== TIL O'ZGARGANDA — QAYTA TAHLIL =====
  if (langSelect) {
    langSelect.addEventListener("change", async function () {
      const blob = await loadImg();
      if (!blob) return;
      
      // MUHIM: Oldingi typewrite'ni to'xtat
      typewriteAbort = true;
      typewriteInProgress = false;
      
      sessionStorage.removeItem("ai_text");
      removePlayer();
      resultBox.classList.remove("hidden");
      resultBox.style.display = "block";
      aiResult.style.display = "none";
      aiResult.value = "";
      currentFullText = "";
      
      await analyze(blob);
    });
  }

  async function handleFile(file) {
    // MUHIM: Oldingi typewrite'ni to'xtat
    typewriteAbort = true;
    typewriteInProgress = false;
    
    sessionStorage.removeItem("ai_text");
    await clearImg();
    removePlayer();

    await saveImg(file);
    previewImg.src = URL.createObjectURL(file);
    previewBox.classList.remove("hidden");
    previewBox.style.display = "block";

    resultBox.classList.remove("hidden");
    resultBox.style.display = "block";
    aiResult.style.display = "none";
    aiResult.value = "";
    currentFullText = "";

    await analyze(file);
  }

  // ===== ANALYZE =====
  async function analyze(file) {
    // Blob bo'lsa — File ga aylantir
    if (!(file instanceof File)) {
      file = new File([file], "image.jpg", { type: file.type || "image/jpeg" });
    }

    // MUHIM: Yangi session ID — oldingi typewrite bilan clash bo'lmasligi uchun
    currentAnalysisId++;
    const myAnalysisId = currentAnalysisId;

    // MUHIM: Oldingi typewrite'ni to'xtat
    typewriteAbort = true;
    typewriteInProgress = false;
    
    removePlayer();

    let spinner = resultBox.querySelector(".scan__loading");
    if (!spinner) {
      spinner = document.createElement("div");
      spinner.className = "scan__loading";
      spinner.innerHTML = `<div class="scan__spinner"></div><span>AI analysing...</span>`;
      resultBox.insertBefore(spinner, aiResult);
    }
    spinner.style.display = "flex";
    aiResult.style.display = "none";
    aiResult.value = "";

    const lang = langSelect?.value || "uz";
    sessionStorage.setItem("ai_lang", lang);

    const form = new FormData();
    form.append("image", file);
    form.append("lang", lang);

    try {
      const res = await fetch(`${API_BASE}/analyze-image`, { method: "POST", body: form });
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      const text = data.description || "No response.";
      console.log("✅ AI response:", text.slice(0, 80));

      // MUHIM: Agar bu analysis session'i boshqasi tomonidan bekor qilingan bo'lsa — chiqib ket
      if (myAnalysisId !== currentAnalysisId) {
        console.log("⚠️ Analysis cancelled by newer request");
        return;
      }

      spinner.style.display = "none";
      aiResult.classList.remove("hidden");
      aiResult.style.display = "block";
      resultBox.classList.remove("hidden");
      resultBox.style.display = "block";
      sessionStorage.setItem("ai_text", text);

      // Yangi typewrite session'ni boshlash
      currentFullText = text;
      typewriteAbort = false;  // Reset abort flag
      typewriteInProgress = true;
      
      // Typewrite animatsiyani boshlash
      await typewrite(text, myAnalysisId);
      
      // Animatsiya tugagandan keyin (va agar cancelled bo'lmasa) player build qil
      if (myAnalysisId === currentAnalysisId && !typewriteAbort) {
        buildPlayer();
      }
    } catch(err) {
      console.error("❌ Fetch error:", err);
      spinner.style.display = "none";
      aiResult.classList.remove("hidden");
      aiResult.style.display = "block";
      aiResult.value = "❌ Flask server is not running!\nTerminalda: python app.py";
      typewriteInProgress = false;
    }
  }

  // ===== TYPEWRITE — ABORT FLAG BILAN =====
  function typewrite(fullText, analysisId) {
    return new Promise((resolve) => {
      let i = 0;
      aiResult.value = "";
      
      const tick = () => {
        // Agar bu analysis cancel qilingan bo'lsa — to'xtat
        if (typewriteAbort || analysisId !== currentAnalysisId) {
          typewriteInProgress = false;
          resolve();
          return;
        }
        
        if (i < fullText.length) {
          aiResult.value += fullText[i];
          i++;
          aiResult.scrollTop = aiResult.scrollHeight;
          setTimeout(tick, 5);
        } else {
          // Animatsiya tugadi
          typewriteInProgress = false;
          resolve();
        }
      };
      
      tick();
    });
  }

  // ===== TELEGRAM AUDIO PLAYER =====
  let playing = false, waveH = [], waveTmr = null, progTmr = null;
  let ttsStart = 0, ttsDur = 0;
  let mxCtx = null, mxSrc = null, mxBuf = null, mxStart = 0;

  function removePlayer() {
    stopAll();
    resultBox?.querySelector(".tg-audio")?.remove();
    mxBuf = null; mxCtx = null;
  }

  function buildPlayer() {
    removePlayer();
    waveH = Array.from({length: 44}, () => 6 + Math.random() * 22);

    const p = document.createElement("div");
    p.className = "tg-audio";
    p.innerHTML = `
      <button class="tg-audio__play" id="tgBtn" type="button">
        <i class="fa-solid fa-headphones"></i>
      </button>
      <div class="tg-audio__wave" id="tgWave"></div>
      <span class="tg-audio__time" id="tgTime">0:00</span>
    `;
    resultBox.appendChild(p);

    const wave = document.getElementById("tgWave");
    waveH.forEach(h => {
      const b = document.createElement("div");
      b.className = "tg-audio__bar";
      b.style.height = h + "px";
      wave.appendChild(b);
    });

    document.getElementById("tgBtn").addEventListener("click", toggle);
  }

  async function toggle() {
    const btn = document.getElementById("tgBtn");
    const text = currentFullText || aiResult?.value || "";
    if (!text || text.startsWith("❌")) return;

    if (playing) { stopAll(); btn.innerHTML = '<i class="fa-solid fa-play"></i>'; return; }

    const lang = langSelect?.value || "uz";

    // Ingliz va Xitoy — brauzer TTS
    if (lang === "en" || lang === "zh") { playBrowser(text); return; }

    // Buffer tayyor — qayta ijro
    if (mxBuf && mxCtx) { playMuxlisa(); return; }

    // Muxlisa yukla (uz, ru)
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    btn.disabled = true;

    const chunks = [];
    for (let i = 0; i < text.length; i += 500) chunks.push(text.slice(i, i+500));

    try {
      const bufs = await Promise.all(chunks.map(c =>
        fetch(`${API_BASE}/speak`, {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({text: c, lang})
        }).then(r => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
      ));

      mxCtx = new AudioContext();
      const decoded = await Promise.all(bufs.map(b => mxCtx.decodeAudioData(b)));
      const total = decoded.reduce((s,b) => s+b.length, 0);
      const combined = mxCtx.createBuffer(1, total, decoded[0].sampleRate);
      let off = 0;
      decoded.forEach(b => { combined.copyToChannel(b.getChannelData(0), 0, off); off += b.length; });
      mxBuf = combined;
      ttsDur = combined.duration;
      btn.disabled = false;
      playMuxlisa();
    } catch(err) {
      console.error("Muxlisa:", err);
      btn.innerHTML = '<i class="fa-solid fa-headphones"></i>';
      btn.disabled = false;
      playBrowser(text); // fallback
    }
  }

  function playMuxlisa() {
    const btn = document.getElementById("tgBtn");
    mxSrc = mxCtx.createBufferSource();
    mxSrc.buffer = mxBuf;
    mxSrc.connect(mxCtx.destination);
    mxSrc.start(0);
    mxStart = mxCtx.currentTime;
    playing = true;
    btn.innerHTML = '<i class="fa-solid fa-stop"></i>';
    animWave(); timerMx();
    mxSrc.onended = () => {
      if (!playing) return;
      playing = false; clearTmr();
      const b = document.getElementById("tgBtn");
      if (b) b.innerHTML = '<i class="fa-solid fa-play"></i>';
      setT(ttsDur); fillWave();
    };
  }

  function playBrowser(text) {
    const btn = document.getElementById("tgBtn");
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const langMap = { uz:"uz-UZ", ru:"ru-RU", en:"en-US", zh:"zh-CN" };
    u.lang = langMap[langSelect?.value || "en"] || "en-US";
    u.rate = 0.9;
    ttsDur = (text.trim().split(/\s+/).length / 150) * 60 / 0.9;
    ttsStart = Date.now();
    playing = true;
    btn.innerHTML = '<i class="fa-solid fa-stop"></i>';
    animWave(); timerBrowser();
    u.onend = () => {
      playing = false; clearTmr();
      const b = document.getElementById("tgBtn");
      if (b) b.innerHTML = '<i class="fa-solid fa-play"></i>';
      setT(ttsDur); fillWave();
    };
    u.onerror = () => {
      playing = false; clearTmr();
      const b = document.getElementById("tgBtn");
      if (b) b.innerHTML = '<i class="fa-solid fa-headphones"></i>';
    };
    window.speechSynthesis.speak(u);
  }

  function stopAll() {
    window.speechSynthesis.cancel();
    if (mxSrc) { try { mxSrc.onended=null; mxSrc.stop(); } catch(e){} }
    playing = false; clearTmr(); resetWave(); setT(0);
  }

  function timerMx() {
    clearInterval(progTmr);
    progTmr = setInterval(() => {
      if (!mxCtx || !playing) return;
      const e = mxCtx.currentTime - mxStart;
      setT(e); progWave(e / ttsDur);
    }, 100);
  }

  function timerBrowser() {
    clearInterval(progTmr);
    progTmr = setInterval(() => {
      if (!playing) return;
      const e = (Date.now() - ttsStart) / 1000;
      setT(e); progWave(e / ttsDur);
    }, 100);
  }

  function animWave() {
    clearInterval(waveTmr); let f = 0;
    waveTmr = setInterval(() => {
      const pl = document.querySelectorAll(".tg-audio__bar.played").length;
      document.querySelectorAll(".tg-audio__bar:not(.played)").forEach((b, i) => {
        b.style.height = ((waveH[pl+i] || 14) * (0.5 + 0.5*Math.sin((f+i*1.8)*0.35))) + "px";
      });
      f++;
    }, 75);
  }

  function clearTmr() { clearInterval(waveTmr); clearInterval(progTmr); }

  function setT(s) {
    const el = document.getElementById("tgTime"); if (!el) return;
    const sec = Math.floor(s%60), min = Math.floor(s/60);
    el.textContent = min + ":" + (sec<10?"0":"") + sec;
  }

  function progWave(r) {
    const bars = document.querySelectorAll(".tg-audio__bar");
    const n = Math.floor(Math.min(r,1) * bars.length);
    bars.forEach((b,i) => { b.classList.toggle("played", i<n); if(i<n) b.style.height=waveH[i]+"px"; });
  }

  function fillWave() {
    document.querySelectorAll(".tg-audio__bar").forEach((b,i) => { b.classList.add("played"); b.style.height=waveH[i]+"px"; });
  }

  function resetWave() {
    document.querySelectorAll(".tg-audio__bar").forEach((b,i) => { b.classList.remove("played"); b.style.height=(waveH[i]||14)+"px"; });
  }

}); // DOMContentLoaded end




