let currentLang = "it";
let langIndex = 0;
let langInterval = null;


const languageTitles = [
  "Scegli la lingua",
  "Choose your language",
  "Оберіть мову"
];

const translations = {
  it: {
    weddingInvitation: "WEDDING INVITATION",
    eventDate: "XX ottobre 2026",
    ceremony: "Cerimonia",
    reception: "Ricevimento",
    rsvp: "Conferma",
    info: "Info",
    photos: "Foto",
    gift: "Regalo",

    tapSeal: "Tocca la ceralacca",
    back: "Indietro",

    ceremonyPlace: "Duomo di San Giovanni Battista",
    ceremonyAddress: "Via Duomo, 12\n72100 Brindisi (BR), Italia",
    ceremonyTime: "Ore 13:00",
    openMap: "Apri su Google Maps",

    parkingTitle: "Parcheggi consigliati",
    parkingNear: "Parcheggio vicino",
    parkingEasy: "Parcheggio comodo",
    parkingAlt: "Alternativa",
    parkingWalk2: "2 min a piedi",
    parkingWalk5: "5 min a piedi",
    parkingWalk10: "10 min a piedi",
    openSmall: "Apri",

    receptionPlace: "Masseria Montalbano",
    receptionAddress: "SS16, km 871,800\n72017 Ostuni (BR), Italia",
    receptionTime: "Ore 15:00",
    openWebsite: "Sito web",

    rsvpTitle: "RSVP",
    rsvpText: "Conferma la tua presenza entro il 10 settembre",
    rsvpButton: "Conferma partecipazione",

    infoIntro: "Tutte le informazioni utili per il vostro soggiorno",
    infoContent: `
      <div class="info-section">
        <h3>🏨 Alloggi</h3>
        <p>Consigliamo di soggiornare direttamente presso la struttura del ricevimento.</p>
        <p><em>(Link struttura)</em></p>
        <p>In alternativa sono disponibili diversi B&amp;B nei dintorni di Brindisi, Ostuni e Fasano.</p>
      </div>

      <div class="info-section">
        <h3>✈️ 🚆 🚗 Trasporti</h3>
        <p>Brindisi è raggiungibile in aereo tramite l’aeroporto di Brindisi o Bari, circa 1h20 in auto.</p>
        <p>È disponibile un collegamento bus tra i due aeroporti, circa 7€.</p>
        <p>In treno: stazione Brindisi Centrale.</p>
        <p>Uber non è disponibile. I taxi sono limitati. Si consiglia il noleggio auto.</p>
        <p>Per condividere passaggi tra invitati sarà disponibile un modulo dedicato.</p>
        <p>Sarà disponibile un servizio navetta tra chiesa e ricevimento.</p>
      </div>

      <div class="info-section">
        <h3>👔 Dress code</h3>
        <p>Elegante.</p>
      </div>

      <div class="info-section">
        <h3>📞 Contatti</h3>
        <p>Fabio: +39 XXX<br>Inna: +XX XXX</p>
      </div>
    `,

    photosTitle: "Foto",
    photosText: "Hai scattato qualche foto? 👇",
    photosButton: "Condividi i tuoi ricordi",
    photosNote: "Puoi caricare foto e video anche dopo il matrimonio.",

    giftTitle: "Regalo",
    giftText: "Il regalo più grande è la vostra presenza. Se desiderate contribuire, potete farlo qui.",
    copyIban: "Copia IBAN",
    ibanCopied: "IBAN copiato",
    ibanManual: "Copia manualmente l'IBAN"
  },

  en: {
    weddingInvitation: "WEDDING INVITATION",
    eventDate: "XX October 2026",
    ceremony: "Ceremony",
    reception: "Reception",
    rsvp: "RSVP",
    info: "Info",
    photos: "Photos",
    gift: "Gift",

    tapSeal: "Tap the seal",
    back: "Back",

    ceremonyPlace: "Duomo di San Giovanni Battista",
    ceremonyAddress: "Via Duomo, 12\n72100 Brindisi (BR), Italy",
    ceremonyTime: "Time: 13:00",
    openMap: "Open in Google Maps",

    parkingTitle: "Recommended parking",
    parkingNear: "Nearest parking",
    parkingEasy: "Easy parking",
    parkingAlt: "Alternative",
    parkingWalk2: "2 min walk",
    parkingWalk5: "5 min walk",
    parkingWalk10: "10 min walk",
    openSmall: "Open",

    receptionPlace: "Masseria Montalbano",
    receptionAddress: "SS16, km 871,800\n72017 Ostuni (BR), Italy",
    receptionTime: "Time: 15:00",
    openWebsite: "Website",

    rsvpTitle: "RSVP",
    rsvpText: "Please confirm your attendance by September 10",
    rsvpButton: "Confirm attendance",

    infoIntro: "All the useful information for your stay",
    infoContent: `
      <div class="info-section">
        <h3>🏨 Accommodation</h3>
        <p>We recommend staying directly at the reception venue.</p>
        <p><em>(Venue link)</em></p>
        <p>Alternatively, there are several B&amp;Bs around Brindisi, Ostuni and Fasano.</p>
      </div>

      <div class="info-section">
        <h3>✈️ 🚆 🚗 Transport</h3>
        <p>Brindisi can be reached by flying into Brindisi Airport or Bari Airport, about 1h20 by car.</p>
        <p>A shuttle bus connects the two airports, approx. €7.</p>
        <p>By train: Brindisi Central Station.</p>
        <p>Uber is not available. Taxis are limited. Car rental is recommended.</p>
        <p>A dedicated form will be available for guests who wish to share rides.</p>
        <p>A shuttle service will be available between the church and the reception.</p>
      </div>

      <div class="info-section">
        <h3>👔 Dress code</h3>
        <p>Elegant.</p>
      </div>

      <div class="info-section">
        <h3>📞 Contacts</h3>
        <p>Fabio: +39 XXX<br>Inna: +XX XXX</p>
      </div>
    `,

    photosTitle: "Photos",
    photosText: "Did you take some photos? 👇",
    photosButton: "Share your memories",
    photosNote: "You can upload photos and videos even after the wedding.",

    giftTitle: "Gift",
    giftText: "Your presence is the greatest gift. If you wish to contribute, you can do it here.",
    copyIban: "Copy IBAN",
    ibanCopied: "IBAN copied",
    ibanManual: "Copy the IBAN manually"
  },

  ua: {
    weddingInvitation: "ВЕСІЛЬНЕ ЗАПРОШЕННЯ",
    eventDate: "XX жовтня 2026",
    ceremony: "Церемонія",
    reception: "Святкування",
    rsvp: "Підтвердження",
    info: "Інфо",
    photos: "Фото",
    gift: "Подарунок",

    tapSeal: "Натисніть на печатку",
    back: "Назад",

    ceremonyPlace: "Duomo di San Giovanni Battista",
    ceremonyAddress: "Via Duomo, 12\n72100 Brindisi (BR), Італія",
    ceremonyTime: "Час: 13:00",
    openMap: "Відкрити в Google Maps",

    parkingTitle: "Рекомендовані парковки",
    parkingNear: "Найближча парковка",
    parkingEasy: "Зручна парковка",
    parkingAlt: "Альтернатива",
    parkingWalk2: "2 хв пішки",
    parkingWalk5: "5 хв пішки",
    parkingWalk10: "10 хв пішки",
    openSmall: "Відкрити",

    receptionPlace: "Masseria Montalbano",
    receptionAddress: "SS16, km 871,800\n72017 Ostuni (BR), Італія",
    receptionTime: "Час: 15:00",
    openWebsite: "Сайт",

    rsvpTitle: "Підтвердження",
    rsvpText: "Підтвердіть свою присутність до 10 вересня",
    rsvpButton: "Підтвердити участь",

    infoIntro: "Уся корисна інформація для вашого перебування",
    infoContent: `
      <div class="info-section">
        <h3>🏨 Проживання</h3>
        <p>Рекомендуємо зупинитися безпосередньо в місці проведення святкування.</p>
        <p><em>(Посилання на локацію)</em></p>
        <p>Також доступні різні B&amp;B у районах Бріндізі, Остуні та Фазано.</p>
      </div>

      <div class="info-section">
        <h3>✈️ 🚆 🚗 Транспорт</h3>
        <p>До Бріндізі можна дістатися літаком через аеропорт Бріндізі або Барі, приблизно 1 год 20 хв на авто.</p>
        <p>Між аеропортами курсує автобус, приблизно 7€.</p>
        <p>Потягом: станція Brindisi Centrale.</p>
        <p>Uber недоступний. Таксі обмежені. Рекомендуємо оренду автомобіля.</p>
        <p>Буде доступна окрема форма для гостей, які бажають поділитися поїздкою.</p>
        <p>Буде організований трансфер між церквою та місцем святкування.</p>
      </div>

      <div class="info-section">
        <h3>👔 Дрес-код</h3>
        <p>Елегантний.</p>
      </div>

      <div class="info-section">
        <h3>📞 Контакти</h3>
        <p>Fabio: +39 XXX<br>Inna: +XX XXX</p>
      </div>
    `,

    photosTitle: "Фото",
    photosText: "Зробили кілька фото? 👇",
    photosButton: "Поділіться спогадами",
    photosNote: "Ви можете завантажувати фото та відео навіть після весілля.",

    giftTitle: "Подарунок",
    giftText: "Найбільший подарунок — це ваша присутність. Якщо бажаєте зробити внесок, можете зробити це тут.",
    copyIban: "Скопіювати IBAN",
    ibanCopied: "IBAN скопійовано",
    ibanManual: "Скопіюйте IBAN вручну"
  }
};

function applyTranslations(lang) {
  const dict = translations[lang] || translations.it;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key || !(key in dict)) return;
    el.innerHTML = String(dict[key]).replace(/\n/g, "<br>");
  });

  document.documentElement.lang = lang === "ua" ? "uk" : lang;
}


function startLanguageRotation() {
  const el = document.getElementById("language-rotator");
  if (!el) return;

  stopLanguageRotation();

  langIndex = 0;
  el.textContent = languageTitles[langIndex];
  el.classList.remove("fade-out", "fade-in");

  langInterval = setInterval(() => {
    el.classList.add("fade-out");

    setTimeout(() => {
      langIndex = (langIndex + 1) % languageTitles.length;
      el.textContent = languageTitles[langIndex];
      el.classList.remove("fade-out");
      el.classList.add("fade-in");
    }, 400);

    setTimeout(() => {
      el.classList.remove("fade-in");
    }, 850);
  }, 2000);
}

function stopLanguageRotation() {
  if (!langInterval) return;
  clearInterval(langInterval);
  langInterval = null;
}

function setLanguage(lang) {
  stopLanguageRotation();

  currentLang = translations[lang] ? lang : "it";
  localStorage.setItem("wedding_lang", currentLang);

  applyTranslations(currentLang);

  const homeImg = document.querySelector(".home-luxury-bg img");

  const imageMap = {
    it: "assets/home-luxury-it.jpg",
    en: "assets/home-luxury-en.jpg",
    ua: "assets/home-luxury-ua.jpg"
  };

  const newSrc = imageMap[currentLang] || imageMap.it;

  if (!homeImg) {
    openEnvelope();
    return;
  }

  const preload = new Image();

  preload.onload = () => {
    homeImg.src = newSrc;
    openEnvelope();
  };

  preload.onerror = () => {
    console.warn("Immagine non trovata:", newSrc);
    openEnvelope(); // così non resta bloccato
  };

  preload.src = newSrc;
}

function openEnvelope() {

  const languageScreen = document.getElementById("language-screen");

  const homeScreen = document.getElementById("home-screen");

  if (!languageScreen || !homeScreen) return;

  homeScreen.classList.remove("hidden");

  homeScreen.style.visibility = "visible";

  homeScreen.style.opacity = "1";

  homeScreen.style.pointerEvents = "auto";

  languageScreen.style.opacity = "0";

  languageScreen.style.visibility = "hidden";

  languageScreen.style.pointerEvents = "none";

  setTimeout(() => {

    languageScreen.classList.add("hidden");

  }, 120);

}

function openSection(sectionId) {
  const homeScreen = document.getElementById("home-screen");
  const section = document.getElementById(sectionId);

  if (!section) return;

  if (homeScreen) {
    homeScreen.classList.add("hidden");
    homeScreen.style.opacity = "0";
    homeScreen.style.visibility = "hidden";
    homeScreen.style.pointerEvents = "none";
  }

  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.add("hidden");
    panel.classList.remove("fade-in", "fade-out");
    panel.style.opacity = "0";
    panel.style.visibility = "hidden";
    panel.style.pointerEvents = "none";
  });

  section.classList.remove("hidden");
  section.style.opacity = "1";
  section.style.visibility = "visible";
  section.style.pointerEvents = "auto";
  section.classList.add("fade-in");

  applyTranslations(currentLang);
}

function goBack() {
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.add("hidden");
    panel.classList.remove("fade-in", "fade-out");
    panel.style.opacity = "0";
    panel.style.visibility = "hidden";
    panel.style.pointerEvents = "none";
  });

  const homeScreen = document.getElementById("home-screen");
  if (!homeScreen) return;

  homeScreen.classList.remove("hidden");
  homeScreen.style.opacity = "1";
  homeScreen.style.visibility = "visible";
  homeScreen.style.pointerEvents = "auto";
}

function resetLanguageScreen() {
  const languageScreen = document.getElementById("language-screen");
  const homeScreen = document.getElementById("home-screen");
  const box = document.getElementById("language-box");

  stopLanguageRotation();

  if (homeScreen) {
    homeScreen.classList.add("hidden");
    homeScreen.style.opacity = "0";
    homeScreen.style.visibility = "hidden";
    homeScreen.style.pointerEvents = "none";
  }

  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.add("hidden");
    panel.classList.remove("fade-in", "fade-out");
    panel.style.opacity = "0";
    panel.style.visibility = "hidden";
    panel.style.pointerEvents = "none";
  });

  if (languageScreen) {
    languageScreen.classList.remove("hidden", "fade-in", "fade-out");
    languageScreen.style.opacity = "1";
    languageScreen.style.visibility = "visible";
    languageScreen.style.pointerEvents = "auto";
  }

  if (box) {
    box.style.display = "block";
    box.style.opacity = "1";
    box.style.visibility = "visible";
    box.style.pointerEvents = "auto";
  }

  startLanguageRotation();
}

function goBackToLanguage() {
  resetLanguageScreen();
}

function changeLanguage() {
  resetLanguageScreen();
}

function copyIBAN() {
  const ibanEl = document.getElementById("iban");
  const dict = translations[currentLang] || translations.it;

  if (!ibanEl) return;

  const iban = ibanEl.textContent.trim();

  navigator.clipboard.writeText(iban)
    .then(() => alert(dict.ibanCopied))
    .catch(() => alert(dict.ibanManual));
}

function openCeremonyMap() {
  window.open("https://maps.app.goo.gl/bbaEuzwVKs98JcAu7", "_blank");
}

function toggleParking() {
  const list = document.getElementById("parking-list");
  const arrow = document.getElementById("parking-arrow");

  if (!list || !arrow) return;

  list.classList.toggle("hidden");
  list.classList.toggle("parking-open");

  arrow.textContent = list.classList.contains("hidden") ? "⌄" : "⌃";
}

function openParkingMap(number) {
  const links = {
    1: "https://maps.app.goo.gl/exuddjALBbtdyYV59",
    2: "https://maps.app.goo.gl/oVoGKFF5gi2VfXUD9",
    3: "https://maps.app.goo.gl/HiJgw4G2VcMLMoN39"
  };

  if (links[number]) window.open(links[number], "_blank");
}

function openReceptionMap() {
  window.open("https://maps.app.goo.gl/mqKc28RPTLKqBD8P9", "_blank");
}

function openReceptionWebsite() {
  window.open("https://www.masseriamontalbano.it/", "_blank");
}

function openRSVPForm() {
  const params = new URLSearchParams(window.location.search);

  const guestId = params.get("id") || "F001";
  const guestName = params.get("name") || "Fabio Greco";

  const forms = {
    it: "https://docs.google.com/forms/d/e/1FAIpQLSe7k03qwau1hYumu90xT_IRGECOyBpikZ3oQGsSTZWaO5mkXQ/viewform?usp=pp_url",
    en: "https://docs.google.com/forms/d/e/1FAIpQLSfksh99J6tctzbF52lIzZIPuwsFFbpGtuK4pyAqxIqw8X0HYw/viewform?usp=pp_url",
    ua: "https://docs.google.com/forms/d/e/1FAIpQLSfQ9pza3r-AxOzcppb69tEbS-XTsNu10OtQUhN3SgkO0zVsNw/viewform?usp=pp_url"
  };

  const base = forms[currentLang] || forms.it;

  const url =
    base +
    "&entry.1990752556=" + encodeURIComponent(guestId) +
    "&entry.321333560=" + encodeURIComponent(guestName);

  window.open(url, "_blank");
}

function confirmRSVP() {
  const messages = {
    it: "Verrai reindirizzato al modulo di conferma.",
    en: "You will be redirected to the RSVP form.",
    ua: "Вас буде перенаправлено до форми підтвердження."
  };

  if (confirm(messages[currentLang] || messages.it)) {
    openRSVPForm();
  }
}

function openPhotosUpload() {
  window.open("https://www.dropbox.com/request/m84qjpml4iolvosgwgit", "_blank");
}

function restoreSavedLanguage() {
  const savedLang = localStorage.getItem("wedding_lang");
  currentLang = savedLang && translations[savedLang] ? savedLang : "it";
  applyTranslations(currentLang);
}

window.addEventListener("load", () => {
  restoreSavedLanguage();
  startLanguageRotation();
});

window.addEventListener("resize", () => {
  positionSealHotspot();
});

function openDoorIntro() {
  const intro = document.getElementById("door-intro");
  if (!intro) return;

  intro.classList.add("opening");

  setTimeout(() => {
    intro.classList.add("show-enter");
  }, 1300);
}

function playDoorVideo() {
  const intro = document.getElementById("door-intro");

  if (!intro) return;

  intro.classList.add("video-playing");
  intro.classList.add("show-enter");
}

function enterInvitation() {
  const intro = document.getElementById("door-intro");
  const languageScreen = document.getElementById("language-screen");

  if (intro) {
    intro.style.display = "none";
  }

  if (languageScreen) {
    languageScreen.classList.remove("hidden");

    languageScreen.style.display = "block";
    languageScreen.style.opacity = "1";
    languageScreen.style.visibility = "visible";
    languageScreen.style.pointerEvents = "auto";
  }

  startLanguageRotation();
}
