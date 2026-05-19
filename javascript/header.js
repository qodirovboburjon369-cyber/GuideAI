// ===== THEME =====
(function () {
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();

// ===== AUTO ACTIVE NAV LINK =====
(function setActiveLink() {
  const currentPath = window.location.pathname;
  document.querySelectorAll(".header__link").forEach(link => {
    link.classList.remove("active");
    const href = link.getAttribute("href");
    if (!href) return;
    // Normalize paths for comparison
    const linkPath = href.replace(/^\.\.\//, "/html/").replace(/^\.\//, "/html/pages/");
    if (currentPath.endsWith(href.split("/").pop()) || currentPath === href) {
      link.classList.add("active");
    }
  });
})();

// ===== MAP/LANDMARKS HEADER STYLE =====
(function setMapHeader() {
  const path = window.location.pathname;
  const isMapPage = path.includes("map") || path.includes("landmark") ||
                    document.body.classList.contains("map-page-body") ||
                    document.body.classList.contains("landmarks-page-body");
  const header = document.querySelector(".header");
  if (header && isMapPage) {
    header.classList.add("map-header");
    // Force inline styles for Netlify reliability
    header.style.position = "sticky";
    header.style.top = "0";
    header.style.padding = "0";
    header.style.backdropFilter = "none";
    const wrapper = header.querySelector(".header__wrapper");
    if (wrapper) {
      wrapper.style.maxWidth = "100%";
      wrapper.style.borderRadius = "0";
      wrapper.style.border = "none";
      wrapper.style.boxShadow = "none";
      wrapper.style.background = "transparent";
      wrapper.style.backdropFilter = "none";
      wrapper.style.padding = "10px 24px";
      wrapper.style.margin = "0";
    }
  }
})();

// ===== AUTH BUTTONS =====
(function initHeaderAuth() {
  const btnBox = document.querySelector(".header__btnbox");
  const loginBtn = document.querySelector(".header__login");
  const signBtn = document.querySelector(".header__sign");
  const user = JSON.parse(localStorage.getItem("guideai_current_user") || "null");

  if (user && btnBox) {
    btnBox.innerHTML = `
      <div class="header__user">
        <div class="header__avatar">${user.name.charAt(0).toUpperCase()}</div>
        <span class="header__username">${user.name.split(" ")[0]}</span>
      </div>
      <button class="header__logout" onclick="logoutUser()">
        <i class="fa-solid fa-right-from-bracket"></i> Chiqish
      </button>`;
  } else {
    if (loginBtn) {
      loginBtn.addEventListener("click", () => {
        sessionStorage.setItem("auth_redirect", window.location.href);
        window.location.href = "/html/form/login.html";
      });
    }
    if (signBtn) {
      signBtn.addEventListener("click", () => {
        sessionStorage.setItem("auth_redirect", window.location.href);
        window.location.href = "/html/form/create.html";
      });
    }
  }
})();

// ===== THEME TOGGLE =====
(function initTheme() {
  const btn = document.querySelector(".lightmode");
  if (!btn) return;
  btn.innerHTML = document.documentElement.getAttribute("data-theme") === "dark"
    ? '<i class="fa-solid fa-moon"></i>'
    : '<i class="fa-solid fa-sun"></i>';

  btn.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
      localStorage.setItem("theme", "dark");
    }
  });
})();

function logoutUser() {
  localStorage.removeItem("guideai_current_user");
  window.location.reload();
}