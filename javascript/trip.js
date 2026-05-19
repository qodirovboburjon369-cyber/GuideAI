// Theme
(function () {
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  renderBookings("all");
  initFilters();
});

// ===== GET BOOKINGS =====
function getBookings() {
  try {
    return JSON.parse(localStorage.getItem("guideai_bookings") || "[]");
  } catch {
    return [];
  }
}

// ===== STATUS =====
function getStatus(booking) {
  const today = new Date();
  today.setHours(0,0,0,0);
  const checkin = new Date(booking.checkin);
  const checkout = new Date(booking.checkout);

  if (checkout < today) return "past";
  if (checkin <= today && checkout >= today) return "upcoming";
  return "upcoming";
}

function getStatusLabel(booking) {
  const s = getStatus(booking);
  if (s === "past") return { label: "Completed", cls: "past", icon: "fa-check-circle" };
  if (booking.payLater > 0) return { label: "50% Paid", cls: "partial", icon: "fa-clock" };
  return { label: "Fully Paid", cls: "paid", icon: "fa-circle-check" };
}

// ===== FILTERS =====
function initFilters() {
  document.querySelectorAll(".trip-filter").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".trip-filter").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderBookings(btn.dataset.f);
    });
  });
}

// ===== RENDER =====
function renderBookings(filter) {
  const all = getBookings();
  const today = new Date(); today.setHours(0,0,0,0);

  const filtered = filter === "all" ? all
    : filter === "upcoming" ? all.filter(b => new Date(b.checkout) >= today)
    : all.filter(b => new Date(b.checkout) < today);

  const list = document.getElementById("bookingsList");
  const empty = document.getElementById("emptyState");
  const countEl = document.getElementById("tripCount");

  countEl.textContent = `${filtered.length} booking${filtered.length !== 1 ? "s" : ""}`;

  if (filtered.length === 0) {
    list.innerHTML = "";
    empty.classList.remove("hidden");
    return;
  }

  empty.classList.add("hidden");

  list.innerHTML = filtered.map((b, idx) => {
    const status = getStatusLabel(b);
    const fmt = s => {
      const d = new Date(s);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };
    const fmtFull = s => {
      const d = new Date(s);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    return `
    <div class="booking-card" style="animation-delay:${idx * 0.07}s" data-ref="${b.ref}">
      <div class="booking-card__inner">
        <img class="booking-card__img" src="${b.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80'}" alt="${b.hotelName}"/>
        <div class="booking-card__body">

          <div class="booking-card__top">
            <div>
              <div class="booking-card__name">${b.hotelName}</div>
              <div class="booking-card__room"><i class="fa-solid fa-bed"></i>${b.room}</div>
            </div>
            <span class="status-badge ${status.cls}">
              <i class="fa-solid ${status.icon}"></i>${status.label}
            </span>
          </div>

          <div class="booking-card__info">
            <div class="booking-info-item">
              <i class="fa-solid fa-calendar-check"></i>
              <div class="booking-info-item__text">
                <div class="booking-info-item__label">Check-in</div>
                <div class="booking-info-item__val">${fmt(b.checkin)}</div>
              </div>
            </div>
            <div class="booking-info-item">
              <i class="fa-solid fa-calendar-xmark"></i>
              <div class="booking-info-item__text">
                <div class="booking-info-item__label">Check-out</div>
                <div class="booking-info-item__val">${fmt(b.checkout)}</div>
              </div>
            </div>
            <div class="booking-info-item">
              <i class="fa-solid fa-moon"></i>
              <div class="booking-info-item__text">
                <div class="booking-info-item__label">Nights</div>
                <div class="booking-info-item__val">${b.nights}</div>
              </div>
            </div>
            <div class="booking-info-item">
              <i class="fa-solid fa-users"></i>
              <div class="booking-info-item__text">
                <div class="booking-info-item__label">Guests</div>
                <div class="booking-info-item__val">${b.guests}</div>
              </div>
            </div>
          </div>

          <div class="booking-card__bottom">
            <div class="booking-ref">
              <span class="booking-ref__label">Booking Reference</span>
              <span class="booking-ref__val">${b.ref}</span>
            </div>
            <div class="booking-price-block">
              ${b.payLater > 0 ? `
              <div class="booking-price-item">
                <span class="booking-price-item__label">Pay at hotel</span>
                <span class="booking-price-item__val orange">$${b.payLater}</span>
              </div>` : ''}
              <div class="booking-price-item">
                <span class="booking-price-item__label">Paid</span>
                <span class="booking-price-item__val green">$${b.payNow}</span>
              </div>
              <div class="booking-price-item">
                <span class="booking-price-item__label">Total Price</span>
                <span class="booking-price-item__val">$${b.total}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div class="booking-card__actions">
        <button class="booking-action-btn" onclick="viewDetails('${b.ref}')">
          <i class="fa-solid fa-eye"></i> View Details
        </button>
        <button class="booking-action-btn danger" onclick="cancelBooking('${b.ref}')">
          <i class="fa-solid fa-trash"></i> Cancel
        </button>
      </div>
    </div>`;
  }).join("");
}

// ===== ACTIONS =====
function viewDetails(ref) {
  const b = getBookings().find(x => x.ref === ref);
  if (!b) return;
  const fmt = s => new Date(s).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  alert(`📋 Booking Details\n\nHotel: ${b.hotelName}\nRoom: ${b.room}\nCheck-in: ${fmt(b.checkin)}\nCheck-out: ${fmt(b.checkout)}\nGuests: ${b.guests}\nNights: ${b.nights}\nTotal: $${b.total}\nPaid: $${b.payNow}\nRemaining: $${b.payLater}\nRef: ${b.ref}`);
}

function cancelBooking(ref) {
  if (!confirm("Are you sure you want to cancel this booking?")) return;
  const bookings = getBookings().filter(x => x.ref !== ref);
  localStorage.setItem("guideai_bookings", JSON.stringify(bookings));
  const activeFilter = document.querySelector(".trip-filter.active")?.dataset.f || "all";
  renderBookings(activeFilter);
}