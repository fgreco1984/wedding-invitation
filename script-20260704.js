let currentLang = "it";
let langIndex = 0;
let langInterval = null;
let countdownInterval = null;
const guestNoticesShown = {
  kids: false,
  travel: false
};
let pendingNoticeSection = null;
let pendingNoticeCallback = null;
const weddingDate = new Date("2026-10-03T16:30:00+02:00");

const languageTitles = [
  "Scegli la lingua",
  "Choose your language",
  "Оберіть мову"
];

const translations = {
  it: {
    weddingInvitation: "WEDDING INVITATION",
    doorIntroLine: "Se sei giunto fin qui, allora sei pronto a varcare la soglia del nostro giorno più bello",
    ceremony: "Cerimonia",
    reception: "Ricevimento",
    rsvp: "Conferma",
    info: "Info",
    photos: "Foto",
    gift: "Pensiero",
    back: "Indietro",

    ceremonyPlace: "Duomo di San Giovanni Battista",
    ceremonyAddress: "Via Duomo, 12\n72100 Brindisi (BR), Italia",
    ceremonyTime: "Ore 16:30",
    openMap: "Apri su Google Maps",

    parkingTitle: "Parcheggi consigliati",
    parkingNear: "Parcheggio vicino",
    parkingEasy: "Parcheggio comodo",
    parkingAlt: "Alternativa",
    parkingWalk2: "2 min a piedi",
    parkingWalk5: "5 min a piedi",
    parkingWalk10: "10 min a piedi",
    openSmall: "Apri",

    receptionPlace: "Masseria Caselli",
    receptionAddress: "Contrada Caselli\n72012 Carovigno (BR), Italia",
    receptionTime: "A seguire",
    openWebsite: "Sito web",
    countdownKicker: "Mancano",
    countdownDays: "giorni",
    countdownHours: "ore",
    countdownMinutes: "min",
    countdownToday: "Oggi",

    rsvpTitle: "RSVP",
    rsvpText: "Conferma la tua presenza entro il 10 settembre",
    rsvpButton: "Conferma partecipazione",
    changeLanguage: "Cambia lingua",
    restartInvitation: "Torna all'inizio",
    confirmRedirect: "Verrai reindirizzato al modulo di conferma.",
    rsvpModalTitle: "Conferma RSVP",
    rsvpModalText: "Stai per aprire il modulo di conferma partecipazione.",
    guestNoticeTitle: "Una nota per te",
    guestNoticeButton: "Ho letto",
    adultOnlyNoticeTitle: "Una piccola nota per i genitori",
    adultOnlyNoticeText: "Amiamo i vostri piccoli angeli, ma per questo giorno speciale desideriamo vivere la celebrazione del nostro matrimonio in un’atmosfera riservata agli adulti. Vi ringraziamo di cuore per la comprensione.",
    travelNoticeTitle: "La vostra presenza è già un dono",
    travelNoticeText: "Avervi accanto dopo un viaggio così importante è già il dono più prezioso. La vostra presenza vale più di qualsiasi regalo.",
    hotelInfoTitle: "Pernottamento",
    hotelInfoText: "Ti abbiamo segnato tra gli ospiti per cui valutare il pernottamento. Il giorno del matrimonio sarà organizzato da noi; per eventuale notte prima o dopo ti invieremo i dettagli appena avremo conferme definitive su costi e disponibilità.",
    hotelInfoNote: "Se hai esigenze particolari, indicacele nel modulo RSVP o scrivici direttamente.",
    cancel: "Annulla",
    continueToForm: "Apri modulo",

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

    giftTitle: "Un pensiero",
    giftText: "La vostra presenza è il dono più bello. Per chi desidera lasciare un pensiero, potete farlo qui.",
    copyIban: "Copia IBAN",
    ibanCopied: "IBAN copiato",
    ibanManual: "Copia manualmente l'IBAN"
  },

  en: {
    weddingInvitation: "WEDDING INVITATION",
    doorIntroLine: "If you have made it this far, you are ready to cross the threshold of our most beautiful day",
    ceremony: "Ceremony",
    reception: "Reception",
    rsvp: "RSVP",
    info: "Info",
    photos: "Photos",
    gift: "A Thought",
    back: "Back",

    ceremonyPlace: "Duomo di San Giovanni Battista",
    ceremonyAddress: "Via Duomo, 12\n72100 Brindisi (BR), Italy",
    ceremonyTime: "Time: 16:30",
    openMap: "Open in Google Maps",

    parkingTitle: "Recommended parking",
    parkingNear: "Nearest parking",
    parkingEasy: "Easy parking",
    parkingAlt: "Alternative",
    parkingWalk2: "2 min walk",
    parkingWalk5: "5 min walk",
    parkingWalk10: "10 min walk",
    openSmall: "Open",

    receptionPlace: "Masseria Caselli",
    receptionAddress: "Contrada Caselli\n72012 Carovigno (BR), Italy",
    receptionTime: "To follow",
    openWebsite: "Website",
    countdownKicker: "Only",
    countdownDays: "days",
    countdownHours: "hours",
    countdownMinutes: "min",
    countdownToday: "Today",

    rsvpTitle: "RSVP",
    rsvpText: "Please confirm your attendance by September 10",
    rsvpButton: "Confirm attendance",
    changeLanguage: "Change language",
    restartInvitation: "Back to the beginning",
    confirmRedirect: "You will be redirected to the RSVP form.",
    rsvpModalTitle: "Confirm RSVP",
    rsvpModalText: "You are about to open the attendance confirmation form.",
    guestNoticeTitle: "A note for you",
    guestNoticeButton: "I understand",
    adultOnlyNoticeTitle: "Adults-only celebration",
    adultOnlyNoticeText: "We love your children, but for this special day we have decided to keep our wedding celebration for adults. Thank you for your understanding, and we can’t wait to celebrate together.",
    travelNoticeTitle: "Your presence is already a gift",
    travelNoticeText: "Having you with us after such an important journey is already the most precious gift. Your presence means more than any present.",
    hotelInfoTitle: "Accommodation",
    hotelInfoText: "We have marked you among the guests for whom accommodation may be arranged. The wedding day stay will be organized by us; for the night before or after, we will share the details as soon as costs and availability are confirmed.",
    hotelInfoNote: "If you have any specific needs, please mention them in the RSVP form or write to us directly.",
    cancel: "Cancel",
    continueToForm: "Open form",

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

    giftTitle: "A Thought",
    giftText: "Your presence is the greatest gift. If you wish to leave a thoughtful gesture, you can do it here.",
    copyIban: "Copy IBAN",
    ibanCopied: "IBAN copied",
    ibanManual: "Copy the IBAN manually"
  },

  ua: {
    weddingInvitation: "WEDDING INVITATION",
    doorIntroLine: "Якщо ти дійшов сюди, то готовий переступити поріг нашого найпрекраснішого дня",
    ceremony: "Церемонія",
    reception: "Святкування",
    rsvp: "Підтвердження",
    info: "Інфо",
    photos: "Фото",
    gift: "Знак уваги",
    back: "Назад",

    ceremonyPlace: "Duomo di San Giovanni Battista",
    ceremonyAddress: "Via Duomo, 12\n72100 Brindisi (BR), Італія",
    ceremonyTime: "Час: 16:30",
    openMap: "Відкрити в Google Maps",

    parkingTitle: "Рекомендовані парковки",
    parkingNear: "Найближча парковка",
    parkingEasy: "Зручна парковка",
    parkingAlt: "Альтернатива",
    parkingWalk2: "2 хв пішки",
    parkingWalk5: "5 хв пішки",
    parkingWalk10: "10 хв пішки",
    openSmall: "Відкрити",

    receptionPlace: "Masseria Caselli",
    receptionAddress: "Contrada Caselli\n72012 Carovigno (BR), Італія",
    receptionTime: "Після церемонії",
    openWebsite: "Сайт",
    countdownKicker: "Залишилось",
    countdownDays: "днів",
    countdownHours: "год",
    countdownMinutes: "хв",
    countdownToday: "Сьогодні",

    rsvpTitle: "Підтвердження",
    rsvpText: "Підтвердіть свою присутність до 10 вересня",
    rsvpButton: "Підтвердити участь",
    changeLanguage: "Змінити мову",
    restartInvitation: "Повернутися на початок",
    confirmRedirect: "Вас буде перенаправлено до форми підтвердження.",
    rsvpModalTitle: "Підтвердження RSVP",
    rsvpModalText: "Зараз відкриється форма підтвердження участі.",
    guestNoticeTitle: "Важлива примітка",
    guestNoticeButton: "Я прочитав/прочитала",
    adultOnlyNoticeTitle: "Святкування лише для дорослих",
    adultOnlyNoticeText: "Ми дуже любимо ваших дітей, але для цього особливого дня ми вирішили провести наше весільне святкування лише для дорослих. Дякуємо за розуміння і з нетерпінням чекаємо на спільне святкування.",
    travelNoticeTitle: "Ваша присутність уже є подарунком",
    travelNoticeText: "Мати вас поруч після такої важливої подорожі — це вже найцінніший подарунок. Ваша присутність для нас важить більше за будь-який подарунок.",
    hotelInfoTitle: "Проживання",
    hotelInfoText: "Ми відмітили вас серед гостей, для яких може знадобитися проживання. Ночівля у день весілля буде організована нами; щодо ночі до або після ми повідомимо деталі, щойно будуть підтверджені ціни та наявність місць.",
    hotelInfoNote: "Якщо у вас є особливі побажання, вкажіть їх у формі RSVP або напишіть нам напряму.",
    cancel: "Скасувати",
    continueToForm: "Відкрити форму",

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

    giftTitle: "Знак уваги",
    giftText: "Ваша присутність — найкращий подарунок. Якщо бажаєте залишити знак уваги, можете зробити це тут.",
    copyIban: "Скопіювати IBAN",
    ibanCopied: "IBAN скопійовано",
    ibanManual: "Скопіюйте IBAN вручну"
  }
};

function openExternal(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function getUrlLanguage() {
  try {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get("lang");

    return urlLang && translations[urlLang] ? urlLang : null;
  } catch (error) {
    return null;
  }
}

function getUrlFlag(name) {
  try {
    const params = new URLSearchParams(window.location.search);
    const aliases = name === "kids" ? ["kids", "children", "figli"] : [name];
    const value = aliases.map((alias) => params.get(alias)).find(Boolean);

    return value === "1" || value === "true" || value === "yes" || value === "si";
  } catch (error) {
    return false;
  }
}

function setAriaLabel(selector, label) {
  const el = document.querySelector(selector);

  if (el && label) {
    el.setAttribute("aria-label", label);
  }
}

function updateDynamicLabels(lang) {
  const dict = translations[lang] || translations.it;

  setAriaLabel(".hs-language", dict.restartInvitation);
  setAriaLabel(".hs-change-language", dict.changeLanguage);
  setAriaLabel(".hs-ceremony", dict.ceremony);
  setAriaLabel(".hs-reception", dict.reception);
  setAriaLabel(".hs-rsvp", dict.rsvpTitle);
  setAriaLabel(".hs-info", dict.info);
  setAriaLabel(".hs-photos", dict.photosTitle);
  setAriaLabel(".hs-gift", dict.giftTitle);

  const parkingList = document.getElementById("parking-list");
  const parkingToggle = document.querySelector(".parking-toggle");

  if (parkingList && parkingToggle) {
    parkingToggle.setAttribute("aria-expanded", String(!parkingList.classList.contains("hidden")));
  }
}

function updateCountdown() {
  const daysEl = document.getElementById("countdown-days");
  const hoursEl = document.getElementById("countdown-hours");
  const minutesEl = document.getElementById("countdown-minutes");
  const kickerEl = document.querySelector(".countdown-kicker");

  if (!daysEl || !hoursEl || !minutesEl || !kickerEl) {
    return;
  }

  const diff = weddingDate.getTime() - Date.now();
  const dict = translations[currentLang] || translations.it;

  if (diff <= 0) {
    kickerEl.textContent = dict.countdownToday;
    daysEl.textContent = "0";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    return;
  }

  const totalMinutes = Math.floor(diff / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  daysEl.textContent = String(days);
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
}

function buildHotelInfoBlock(dict) {
  return `
    <div class="info-section info-hotel-note">
      <h3>🏨 ${dict.hotelInfoTitle}</h3>
      <p>${dict.hotelInfoText}</p>
      <p><em>${dict.hotelInfoNote}</em></p>
    </div>
  `;
}

function renderHotelInfoBlock() {
  const content = document.querySelector(".info-content");
  const dict = translations[currentLang] || translations.it;

  if (!content) {
    return;
  }

  content.querySelector(".info-hotel-note")?.remove();

  if (getUrlFlag("hotel")) {
    content.insertAdjacentHTML("afterbegin", buildHotelInfoBlock(dict));
  }
}

function startCountdown() {
  updateCountdown();

  if (countdownInterval) {
    return;
  }

  countdownInterval = window.setInterval(updateCountdown, 60000);
}

function hideAllMainScreens() {
  const screens = ["door-intro", "language-screen", "home-screen"];

  screens.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add("hidden");
      el.style.opacity = "";
      el.style.visibility = "";
      el.style.pointerEvents = "";
    }
  });

  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.add("hidden");
  });
}

function applyTranslations(lang) {
  const dict = translations[lang] || translations.it;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");

    if (!key || !(key in dict)) {
      return;
    }

    const value = String(dict[key]);

    el.innerHTML = value.includes("<") ? value : value.replace(/\n/g, "<br>");
  });

  document.documentElement.lang = lang === "ua" ? "uk" : lang;
  renderHotelInfoBlock();
  updateDynamicLabels(lang);
  updateCountdown();
}

function stopLanguageRotation() {
  if (langInterval) {
    clearInterval(langInterval);
    langInterval = null;
  }
}

function startLanguageRotation() {
  const el = document.getElementById("language-rotator");

  if (!el) {
    return;
  }

  stopLanguageRotation();

  langIndex = 0;
  el.textContent = languageTitles[langIndex];

  langInterval = setInterval(() => {
    langIndex = (langIndex + 1) % languageTitles.length;
    el.textContent = languageTitles[langIndex];
  }, 2000);
}

function showLanguageScreen() {
  hideAllMainScreens();

  const languageScreen = document.getElementById("language-screen");
  const languageBox = document.getElementById("language-box");

  if (languageScreen) {
    languageScreen.classList.remove("language-over-door");
    languageScreen.classList.remove("hidden");
    languageScreen.style.display = "flex";
    languageScreen.style.opacity = "1";
    languageScreen.style.visibility = "visible";
    languageScreen.style.pointerEvents = "auto";
  }

  if (languageBox) {
    languageBox.style.display = "flex";
    languageBox.style.opacity = "1";
    languageBox.style.visibility = "visible";
    languageBox.style.pointerEvents = "auto";
  }

  startLanguageRotation();
}

function showLanguageScreenOverDoor() {
  const intro = document.getElementById("door-intro");
  const languageScreen = document.getElementById("language-screen");
  const languageBox = document.getElementById("language-box");

  document.getElementById("home-screen")?.classList.add("hidden");
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.add("hidden");
  });

  if (languageScreen) {
    languageScreen.classList.remove("hidden");
    languageScreen.classList.add("language-over-door");
    languageScreen.style.display = "flex";
    languageScreen.style.opacity = "1";
    languageScreen.style.visibility = "visible";
    languageScreen.style.pointerEvents = "auto";
  }

  if (languageBox) {
    languageBox.style.display = "flex";
    languageBox.style.opacity = "";
    languageBox.style.visibility = "visible";
    languageBox.style.pointerEvents = "auto";
  }

  startLanguageRotation();
}

function enterInvitation() {
  showLanguageScreen();
}

function finishIntroAfterVideo() {
  const urlLang = getUrlLanguage();

  if (urlLang) {
    setLanguage(urlLang);
    return;
  }

  showLanguageScreenOverDoor();
}

function playDoorVideoThenLanguage() {
  const intro = document.getElementById("door-intro");
  const video = document.getElementById("door-video");
  let didAdvance = false;

  if (!video) {
    finishIntroAfterVideo();
    return;
  }

  if (intro) {
    intro.classList.add("video-playing");
  }

  try {
    video.currentTime = 0;
  } catch (error) {
    console.warn("Impossibile riavviare il video:", error);
  }

  const finishIntro = () => {
    if (didAdvance) {
      return;
    }

    didAdvance = true;
    finishIntroAfterVideo();
  };

  const fallbackTimer = setTimeout(finishIntro, 4500);

  video.onended = () => {
    clearTimeout(fallbackTimer);
    finishIntro();
  };

  video.onerror = () => {
    clearTimeout(fallbackTimer);
    finishIntro();
  };

  const playPromise = video.play();

  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {
      clearTimeout(fallbackTimer);
      finishIntro();
    });
  }
}

function playDoorVideo() {
  playDoorVideoThenLanguage();
}

function setLanguage(lang) {
  currentLang = translations[lang] ? lang : "it";

  try {
    localStorage.setItem("wedding_lang", currentLang);
  } catch (error) {
    console.warn("LocalStorage non disponibile:", error);
  }

  stopLanguageRotation();
  applyTranslations(currentLang);

  const img = document.querySelector(".home-luxury-bg img");

  const imageMap = {
    it: "assets/new_home-luxury-it.png?v=home-ceremony1",
    en: "assets/new_home-luxury-en.png?v=home-ceremony1",
    ua: "assets/new_home-luxury-ua.png?v=home-ceremony1"
  };

  if (img) {
    img.src = imageMap[currentLang] || imageMap.it;
  }

  hideAllMainScreens();

  const homeScreen = document.getElementById("home-screen");

  if (homeScreen) {
    homeScreen.classList.remove("hidden");
    homeScreen.style.visibility = "visible";
    homeScreen.style.opacity = "1";
    homeScreen.style.pointerEvents = "auto";
  }
}

function forceOpenHome(lang) {
  setLanguage(lang);
}

function revealSection(sectionId) {
  stopLanguageRotation();

  const section = document.getElementById(sectionId);

  if (!section) {
    return;
  }

  applyTranslations(currentLang);
  hideAllMainScreens();

  section.classList.remove("hidden");
}

function getSectionNoticeType(sectionId) {
  if (sectionId === "rsvp") {
    return "kids";
  }

  if (sectionId === "gift") {
    return "travel";
  }

  return null;
}

function shouldShowGuestNotice(type) {
  return Boolean(type && getUrlFlag(type) && !guestNoticesShown[type]);
}

function openSection(sectionId) {
  const noticeType = getSectionNoticeType(sectionId);

  if (shouldShowGuestNotice(noticeType)) {
    pendingNoticeSection = sectionId;
    showGuestNotice(noticeType);
    return;
  }

  revealSection(sectionId);
}

function goBack() {
  hideAllMainScreens();

  const homeScreen = document.getElementById("home-screen");

  if (homeScreen) {
    homeScreen.classList.remove("hidden");
    homeScreen.style.visibility = "visible";
    homeScreen.style.opacity = "1";
    homeScreen.style.pointerEvents = "auto";
  }

  applyTranslations(currentLang);
}

function goBackToLanguage() {
  showLanguageScreen();
}

function goBackToIntro() {
  stopLanguageRotation();
  hideAllMainScreens();

  const intro = document.getElementById("door-intro");
  const video = document.getElementById("door-video");

  if (video) {
    video.pause();

    try {
      video.currentTime = 0;
    } catch (error) {
      console.warn("Impossibile riavviare il video:", error);
    }
  }

  if (intro) {
    intro.classList.remove("hidden", "video-playing");
  }
}

function changeLanguage() {
  showLanguageScreen();
}

function copyIBAN() {
  const ibanEl = document.getElementById("iban");
  const dict = translations[currentLang] || translations.it;

  if (!ibanEl) {
    return;
  }

  const iban = ibanEl.textContent.trim();

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(iban)
      .then(() => alert(dict.ibanCopied))
      .catch(() => copyIBANWithFallback(iban, dict));
    return;
  }

  copyIBANWithFallback(iban, dict);
}

function copyIBANWithFallback(iban, dict) {
  const field = document.createElement("textarea");

  field.value = iban;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.top = "-999px";
  document.body.appendChild(field);
  field.select();

  try {
    const copied = document.execCommand("copy");
    alert(copied ? dict.ibanCopied : dict.ibanManual + ": " + iban);
  } catch (error) {
    alert(dict.ibanManual + ": " + iban);
  } finally {
    field.remove();
  }
}

function openCeremonyMap() {
  openExternal("https://maps.app.goo.gl/bbaEuzwVKs98JcAu7");
}

function toggleParking() {
  const list = document.getElementById("parking-list");
  const arrow = document.getElementById("parking-arrow");

  if (!list || !arrow) {
    return;
  }

  list.classList.toggle("hidden");
  arrow.textContent = list.classList.contains("hidden") ? "⌄" : "⌃";
  updateDynamicLabels(currentLang);
}

function openParkingMap(number) {
  const links = {
    1: "https://maps.app.goo.gl/exuddjALBbtdyYV59",
    2: "https://maps.app.goo.gl/oVoGKFF5gi2VfXUD9",
    3: "https://maps.app.goo.gl/HiJgw4G2VcMLMoN39"
  };

  if (links[number]) {
    openExternal(links[number]);
  }
}

function openReceptionMap() {
  openExternal("https://maps.app.goo.gl/MndmF91rFPerUNNG8");
}

function openReceptionWebsite() {
  openExternal("https://masseriacaselli.com");
}

function openRSVPForm() {
  const params = new URLSearchParams(window.location.search);
  const guestId = params.get("id") || "";
  const guestName = params.get("name") || "";

  const forms = {
    it: "https://docs.google.com/forms/d/e/1FAIpQLSd2VCUIDgx9LT_F0jKWmE-qm7iR1UezJVx_v3oFQ0vgfxeeDA/viewform?usp=pp_url",
    en: "https://docs.google.com/forms/d/e/1FAIpQLSePVgFsz5NEMmOjaWuxpHfRU_Dbqk3haET_sGX6CawsuLmw/viewform?usp=pp_url",
    ua: "https://docs.google.com/forms/d/e/1FAIpQLScn4ou6qSuys8rm2XhG1-4YHf39MABAqq2xT9-qvf43z7Blhw/viewform?usp=pp_url"
  };
  const guestIdEntries = {
    it: "entry.1068143621",
    en: "entry.713027640",
    ua: "entry.1801443565"
  };
  const guestNameEntries = {
    it: "entry.1353548956",
    en: "entry.1430923838",
    ua: "entry.455151247"
  };

  const base = forms[currentLang] || forms.it;
  const guestIdEntry = guestIdEntries[currentLang] || guestIdEntries.it;
  const guestNameEntry = guestNameEntries[currentLang] || guestNameEntries.it;

  const url = new URL(base);

  if (guestId) {
    url.searchParams.set(guestIdEntry, guestId);
  }

  if (guestName) {
    url.searchParams.set(guestNameEntry, guestName);
  }

  openExternal(url.toString());
}

function confirmRSVP() {
  const modal = document.getElementById("rsvp-modal");

  applyTranslations(currentLang);

  if (shouldShowGuestNotice("kids")) {
    pendingNoticeCallback = confirmRSVP;
    showGuestNotice("kids");
    return;
  }

  if (modal) {
    modal.classList.remove("hidden");
  }
}

function closeRSVPModal() {
  document.getElementById("rsvp-modal")?.classList.add("hidden");
}

function buildNoticeBlock(title, text) {
  return `
    <section class="guest-notice-block">
      <h3>${title}</h3>
      <p>${text}</p>
    </section>
  `;
}

function showGuestNotice(type) {
  const modal = document.getElementById("guest-notice-modal");
  const content = document.getElementById("guest-notice-content");
  const dict = translations[currentLang] || translations.it;

  if (!modal || !content || guestNoticesShown[type]) {
    return;
  }

  if (type === "kids") {
    content.innerHTML = buildNoticeBlock(dict.adultOnlyNoticeTitle, dict.adultOnlyNoticeText);
  } else if (type === "travel") {
    content.innerHTML = buildNoticeBlock(dict.travelNoticeTitle, dict.travelNoticeText);
  } else {
    return;
  }

  applyTranslations(currentLang);
  modal.classList.remove("hidden");
  guestNoticesShown[type] = true;
}

function closeGuestNotice() {
  document.getElementById("guest-notice-modal")?.classList.add("hidden");

  if (pendingNoticeSection) {
    const sectionId = pendingNoticeSection;
    pendingNoticeSection = null;
    revealSection(sectionId);
  }

  if (pendingNoticeCallback) {
    const callback = pendingNoticeCallback;
    pendingNoticeCallback = null;
    callback();
  }
}

function continueRSVP() {
  closeRSVPModal();
  openRSVPForm();
}

function openPhotosUpload() {
  openExternal("https://www.dropbox.com/request/m84qjpml4iolvosgwgit");
}

function restoreSavedLanguage() {
  const urlLang = getUrlLanguage();

  currentLang = urlLang && translations[urlLang] ? urlLang : "it";
  applyTranslations(currentLang);
}

window.addEventListener("load", () => {
  restoreSavedLanguage();
  startCountdown();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeRSVPModal();
  }
});
