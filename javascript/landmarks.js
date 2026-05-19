(function () {
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();

const landmarks = [
  {
    id: 1, name: "Registan Complex", city: "Samarkand",
    year: "1420–1660", era: "Timurid Era", category: "complex",
    coords: [39.6542, 66.9758],
    desc: "The Registan is the heart of ancient Samarkand, featuring three magnificent madrasahs adorned with stunning blue-tiled mosaics. It served as the public square of the Timurid empire and remains one of the most breathtaking architectural ensembles in Central Asia.",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/00/Registan_square_Samarkand.jpg",
    facts: [{ label: "Built", value: "1420 AD" }, { label: "Style", value: "Timurid" }, { label: "Status", value: "UNESCO Site" }, { label: "City", value: "Samarkand" }],
    sketchfab: "https://sketchfab.com/models/af54f5280eb249beb6501eab4769c351/embed?autostart=1&ui_theme=dark"
  },
  {
    id: 2, name: "Gur-e-Amir Mausoleum", city: "Samarkand",
    year: "1403", era: "Timurid Era", category: "mausoleum",
    coords: [39.6508, 66.9697],
    desc: "The Gur-e-Amir is the mausoleum of the great conqueror Amir Timur (Tamerlane) and his descendants. Its magnificent azure dome and intricate tilework make it one of the finest examples of medieval Islamic architecture in Central Asia.",
    image: "https://www.advantour.com/img/uzbekistan/samarkand/gur-emir-mausoleum3.jpg",
    facts: [{ label: "Built", value: "1403 AD" }, { label: "For", value: "Amir Timur" }, { label: "Dome Ht.", value: "34 meters" }, { label: "City", value: "Samarkand" }],
    sketchfab: "https://sketchfab.com/models/72e06d47f29c4166b394d4066c764823/embed?autostart=1&ui_theme=dark"
  },
  {
    id: 3, name: "Bibi-Khanym Mosque", city: "Samarkand",
    year: "1404", era: "Timurid Era", category: "mosque",
    coords: [39.6603, 66.9797],
    desc: "Built by Timur upon his return from India, the Bibi-Khanym Mosque was once one of the largest mosques in the Islamic world. Named after Timur's favorite wife, it showcases the grandeur of the Timurid architectural tradition.",
    image: "https://www.tourstouzbekistan.com/uploads/2021%20photos/Samarkand/Bibikhanum_mosque.jpg",
    facts: [{ label: "Built", value: "1399–1404" }, { label: "Style", value: "Timurid" }, { label: "Height", value: "40 meters" }, { label: "City", value: "Samarkand" }],
    sketchfab: "https://sketchfab.com/models/dc8ec865fd0d480c8ae06196fd18d296/embed?autostart=1&ui_theme=dark"
  },
  {
    id: 4, name: "Kalon Minaret", city: "Bukhara",
    year: "1127", era: "Karakhanid Era", category: "mosque",
    coords: [39.7747, 64.4156],
    desc: "The Kalon Minaret, meaning 'The Great', is one of the most recognizable landmarks of Central Asia. Standing 47 meters tall, it was used both as a minaret and a lighthouse. Genghis Khan reportedly spared this tower when he conquered Bukhara in 1220.",
    image: "https://www.turkestantravel.com/wp-content/uploads/2020/11/Poi-Kalon.jpg",
    facts: [{ label: "Built", value: "1127 AD" }, { label: "Height", value: "47 meters" }, { label: "Bricks", value: "~3 million" }, { label: "City", value: "Bukhara" }],
    sketchfab: null
  },
  {
    id: 5, name: "Ark Fortress", city: "Bukhara",
    year: "5th Century", era: "Ancient Era", category: "fortress",
    coords: [39.7763, 64.4111],
    desc: "The Ark of Bukhara is an ancient massive fortress that served as the royal residence for the emirs of Bukhara. With over 2,500 years of history, it has been continuously inhabited and rebuilt. Today it houses a museum showcasing the region's rich history.",
    image: "https://www.bukharamuseums.uz/images/bukhara-museum/gallery/arc/001.jpg",
    facts: [{ label: "Founded", value: "5th Century" }, { label: "Area", value: "3.9 hectares" }, { label: "Walls", value: "16–20m high" }, { label: "City", value: "Bukhara" }],
    sketchfab: null
  },
  {
    id: 6, name: "Shah-i-Zinda Necropolis", city: "Samarkand",
    year: "11th–15th Century", era: "Medieval Era", category: "mausoleum",
    coords: [39.6640, 66.9836],
    desc: "Shah-i-Zinda, meaning 'The Living King', is a breathtaking alley of mausoleums lined with some of the most brilliant blue-tilework in the world. This sacred complex contains the tomb of Kusam ibn Abbas, a cousin of Prophet Muhammad.",
    image: "https://www.orexca.com/img/uzbekistan/samarkand/shahi-zinda/shah-i-zinda.jpg",
    facts: [{ label: "Period", value: "11–15th c." }, { label: "Tombs", value: "20+" }, { label: "Status", value: "UNESCO Site" }, { label: "City", value: "Samarkand" }],
    sketchfab: null
  },
  {
    id: 7, name: "Itchan Kala", city: "Khiva",
    year: "10th Century", era: "Ancient Era", category: "complex",
    coords: [41.3785, 60.3626],
    desc: "Itchan Kala is the walled inner town of Khiva, a remarkably well-preserved example of a Central Asian medieval city. The entire inner town is a UNESCO World Heritage Site, with over 50 historic monuments and 250 old houses within its mud walls.",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Islam_Khodja_Madrasa_01.jpg",
    facts: [{ label: "Founded", value: "10th Century" }, { label: "Area", value: "26 hectares" }, { label: "Monuments", value: "50+" }, { label: "City", value: "Khiva" }],
    sketchfab: null
  },
  {
    id: 8, name: "Islam Khoja Minaret", city: "Khiva",
    year: "1910", era: "Late Khanate Era", category: "mosque",
    coords: [41.3782, 60.3634],
    desc: "The Islam Khoja Minaret is the tallest structure in Khiva at 57 meters. Built in 1910 by Islam Khoja, the last great vizier of the Khiva Khanate, it represents a blend of traditional Khorezmian architecture with some modern influences of the early 20th century.",
    image: "https://www.advantour.com/img/uzbekistan/khiva/islam-khoja-complex3.jpg",
    facts: [{ label: "Built", value: "1910 AD" }, { label: "Height", value: "57 meters" }, { label: "Style", value: "Khorezmian" }, { label: "City", value: "Khiva" }],
    sketchfab: null
  }
];

let activeLandmark = null;
let currentList = [...landmarks];
let ymap = null;
let placemarks = [];

document.addEventListener("DOMContentLoaded", () => {
  renderList(landmarks);
  initFilters();
  initSearch();
  initDetailEvents();
  initModalEvents();
  loadMap();
});

function loadMap() {
  if (typeof ymaps === "undefined") return;
  ymaps.ready(() => {
    ymap = new ymaps.Map("lmMap", { center: [39.7, 64.5], zoom: 6, controls: ["zoomControl", "fullscreenControl"] });
    renderMarkers(landmarks);
  });
}

function renderMarkers(list) {
  placemarks.forEach(p => ymap.geoObjects.remove(p));
  placemarks = [];
  list.forEach(lm => {
    const isActive = activeLandmark?.id === lm.id;
    const pm = new ymaps.Placemark(lm.coords, {}, {
      iconLayout: ymaps.templateLayoutFactory.createClass(
        `<div class="lm-pin ${isActive ? 'active' : ''}"><i class="fa-solid fa-landmark"></i>${lm.name.split(" ")[0]}</div>`
      ),
      iconShape: { type: "Rectangle", coordinates: [[-60, -18], [60, 18]] }
    });
    pm.events.add("click", () => openDetail(lm));
    ymap.geoObjects.add(pm);
    placemarks.push(pm);
  });
}

function renderList(list) {
  currentList = list;
  const el = document.getElementById("landmarkList");
  el.innerHTML = "";
  const cnt = document.getElementById("lmCount");
  if (cnt) cnt.textContent = list.length + " landmark" + (list.length !== 1 ? "s" : "") + " found";
  list.forEach(lm => {
    const card = document.createElement("div");
    card.className = "lm-card" + (activeLandmark?.id === lm.id ? " active" : "");
    card.dataset.id = lm.id;
    card.innerHTML = `
      <img class="lm-card__img" src="${lm.image}" alt="${lm.name}" loading="lazy"/>
      <div class="lm-card__body">
        <div class="lm-card__name">${lm.name}</div>
        <div class="lm-card__city"><i class="fa-solid fa-location-dot"></i>${lm.city}</div>
        <div class="lm-card__meta">
          <span class="lm-card__year">${lm.year}</span>
          <span class="lm-card__cat">${lm.category}</span>
        </div>
      </div>`;
    card.addEventListener("click", () => { openDetail(lm); if (ymap) ymap.setCenter(lm.coords, 13, { duration: 600 }); });
    el.appendChild(card);
  });
}

function initFilters() {
  document.querySelectorAll(".lm-filter").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".lm-filter").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.f;
      const filtered = f === "all" ? landmarks : landmarks.filter(l => l.category === f);
      renderList(filtered);
      if (ymap) renderMarkers(filtered);
    });
  });
}

function initSearch() {
  document.getElementById("searchInput").addEventListener("input", function () {
    const q = this.value.toLowerCase();
    const filtered = landmarks.filter(l => l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q));
    renderList(filtered);
    if (ymap) renderMarkers(filtered);
  });
}

function openDetail(lm) {
  activeLandmark = lm;
  document.querySelectorAll(".lm-card").forEach(c => c.classList.toggle("active", parseInt(c.dataset.id) === lm.id));
  document.getElementById("detailName").textContent = lm.name;
  document.getElementById("detailCity").textContent = lm.city + ", Uzbekistan";
  document.getElementById("detailYear").textContent = lm.year;
  document.getElementById("detailEra").textContent = lm.era;
  document.getElementById("detailDesc").textContent = lm.desc;
  document.getElementById("detailImg").src = lm.image;
  document.getElementById("detailCategory").textContent = lm.category;
  document.getElementById("detailFacts").innerHTML = lm.facts.map(f => `
    <div class="lm-fact"><div class="lm-fact__label">${f.label}</div><div class="lm-fact__val">${f.value}</div></div>`).join("");
  const show3dBtn = document.getElementById("show3dBtn");
  if (show3dBtn) show3dBtn.style.display = lm.sketchfab ? "" : "none";
  document.getElementById("detailPanel").classList.add("open");
  if (ymap) renderMarkers(currentList);
}

function initDetailEvents() {
  document.getElementById("closeDetail").addEventListener("click", () => {
    document.getElementById("detailPanel").classList.remove("open");
    activeLandmark = null;
    document.querySelectorAll(".lm-card").forEach(c => c.classList.remove("active"));
    if (ymap) renderMarkers(currentList);
  });
  document.getElementById("show3dBtn").addEventListener("click", () => {
    if (!activeLandmark) return;
    open3dModal(activeLandmark);
  });
}

function open3dModal(lm) {
  document.getElementById("modelTitle").textContent = lm.name;
  document.getElementById("modelSub").textContent = lm.city + ", Uzbekistan · " + lm.year;
  const modal = document.getElementById("model3dModal");
  const frame = document.getElementById("sketchfabFrame");
  const loading = document.getElementById("modelLoading");
  frame.src = "";
  loading.style.display = "flex";
  frame.style.opacity = "0";
  modal.classList.remove("hidden");
  setTimeout(() => {
    frame.src = lm.sketchfab;
    frame.onload = () => {
      loading.style.display = "none";
      frame.style.opacity = "1";
      frame.style.transition = "opacity 0.4s";
    };
  }, 300);
}

function initModalEvents() {
  document.getElementById("closeModal").addEventListener("click", closeModal);
  document.getElementById("modalOverlay").addEventListener("click", closeModal);
}

function closeModal() {
  document.getElementById("model3dModal").classList.add("hidden");
  document.getElementById("sketchfabFrame").src = "";
}