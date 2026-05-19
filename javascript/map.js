(function(){if(localStorage.getItem("theme")==="dark"){document.documentElement.setAttribute("data-theme","dark");}})();

const hotels = [
  {
    id:1,name:"Lotte City Hotel",location:"Tashkent",rating:4.8,price:185,category:"luxury",
    coords:[41.2995,69.2401],
    desc:"A modern hotel in the heart of Tashkent offering premium service and stunning city views.",
    amenities:["City View","Pool","Spa","Restaurant","Free WiFi","Gym"],
    images:["https://lh3.googleusercontent.com/p/AF1QipPAUtOvWh2dCStTwyZY8Ve2qYWJSwdjs22lpM86=w243-h174-n-k-no-nu","https://lh3.googleusercontent.com/p/AF1QipP_ZhIfhsAHL2r1n_kX0JEvNoQvAT3zqTlf9_oo=s1360-w1360-h1020-rw"],
    rooms:[{name:"Standard Room",price:185},{name:"Deluxe Room",price:260},{name:"Suite",price:420}]
  },
  {
    id:2,name:"Hyatt Regency Tashkent",location:"Tashkent",rating:4.9,price:220,category:"luxury",
    coords:[41.3001,69.2825],
    desc:"An internationally acclaimed Hyatt property — one of the most prestigious addresses in Tashkent.",
    amenities:["Rooftop Pool","Fine Dining","Business Center","Free WiFi","Concierge"],
    images:["https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2017/01/31/1112/Hyatt-Regency-Tashkent-P046-Exterior-Night-View.jpg/Hyatt-Regency-Tashkent-P046-Exterior-Night-View.16x9.jpg","https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2025/03/18/0928/TASRT-P0144-Regency-Suite-King-Bedroom-Armchair.jpg/TASRT-P0144-Regency-Suite-King-Bedroom-Armchair.16x9.jpg?imwidth=1920"],
    rooms:[{name:"King Room",price:220},{name:"Club Room",price:310},{name:"Presidential Suite",price:650}]
  },
  {
    id:3,name:"Samarkand Regency Hotel",location:"Samarkand",rating:4.7,price:95,category:"resort",
    coords:[39.6547,66.9597],
    desc:"A unique hotel close to Registan Square, blending historic charm with modern comfort.",
    amenities:["Historic View","Pool","Restaurant","Free WiFi","Tour Desk"],
    images:["https://lh3.googleusercontent.com/p/AF1QipNo_QIlMv1K9Qf-IqGDReOynjhTBENcdkz4xZgs=s1360-w1360-h1020-rw","https://lh3.googleusercontent.com/proxy/qIIHB8IOZ7g5pLVqhX4tV1Sw5jAP3pfwG08ggYyzUsCClQ7_hUXpYQ5xMR1xbNbo9TkzddT6Ulkd7o-eCVAe_yp5tvr1__mMQbF3pqnXQKO8qBCovx7xltyIHQYuyRYSnH0Gb-dwK9NG1vFxaRLIYBaOQgBUDEM=s1360-w1360-h1020-rw"],
    rooms:[{name:"Standard",price:95},{name:"Deluxe",price:140},{name:"Suite",price:220}]
  },
  {
    id:4,name:"Grand Samarkand Hotel",location:"Samarkand",rating:4.6,price:75,category:"budget",
    coords:[39.6710,66.9800],
    desc:"A conveniently located hotel in the center of Samarkand with all essential amenities.",
    amenities:["Free WiFi","Restaurant","Parking","24h Reception"],
    images:["https://avatars.mds.yandex.net/get-altay/14793643/2a00000195425df3c3dfafa127dd47640606/orig","https://q-xx.bstatic.com/xdata/images/hotel/max500/516839896.jpg?k=cfe43a56b7c97ac38faa4986de1bc70fd67a240ff7bf37c08d33a33ecffb72e0&o="],
    rooms:[{name:"Standard",price:75},{name:"Superior",price:110},{name:"Family Room",price:150}]
  },
  {
    id:5,name:"Bukhara Palace Hotel",location:"Bukhara",rating:4.8,price:110,category:"luxury",
    coords:[39.7753,64.4220],
    desc:"A magnificent hotel in the heart of Bukhara's old city, decorated in traditional national style.",
    amenities:["Historic District","Rooftop Terrace","Restaurant","Free WiFi","Airport Transfer"],
    images:["https://orioncons.com/wp-content/uploads/2020/12/Bukhara1.png","https://www.manzaratourism.com/userfiles/hotels/bukhara_palace_03.jpg"],
    rooms:[{name:"Classic Room",price:110},{name:"Deluxe",price:160},{name:"Suite",price:260}]
  },
  {
    id:7,name:"Khiva Palace Hotel",location:"Khiva",rating:4.7,price:88,category:"resort",
    coords:[41.3780,60.3640],
    desc:"Located beside the ancient walls of Itchan Kala — experience the beauty of Khiva's architecture.",
    amenities:["Old City View","Terrace","Restaurant","Free WiFi","Tours"],
    images:["https://kompastour.com/useruploads/hotels/main_5865d358b7.jpg","https://cf.bstatic.com/xdata/images/hotel/max1024x768/479129816.jpg?k=13db3c1247de0587659ff5ae6b2caf3b52d81dea828b5d0c50adfce505795974&o="],
    rooms:[{name:"Standard",price:88},{name:"Deluxe",price:130},{name:"Suite",price:200}]
  },
  {
    id:8,name:"Orient Star Khiva",location:"Khiva",rating:4.9,price:120,category:"luxury",
    coords:[41.3795,60.3618],
    desc:"The most renowned hotel in Khiva, housed inside a historic madrasa building.",
    amenities:["Madrasa Building","Rooftop","Restaurant","Free WiFi","Museum Access"],
    images:["https://uzbek-travel.com/images/uz/Hotels/Khiva/Orient_Star_Hotel/orientstarkhiva1.jpg","https://q-xx.bstatic.com/xdata/images/hotel/max500/538006428.jpg?k=21ead2ba67e45d02638012b4ce5493eb902f28993d68cb874c4ddfc32e352395&o="],
    rooms:[{name:"Classic",price:120},{name:"Deluxe",price:175},{name:"Royal Suite",price:300}]
  },
  {
    id:9,name:"Navruz Hotel Fergana",location:"Fergana",rating:4.4,price:55,category:"budget",
    coords:[40.3864,71.7864],
    desc:"A cozy hotel in the heart of the Fergana Valley with local cuisine and warm hospitality.",
    amenities:["Free WiFi","Restaurant","Parking","Airport Shuttle"],
    images:["https://mybooking-file-storage-eu.s3.eu-central-1.amazonaws.com/uploads/hotel/images/639_1611836675rtyj_1024x768.jpg","https://www.navruzhotel.uz/_nuxt/img/suite8.5090a66.jpg"],
    rooms:[{name:"Standard",price:55},{name:"Superior",price:80},{name:"Family",price:110}]
  },
  {
    id:10,name:"Termez International Hotel",location:"Termez",rating:4.3,price:70,category:"resort",
    coords:[37.2242,67.2783],
    desc:"A modern hotel in southern Uzbekistan's Termez city, close to the archaeological museum.",
    amenities:["Pool","Restaurant","Free WiFi","Parking","Tours"],
    images:["https://www.hilton.com/im/en/TMJUZGI/22093618/20241120-120052.jpg?impolicy=crop&cw=4000&ch=2239&gravity=NorthWest&xposition=0&yposition=380&rw=768&rh=430","https://cf.bstatic.com/xdata/images/hotel/max1024x768/617253365.jpg?k=c93e343ed8ac614d05241fdecd3cd208e579a67d03cfc23a9d0551c97146d847&o="],
    rooms:[{name:"Standard",price:70},{name:"Deluxe",price:100},{name:"Suite",price:160}]
  },
  {
    id:11,name:"Silk Road Hotel Nukus",location:"Nukus",rating:4.2,price:50,category:"budget",
    coords:[42.4605,59.6108],
    desc:"A hotel in Nukus, the capital of Karakalpakstan, close to the Savitsky Museum.",
    amenities:["Free WiFi","Restaurant","Parking"],
    images:["https://cf.bstatic.com/xdata/images/hotel/max1024x768/703535021.jpg?k=6855e47a37427212df27200ac04b0bd0348d1c5d35e78060b5812cfa5dcfbc89&o=","https://mybooking-file-storage-eu.s3.eu-central-1.amazonaws.com/uploads/hotel/images/3120_1750164999ZpTP_1024x768.JPG"],
    rooms:[{name:"Standard",price:50},{name:"Superior",price:72},{name:"Suite",price:110}]
  },
  {
    id:12,name:"Shahrisabz Heritage Hotel",location:"Shahrisabz",rating:4.6,price:85,category:"resort",
    coords:[39.0581,66.8319],
    desc:"A unique hotel in Shahrisabz, the birthplace of Amir Timur, near the ruins of Ak-Saray Palace.",
    amenities:["Historic View","Free WiFi","Restaurant","Tour Desk","Parking"],
    images:["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80","https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80"],
    rooms:[{name:"Standard",price:85},{name:"Deluxe",price:125},{name:"Suite",price:190}]
  }
];

let activeHotel=null,currentImgIdx=0,bookingData={},ymap=null,placemarks=[],currentList=[...hotels];

document.addEventListener("DOMContentLoaded",()=>{
  renderHotelList(hotels);updateCount(hotels);initFilters();initSearch();initDetailEvents();initBookingModal();initPaymentModal();loadYandexMap();
});

function loadYandexMap(){
  if(typeof ymaps==="undefined")return;
  ymaps.ready(()=>{
    ymap=new ymaps.Map("mapContainer",{center:[41.0,63.0],zoom:5,controls:["zoomControl","fullscreenControl"]});
    renderPlacemarks(hotels);
  });
}

function renderPlacemarks(list){
  placemarks.forEach(p=>ymap.geoObjects.remove(p));placemarks=[];
  list.forEach(h=>{
    const isActive=activeHotel?.id===h.id;
    const pm=new ymaps.Placemark(h.coords,{},{
      iconLayout:ymaps.templateLayoutFactory.createClass(
        `<div class="hotel-pin${isActive?' active':''}">$${h.price}</div>`
      ),
      iconShape:{type:"Rectangle",coordinates:[[-30,-16],[30,16]]}
    });
    pm.events.add("click",()=>openDetail(h));
    ymap.geoObjects.add(pm);placemarks.push(pm);
  });
}

function renderHotelList(list){
  currentList=list;
  const el=document.getElementById("hotelList");el.innerHTML="";
  updateCount(list);
  list.forEach(h=>{
    const card=document.createElement("div");
    card.className="map-hotel-card"+(activeHotel?.id===h.id?" active":"");
    card.dataset.id=h.id;
    card.innerHTML=`
      <img class="map-hotel-card__img" src="${h.images[0]}" alt="${h.name}" loading="lazy"/>
      <div class="map-hotel-card__body">
        <div class="map-hotel-card__name">${h.name}</div>
        <div class="map-hotel-card__loc"><i class="fa-solid fa-location-dot"></i>${h.location}, Uzbekistan</div>
        <div class="map-hotel-card__meta">
          <span class="map-hotel-card__rating"><i class="fa-solid fa-star"></i>${h.rating}</span>
          <span class="map-hotel-card__price">$${h.price}/night</span>
        </div>
      </div>`;
    card.addEventListener("click",()=>{openDetail(h);if(ymap)ymap.setCenter(h.coords,12,{duration:500});});
    el.appendChild(card);
  });
}

function updateCount(list){
  const el=document.getElementById("hotelCount");
  if(el) el.textContent=list.length+" hotel"+(list.length!==1?"s":"")+" found";
}

function initFilters(){
  document.querySelectorAll(".map-filter").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelectorAll(".map-filter").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      const f=btn.dataset.filter;
      const filtered=f==="all"?hotels:hotels.filter(h=>h.category===f);
      renderHotelList(filtered);if(ymap)renderPlacemarks(filtered);
    });
  });
}

function initSearch(){
  document.getElementById("searchInput").addEventListener("input",function(){
    const q=this.value.toLowerCase();
    const filtered=hotels.filter(h=>h.name.toLowerCase().includes(q)||h.location.toLowerCase().includes(q));
    renderHotelList(filtered);if(ymap)renderPlacemarks(filtered);
  });
}

function openDetail(hotel){
  activeHotel=hotel;currentImgIdx=0;
  document.querySelectorAll(".map-hotel-card").forEach(c=>c.classList.toggle("active",parseInt(c.dataset.id)===hotel.id));
  document.getElementById("detailName").textContent=hotel.name;
  document.getElementById("detailLocation").textContent=hotel.location+", Uzbekistan";
  document.getElementById("detailRating").textContent=hotel.rating;
  document.getElementById("detailDesc").textContent=hotel.desc;
  document.getElementById("detailPrice").textContent="$"+hotel.price;
  document.getElementById("detailImg").src=hotel.images[0];
  document.getElementById("detailAmenities").innerHTML=hotel.amenities.map(a=>`<span class="amenity-tag">${a}</span>`).join("");
  const dotsEl=document.getElementById("galleryDots");
  dotsEl.innerHTML=hotel.images.map((_,i)=>`<div class="gallery-dot${i===0?" active":""}" data-i="${i}"></div>`).join("");
  dotsEl.querySelectorAll(".gallery-dot").forEach(d=>d.addEventListener("click",()=>setImg(parseInt(d.dataset.i))));
  document.getElementById("detailPanel").classList.add("open");
  if(ymap)renderPlacemarks(currentList);
}

function setImg(idx){
  if(!activeHotel)return;currentImgIdx=idx;
  document.getElementById("detailImg").src=activeHotel.images[idx];
  document.querySelectorAll(".gallery-dot").forEach((d,i)=>d.classList.toggle("active",i===idx));
}

function initDetailEvents(){
  document.getElementById("galleryPrev").addEventListener("click",()=>{if(activeHotel)setImg((currentImgIdx-1+activeHotel.images.length)%activeHotel.images.length);});
  document.getElementById("galleryNext").addEventListener("click",()=>{if(activeHotel)setImg((currentImgIdx+1)%activeHotel.images.length);});
  document.getElementById("closeDetail").addEventListener("click",()=>{
    document.getElementById("detailPanel").classList.remove("open");
    activeHotel=null;
    document.querySelectorAll(".map-hotel-card").forEach(c=>c.classList.remove("active"));
    if(ymap)renderPlacemarks(currentList);
  });
  document.getElementById("bookBtn").addEventListener("click",()=>{
    if(!activeHotel)return;
    if(!isLoggedIn()){showAuthGuard();return;}
    openBookingModal(activeHotel);
  });
}

function isLoggedIn(){return!!localStorage.getItem("guideai_current_user");}

function showAuthGuard(){
  const existing=document.getElementById("authGuardModal");if(existing)existing.remove();
  const modal=document.createElement("div");modal.id="authGuardModal";modal.className="auth-guard";
  modal.innerHTML=`
    <div class="auth-guard__overlay" onclick="document.getElementById('authGuardModal').remove()"></div>
    <div class="auth-guard__box">
      <button class="auth-guard__close" onclick="document.getElementById('authGuardModal').remove()"><i class="fa-solid fa-xmark"></i></button>
      <div class="auth-guard__icon"><i class="fa-solid fa-lock"></i></div>
      <h2>Sign in to Book</h2>
      <p>You need an account to book a hotel. It's free and takes less than a minute!</p>
      <div class="auth-guard__btns">
        <a href="/pages/create.html" class="auth-guard__btn-primary" onclick="saveRedirect()">Create Account</a>
        <a href="/pages/login.html" class="auth-guard__btn-secondary" onclick="saveRedirect()">Sign In</a>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

function saveRedirect(){sessionStorage.setItem("auth_redirect",window.location.href);}

function initBookingModal(){
  const today=new Date();const tomorrow=new Date(today);tomorrow.setDate(tomorrow.getDate()+1);
  document.getElementById("checkin").value=today.toISOString().split("T")[0];
  document.getElementById("checkout").value=tomorrow.toISOString().split("T")[0];
  ["checkin","checkout"].forEach(id=>document.getElementById(id).addEventListener("change",recalc));
  document.getElementById("closeModal").addEventListener("click",()=>closeModal("bookingModal"));
  document.getElementById("modalOverlay").addEventListener("click",()=>closeModal("bookingModal"));
  document.getElementById("payBtn").addEventListener("click",()=>{closeModal("bookingModal");openPaymentModal();});
}

function openBookingModal(hotel){
  document.getElementById("modalHotelName").textContent=hotel.name+" · "+hotel.location;
  const roomsEl=document.getElementById("modalRooms");
  roomsEl.innerHTML=hotel.rooms.map((r,i)=>`
    <div class="room-option${i===0?" selected":""}" data-price="${r.price}" data-name="${r.name}">
      <div class="room-option__left"><div class="room-option__radio"></div><span class="room-option__name">${r.name}</span></div>
      <span class="room-option__price">$${r.price}/night</span>
    </div>`).join("");
  roomsEl.querySelectorAll(".room-option").forEach(opt=>opt.addEventListener("click",()=>{
    roomsEl.querySelectorAll(".room-option").forEach(o=>o.classList.remove("selected"));
    opt.classList.add("selected");recalc();
  }));
  document.getElementById("bookingModal").classList.remove("hidden");recalc();
}

function recalc(){
  const cin=new Date(document.getElementById("checkin").value);
  const cout=new Date(document.getElementById("checkout").value);
  const nights=Math.max(1,Math.round((cout-cin)/86400000));
  const sel=document.querySelector(".room-option.selected");if(!sel)return;
  const price=parseInt(sel.dataset.price);const name=sel.dataset.name;
  const total=price*nights;const payNow=Math.ceil(total/2);const payLater=total-payNow;
  document.getElementById("sumNights").textContent=nights;
  document.getElementById("sumRoom").textContent=name;
  document.getElementById("sumTotal").textContent="$"+total;
  document.getElementById("sumPay").textContent="$"+payNow;
  document.getElementById("sumLater").textContent="$"+payLater;
  bookingData={hotel:activeHotel,checkin:document.getElementById("checkin").value,checkout:document.getElementById("checkout").value,guests:document.getElementById("guests").value,room:name,roomPrice:price,nights,total,payNow,payLater};
}

function initPaymentModal(){
  document.getElementById("closePayment").addEventListener("click",()=>closeModal("paymentModal"));
  document.getElementById("payOverlay").addEventListener("click",()=>closeModal("paymentModal"));
  document.getElementById("cardNum").addEventListener("input",function(){this.value=this.value.replace(/\D/g,"").replace(/(.{4})/g,"$1 ").trim().slice(0,19);});
  document.getElementById("cardExp").addEventListener("input",function(){this.value=this.value.replace(/\D/g,"").replace(/^(\d{2})(\d)/,"$1/$2").slice(0,5);});
  document.getElementById("confirmPayBtn").addEventListener("click",()=>{
    if(!document.getElementById("cardNum").value||!document.getElementById("cardName").value||!document.getElementById("cardExp").value||!document.getElementById("cardCvv").value){alert("Please fill in all fields!");return;}
    closeModal("paymentModal");showConfirmation();
  });
}

function openPaymentModal(){
  document.getElementById("payHotelName").textContent=(bookingData.hotel?.name||"")+" · "+(bookingData.room||"");
  document.getElementById("payAmount").textContent=(bookingData.payNow||"");
  document.getElementById("paymentModal").classList.remove("hidden");
}

function showConfirmation(){
  const d=bookingData;const ref="BK"+Date.now();
  const fmt=s=>new Date(s).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
  const newBooking={ref,hotelName:d.hotel?.name||"",location:d.hotel?.location||"",room:d.room,checkin:d.checkin,checkout:d.checkout,guests:d.guests,nights:d.nights,total:d.total,payNow:d.payNow,payLater:d.payLater,image:d.hotel?.images?.[0]||"",bookedAt:new Date().toISOString()};
  const existing=JSON.parse(localStorage.getItem("guideai_bookings")||"[]");
  existing.unshift(newBooking);localStorage.setItem("guideai_bookings",JSON.stringify(existing));
  document.getElementById("confirmedCard").innerHTML=`
    <div class="confirmed-card-row"><span>Hotel</span><strong>${d.hotel?.name}</strong></div>
    <div class="confirmed-card-row"><span>Room</span><strong>${d.room}</strong></div>
    <div class="confirmed-card-row"><span>Check-in</span><strong>${fmt(d.checkin)}</strong></div>
    <div class="confirmed-card-row"><span>Check-out</span><strong>${fmt(d.checkout)}</strong></div>
    <div class="confirmed-card-row"><span>Guests</span><strong>${d.guests}</strong></div>
    <div class="confirmed-card-row"><span>Paid now</span><strong style="color:#22c55e">$${d.payNow}</strong></div>
    <div class="confirmed-card-row"><span>Pay at hotel</span><strong style="color:#6366f1">$${d.payLater}</strong></div>`;
  document.getElementById("confirmedRef").textContent=ref;
  document.getElementById("confirmedModal").classList.remove("hidden");
}

function closeModal(id){document.getElementById(id).classList.add("hidden");}
function closeAllModals(){["bookingModal","paymentModal","confirmedModal"].forEach(closeModal);}