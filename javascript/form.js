// (function () {
//   if (localStorage.getItem("theme") === "dark") {
//     document.documentElement.setAttribute("data-theme", "dark");
//   }
// })();

// // ===== TOGGLE PASSWORD =====
// function togglePass(id, btn) {
//   const input = document.getElementById(id);
//   const icon = btn.querySelector("i");
//   if (input.type === "password") {
//     input.type = "text";
//     icon.className = "fa-regular fa-eye-slash";
//   } else {
//     input.type = "password";
//     icon.className = "fa-regular fa-eye";
//   }
// }

// // ===== SHOW ERROR/SUCCESS =====
// function showError(msg) {
//   const el = document.getElementById("formError");
//   const ok = document.getElementById("formSuccess");
//   if (ok) ok.classList.add("hidden");
//   if (el) {
//     el.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i>${msg}`;
//     el.classList.remove("hidden");
//   }
// }

// function showSuccess(msg) {
//   const el = document.getElementById("formSuccess");
//   const err = document.getElementById("formError");
//   if (err) err.classList.add("hidden");
//   if (el) {
//     el.innerHTML = `<i class="fa-solid fa-circle-check"></i>${msg}`;
//     el.classList.remove("hidden");
//   }
// }

// function clearMessages() {
//   const err = document.getElementById("formError");
//   const ok = document.getElementById("formSuccess");
//   if (err) err.classList.add("hidden");
//   if (ok) ok.classList.add("hidden");
// }

// // ===== INPUT SHAKE ANIMATION =====
// function shakeInput(id) {
//   const el = document.getElementById(id);
//   if (!el) return;
//   el.classList.add("error");
//   el.style.animation = "shake 0.35s ease";
//   setTimeout(() => { el.style.animation = ""; }, 400);
// }

// // Add shake keyframe
// const style = document.createElement("style");
// style.textContent = `
//   @keyframes shake {
//     0%,100%{transform:translateX(0)}
//     20%{transform:translateX(-6px)}
//     40%{transform:translateX(6px)}
//     60%{transform:translateX(-4px)}
//     80%{transform:translateX(4px)}
//   }
// `;
// document.head.appendChild(style);

// // ===== REGISTER =====
// function handleRegister() {
//   clearMessages();
//   const name  = document.getElementById("fullname")?.value.trim();
//   const email = document.getElementById("email")?.value.trim();
//   const pass  = document.getElementById("password")?.value;
//   const conf  = document.getElementById("confirm")?.value;

//   if (!name) { shakeInput("fullname"); showError("Please enter your full name."); return; }
//   if (!email || !email.includes("@")) { shakeInput("email"); showError("Please enter a valid email."); return; }
//   if (!pass || pass.length < 6) { shakeInput("password"); showError("Password must be at least 6 characters."); return; }
//   if (pass !== conf) { shakeInput("confirm"); showError("Passwords do not match."); return; }

//   // Check if email already exists
//   const users = JSON.parse(localStorage.getItem("guideai_users") || "[]");
//   if (users.find(u => u.email === email)) {
//     shakeInput("email");
//     showError("This email is already registered. <a href='/pages/login.html'>Sign in</a>");
//     return;
//   }

//   // Save user
//   const user = { name, email, password: pass, createdAt: new Date().toISOString() };
//   users.push(user);
//   localStorage.setItem("guideai_users", JSON.stringify(users));

//   // Auto login
//   localStorage.setItem("guideai_current_user", JSON.stringify({ name, email }));

//   const btn = document.getElementById("submitBtn");
//   btn.textContent = "✓ Account Created!";
//   btn.disabled = true;
//   showSuccess("Account created successfully! Redirecting...");

//   // Redirect
//   const redirect = sessionStorage.getItem("auth_redirect") || "/index.html";
//   sessionStorage.removeItem("auth_redirect");
//   setTimeout(() => { window.location.href = redirect; }, 1200);
// }

// // ===== LOGIN =====
// function handleLogin() {
//   clearMessages();
//   const email = document.getElementById("email")?.value.trim();
//   const pass  = document.getElementById("password")?.value;

//   if (!email) { shakeInput("email"); showError("Please enter your email."); return; }
//   if (!pass)  { shakeInput("password"); showError("Please enter your password."); return; }

//   const users = JSON.parse(localStorage.getItem("guideai_users") || "[]");
//   const user = users.find(u => u.email === email && u.password === pass);

//   if (!user) {
//     shakeInput("email");
//     shakeInput("password");
//     showError("Incorrect email or password.");
//     return;
//   }

//   localStorage.setItem("guideai_current_user", JSON.stringify({ name: user.name, email: user.email }));

//   const btn = document.getElementById("submitBtn");
//   btn.textContent = "✓ Signed In!";
//   btn.disabled = true;
//   showSuccess("Welcome back, " + user.name + "! Redirecting...");

//   const redirect = sessionStorage.getItem("auth_redirect") || "/index.html";
//   sessionStorage.removeItem("auth_redirect");
//   setTimeout(() => { window.location.href = redirect; }, 1000);
// }

// // ===== GOOGLE (demo) =====
// function handleGoogle() {
//   const fakeName = "Google User";
//   const fakeEmail = "google_" + Date.now() + "@gmail.com";
//   localStorage.setItem("guideai_current_user", JSON.stringify({ name: fakeName, email: fakeEmail }));
//   showSuccess("Signed in with Google! Redirecting...");
//   const redirect = sessionStorage.getItem("auth_redirect") || "/index.html";
//   sessionStorage.removeItem("auth_redirect");
//   setTimeout(() => { window.location.href = redirect; }, 1000);
// }

// // ===== ENTER KEY =====
// document.addEventListener("keydown", (e) => {
//   if (e.key === "Enter") {
//     if (document.getElementById("fullname")) handleRegister();
//     else handleLogin();
//   }
// });



