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
const RSVP_API_URL = "https://script.google.com/macros/s/AKfycbwMdjpcsLNimIq_zLiO9nErI5FsbQPJVVQ3SZCI33B4374UFtUMFEArFiyttfulmC8R/exec";
const RSVP_API_PLACEHOLDER = "INSERIRE_QUI_URL_WEB_APP";
const BORGO_MARESCA_URL = "https://www.perledipuglia.it/index.php?filtro_ricerca=&ricerca=borgo+maresca&ricerca_display=borgo+maresca&data_range=&pax=2&Itemid=328&id_immobile=3448&option=com_ricerca&lang=it&task=dettaglioNew&id_immobile=3448&imm_x_pag=48&executingsearch=1";
const BORGO_MARESCA_INFO_MESSAGE = "Hi Fabio, I am interested in Borgo Maresca and would like to receive more information about dates and costs.";
let rsvpSubmitting = false;

const giftPaymentDetails = [
  "Euro",
  "",
  "Beneficiario",
  "Fabio Greco",
  "",
  "IBAN",
  "IT37 Y036 6901 6003 9916 4289 231",
  "",
  "Codice BIC/SWIFT",
  "REVOITM2",
  "",
  "Nome e sede della banca",
  "Revolut Bank UAB",
  "Via Dante 7, 20123, Milano (MI), Italy",
  "",
  "Causale",
  "REGALO NOZZE INNA E FABIO"
].join("\n");

const accommodationIban = "IT37 Y036 6901 6003 9916 4289 231";
const accommodationBeneficiary = "Fabio Greco";
const accommodationWhatsappNumber = "393505397166";
const lodgingVillaOptions = {
  citta: {
    name: "Villa Città Bianca",
    total: 1339.96,
    baseGuests: 8,
    baseNights: 3,
    capacity: 8,
    bookingUrl: "https://www.booking.com/hotel/it/villa-citta-bianca.it.html",
    mapUrl: "https://maps.app.goo.gl/t7SGLpMz17vHr8Pw6"
  },
  trullo: {
    name: "Villa Trullo Ulivo",
    total: 1113.58,
    baseGuests: 8,
    baseNights: 3,
    capacity: 8,
    bookingUrl: "https://www.booking.com/hotel/it/villa-trullo-ulivo.it.html",
    mapUrl: "https://maps.app.goo.gl/t7SGLpMz17vHr8Pw6"
  }
};

function shouldShowForeignWeddingDayContact() {
  const invitationLang = getUrlLanguage();
  return invitationLang === "en" || invitationLang === "ua";
}

function getUsefulContactsCopy(lang) {
  const copies = {
    it: {
      openWhatsapp: "WhatsApp",
      masseriaInfo: "Per informazioni riguardanti il ricevimento.",
      robertoInfo: "Il giorno del matrimonio, per non stressare lo sposo, potete contattare Roberto solo in caso di necessità.",
      emergencyTitle: "Emergenze",
      emergencyName: "Numero Unico di Emergenza",
      emergencyInfo: "Attivo 24 ore su 24 per assistenza sanitaria, forze dell'ordine e vigili del fuoco."
    },
    en: {
      openWhatsapp: "WhatsApp",
      masseriaInfo: "For information about the reception.",
      robertoInfo: "On the wedding day, to avoid stressing the groom, please contact Roberto only if necessary.",
      emergencyTitle: "Emergencies",
      emergencyName: "Single Emergency Number",
      emergencyInfo: "Available 24 hours a day for medical assistance, law enforcement and fire brigade."
    },
    ua: {
      openWhatsapp: "WhatsApp",
      masseriaInfo: "Для інформації щодо святкового прийому.",
      robertoInfo: "У день весілля, щоб не турбувати нареченого, будь ласка, звертайтеся до Roberto лише у разі потреби.",
      emergencyTitle: "Екстрені служби",
      emergencyName: "Єдиний номер екстреної допомоги",
      emergencyInfo: "Працює цілодобово для медичної допомоги, поліції та пожежної служби."
    }
  };

  return copies[lang] || copies.it;
}
const lodgingCopyByLang = {};

const languageTitles = [
  "Scegli la lingua",
  "Choose your language",
  "Оберіть мову"
];

const rsvpFormCopies = {
  it: {
    kicker: "RSVP",
    title: "Conferma la tua presenza",
    intro: "Aiutaci a organizzare al meglio la giornata confermando chi sarà con noi.",
    guestNameLabel: "Invitato",
    attendanceLabel: "Parteciperai?",
    attendanceYes: "Sì, parteciperò",
    attendanceNo: "No, non potrò esserci",
    totalLabel: "Numero dei partecipanti (compreso tu)",
    adultsLabel: "Adulti",
    childrenLabel: "Bambini",
    participantNamesLabel: "Nomi accompagnatori",
    participantNamesPlaceholder: "Es. Principessa Sissi",
    childrenAgesLabel: "Nome ed età dei bambini",
    childrenAgesPlaceholder: "Es. Francesco - 7 anni",
    dietaryLabel: "Preferenze alimentari",
    dietaryPlaceholder: "Es. Mario preferirebbe il secondo di carne",
    allergiesLabel: "Allergie, Intolleranze",
    allergiesPlaceholder: "Es. Lattosio, Coriandolo",
    borgoInfoRequestLabel: "Vorrei maggiori informazioni su Villa Borgo Maresca",
    messageLabel: "Vuoi lasciare un messaggio agli sposi?",
    messagePlaceholder: "La tua risposta",
    privacyLabel: "Acconsento all'uso dei dati per la gestione dell'evento.",
    privacyInfoButtonLabel: "Leggi informativa privacy",
    privacyInfoTitle: "Informativa privacy",
    privacyInfoText: "Informativa privacy: i dati personali forniti tramite questo modulo saranno utilizzati esclusivamente per la gestione dell'evento Inna & Fabio, incluse conferme di partecipazione, esigenze alimentari, alloggio, transfer e comunicazioni organizzative. Il titolare del trattamento è Fabio Greco. I dati saranno conservati solo per il tempo necessario all'organizzazione e allo svolgimento dell'evento e saranno cancellati al termine dello stesso, salvo eventuali obblighi di legge.",
    privacyInfoClose: "Chiudi",
    cancel: "Annulla",
    submit: "Invia RSVP",
    submitting: "Invio in corso...",
    edit: "Modifica RSVP",
    home: "Torna alla home",
    successKicker: "RSVP registrato",
    successTitle: "Grazie, risposta ricevuta",
    absenceSuccessMessage: "Ci dispiace non averti con noi, ma grazie per averci avvisato.",
    successNote: "Puoi modificare la risposta riaprendo questo modulo dallo stesso invito.",
    alreadySent: "Hai già inviato una risposta. Puoi modificarla e salvarla di nuovo.",
    missingGuestId: "Link RSVP non valido: manca il codice invitato. Apri il link personale ricevuto dagli sposi.",
    setupMissing: "Il collegamento RSVP non è ancora configurato. Inserisci l'URL della Web App in RSVP_API_URL.",
    networkError: "Non riesco a inviare la risposta. Controlla la connessione e riprova.",
    validationRequiredAttendance: "Scegli se parteciperai o no.",
    validationPrivacy: "Per inviare l'RSVP devi accettare l'informativa privacy.",
    validationNumbers: "Controlla numero partecipanti, adulti e bambini.",
    validationNames: "Inserisci i nomi degli accompagnatori.",
    validationHtml: "I campi di testo non possono contenere codice HTML.",
    summaryGuest: "Invitato",
    summaryAttendance: "Presenza",
    summaryPeople: "Partecipanti",
    summaryAdultsChildren: "Adulti / bambini",
    summaryNames: "Nomi",
    summaryDietary: "Esigenze alimentari",
    summaryBorgo: "Borgo Maresca",
    summaryMessage: "Messaggio",
    yesLabel: "Sì",
    noLabel: "No",
    noneLabel: "Nessuna indicazione"
  },
  en: {
    kicker: "RSVP",
    title: "Confirm your attendance",
    intro: "Help us organise the day in the best possible way by confirming who will be with us.",
    guestNameLabel: "Guest",
    attendanceLabel: "Will you attend?",
    attendanceYes: "Yes, I will attend",
    attendanceNo: "No, I cannot attend",
    totalLabel: "Number of guests (including yourself)",
    adultsLabel: "Adults",
    childrenLabel: "Children",
    participantNamesLabel: "Names of accompanying guests",
    participantNamesPlaceholder: "E.g. Princess Sissi",
    childrenAgesLabel: "Children's names and ages",
    childrenAgesPlaceholder: "E.g. Francesco - 7 years old",
    dietaryLabel: "Dietary preferences",
    dietaryPlaceholder: "E.g. Mario would prefer the meat main course",
    allergiesLabel: "Allergies, intolerances",
    allergiesPlaceholder: "E.g. coriander, lactose",
    borgoInfoRequestLabel: "I would like more information about Villa Borgo Maresca",
    messageLabel: "Would you like to leave a message for the couple?",
    messagePlaceholder: "Your answer",
    privacyLabel: "I agree that my data may be used to manage the event.",
    privacyInfoButtonLabel: "Read the privacy notice",
    privacyInfoTitle: "Privacy notice",
    privacyInfoText: "Privacy notice: personal data submitted through this form will be used exclusively to manage the Inna & Fabio event, including attendance confirmations, dietary needs, accommodation, transfer and organisational communications. The data controller is Fabio Greco. Data will be kept only for the time necessary to organise and hold the event and will be deleted afterwards, except where legal obligations apply.",
    privacyInfoClose: "Close",
    cancel: "Cancel",
    submit: "Send RSVP",
    submitting: "Sending...",
    edit: "Edit RSVP",
    home: "Back to home",
    successKicker: "RSVP saved",
    successTitle: "Thank you, your reply has been received",
    absenceSuccessMessage: "We're sorry you won't be with us, but thank you for letting us know.",
    successNote: "You can edit your reply by opening this form again from the same invitation.",
    alreadySent: "You have already sent a reply. You can edit it and save it again.",
    missingGuestId: "Invalid RSVP link: the guest code is missing. Please open your personal invitation link.",
    setupMissing: "The RSVP connection is not configured yet. Add the Web App URL to RSVP_API_URL.",
    networkError: "We could not send your reply. Please check your connection and try again.",
    validationRequiredAttendance: "Please choose whether you will attend.",
    validationPrivacy: "Please accept the privacy notice before sending the RSVP.",
    validationNumbers: "Please check the number of guests, adults and children.",
    validationNames: "Please enter the names of the guests accompanying you.",
    validationHtml: "Text fields cannot contain HTML code.",
    summaryGuest: "Guest",
    summaryAttendance: "Attendance",
    summaryPeople: "Guests",
    summaryAdultsChildren: "Adults / children",
    summaryNames: "Names",
    summaryDietary: "Dietary needs",
    summaryBorgo: "Borgo Maresca",
    summaryMessage: "Message",
    yesLabel: "Yes",
    noLabel: "No",
    noneLabel: "No details"
  },
  ua: {
    kicker: "RSVP",
    title: "Підтвердіть участь",
    intro: "Допоможіть нам найкраще організувати день, підтвердивши, хто буде з нами.",
    guestNameLabel: "Гість",
    attendanceLabel: "Ви будете присутні?",
    attendanceYes: "Так, я буду",
    attendanceNo: "Ні, я не зможу бути",
    totalLabel: "Кількість гостей (включно з вами)",
    adultsLabel: "Дорослі",
    childrenLabel: "Діти",
    participantNamesLabel: "Імена супроводжуючих гостей",
    participantNamesPlaceholder: "Напр. Princess Sissi",
    childrenAgesLabel: "Імена та вік дітей",
    childrenAgesPlaceholder: "Напр. Francesco - 7 років",
    dietaryLabel: "Харчові побажання",
    dietaryPlaceholder: "Напр. Mario віддав би перевагу м'ясній основній страві",
    allergiesLabel: "Алергії, непереносимості",
    allergiesPlaceholder: "Напр. коріандр, лактоза",
    borgoInfoRequestLabel: "Я хотів/хотіла б отримати більше інформації про Villa Borgo Maresca",
    messageLabel: "Бажаєте залишити повідомлення молодятам?",
    messagePlaceholder: "Ваша відповідь",
    privacyLabel: "Я погоджуюсь на використання моїх даних для організації події.",
    privacyInfoButtonLabel: "Прочитати повідомлення про приватність",
    privacyInfoTitle: "Повідомлення про приватність",
    privacyInfoText: "Повідомлення про приватність: персональні дані, надані через цю форму, використовуватимуться виключно для організації події Inna & Fabio, включаючи підтвердження участі, харчові потреби, проживання, трансфер та організаційні повідомлення. Відповідальний за обробку даних: Fabio Greco. Дані зберігатимуться лише протягом часу, необхідного для організації та проведення події, і після цього будуть видалені, крім випадків, передбачених законом.",
    privacyInfoClose: "Закрити",
    cancel: "Скасувати",
    submit: "Надіслати RSVP",
    submitting: "Надсилання...",
    edit: "Змінити RSVP",
    home: "На головну",
    successKicker: "RSVP збережено",
    successTitle: "Дякуємо, вашу відповідь отримано",
    absenceSuccessMessage: "Нам шкода, що вас не буде з нами, але дякуємо, що повідомили нас.",
    successNote: "Ви можете змінити відповідь, знову відкривши цю форму із запрошення.",
    alreadySent: "Ви вже надсилали відповідь. Ви можете змінити її та зберегти ще раз.",
    missingGuestId: "Недійсне посилання RSVP: відсутній код гостя. Відкрийте ваше персональне посилання.",
    setupMissing: "З'єднання RSVP ще не налаштовано. Додайте URL Web App у RSVP_API_URL.",
    networkError: "Не вдалося надіслати відповідь. Перевірте з'єднання та спробуйте ще раз.",
    validationRequiredAttendance: "Оберіть, чи будете ви присутні.",
    validationPrivacy: "Потрібно прийняти повідомлення про приватність перед надсиланням.",
    validationNumbers: "Перевірте кількість гостей, дорослих і дітей.",
    validationNames: "Введіть імена гостей, які будуть з вами.",
    validationHtml: "Текстові поля не можуть містити HTML-код.",
    summaryGuest: "Гість",
    summaryAttendance: "Присутність",
    summaryPeople: "Гості",
    summaryAdultsChildren: "Дорослі / діти",
    summaryNames: "Імена",
    summaryDietary: "Харчові потреби",
    summaryBorgo: "Borgo Maresca",
    summaryMessage: "Повідомлення",
    yesLabel: "Так",
    noLabel: "Ні",
    noneLabel: "Немає деталей"
  }
};

function buildTaxiInfoContent(copy) {
  return `
    <div class="transport-info-list">
      <section class="transport-info-item">
        <img class="transport-info-icon transport-info-icon-taxi" src="assets/icons/taxi.png?v=2" alt="">
        <div>
          <h4>${copy.title}</h4>
          <p>${copy.text}</p>
          <p><a href="https://brindisiintaxi.it" target="_blank" rel="noopener noreferrer">brindisiintaxi.it</a></p>
          <p><a href="tel:0831031">0831031</a></p>
        </div>
      </section>
    </div>
  `;
}

function buildUsefulContactsContent(copy) {
  const robertoCard = shouldShowForeignWeddingDayContact() ? `
      <section class="useful-contact-card">
        <div class="contact-heading">
          <span aria-hidden="true">🛟</span>
          <h4>Roberto</h4>
        </div>
        <p>${copy.robertoInfo}</p>
        <a class="useful-phone" href="tel:+393496533356">+39 349 653 3356</a>
        <a class="whatsapp-link" ${whatsappLinkAttrs("393496533356")} target="_blank" rel="noopener noreferrer">${copy.openWhatsapp}</a>
        <p class="contact-languages">🇬🇧 English</p>
      </section>
  ` : "";

  return `
    <div class="useful-contact-list">
      <section class="useful-contact-card">
        <div class="contact-heading">
          <span aria-hidden="true">👰</span>
          <h4>Inna</h4>
        </div>
        <a class="useful-phone" href="tel:+96891493079">+968 91493079</a>
        <a class="whatsapp-link" ${whatsappLinkAttrs("96891493079")} target="_blank" rel="noopener noreferrer">${copy.openWhatsapp}</a>
        <p class="contact-languages">🇮🇹 Italiano • 🇬🇧 English • 🇺🇦 Українська • 🇪🇸 Español</p>
      </section>

      <section class="useful-contact-card">
        <div class="contact-heading">
          <span aria-hidden="true">🤵</span>
          <h4>Fabio</h4>
        </div>
        <a class="useful-phone" href="tel:+393505397166">+39 350 5397166</a>
        <a class="whatsapp-link" ${whatsappLinkAttrs("393505397166")} target="_blank" rel="noopener noreferrer">${copy.openWhatsapp}</a>
        <p class="contact-languages">🇮🇹 Italiano • 🇬🇧 English</p>
      </section>

      <section class="useful-contact-card">
        <div class="contact-heading">
          <span aria-hidden="true">🏛️</span>
          <h4>Masseria Caselli</h4>
        </div>
        <p>${copy.masseriaInfo}</p>
        <a class="useful-phone" href="tel:+393453133848">+39 345 313 3848</a>
        <a class="whatsapp-link" ${whatsappLinkAttrs("393453133848")} target="_blank" rel="noopener noreferrer">${copy.openWhatsapp}</a>
        <p class="contact-languages">🇮🇹 Italiano • 🇬🇧 English</p>
      </section>

      ${robertoCard}

      <section class="useful-contact-card emergency-contact">
        <div class="contact-heading">
          <span aria-hidden="true">🚨</span>
          <h4>${copy.emergencyTitle}</h4>
        </div>
        <a class="useful-phone emergency-number" href="tel:112">112</a>
        <p class="emergency-name"><strong>${copy.emergencyName}</strong></p>
        <p class="emergency-info">${copy.emergencyInfo}</p>
      </section>
    </div>
  `;
}

function buildTransportInfoContent(copy) {
  return `
    <div class="transport-info-list">
      <section class="transport-info-item">
        <img class="transport-info-icon" src="assets/icons/aereo.png?v=1" alt="">
        <div>
          <h4>${copy.airTitle}</h4>
          <ul class="transport-main-list">
            <li>${copy.brindisiAirport}</li>
            <li>
              ${copy.bariAirport}
              <ul>
                <li>${copy.bariCar}</li>
                <li>${copy.bariTrain}</li>
                <li>${copy.bariBus}</li>
              </ul>
            </li>
          </ul>
          <p class="transport-note">${copy.flightNote}</p>
        </div>
      </section>

      <section class="transport-info-item">
        <img class="transport-info-icon" src="assets/icons/auto.png?v=1" alt="">
        <div>
          <h4>${copy.carTitle}</h4>
          <ul class="transport-main-list">
            <li>${copy.carFromBari}</li>
            <li>${copy.carRental}</li>
            <li>${copy.carParkingPayment}</li>
          </ul>
        </div>
      </section>

      <section class="transport-info-item">
        <img class="transport-info-icon" src="assets/icons/treno.png?v=1" alt="">
        <div>
          <h4>${copy.trainTitle}</h4>
          <ul class="transport-main-list">
            <li>${copy.trainArrival}</li>
          </ul>
        </div>
      </section>

      <section class="transport-info-item">
        <img class="transport-info-icon transport-info-icon-taxi" src="assets/icons/taxi.png?v=2" alt="">
        <div>
          <h4>${copy.taxiTitle}</h4>
          <p>${copy.taxiText}</p>
          <p><a href="https://brindisiintaxi.it" target="_blank" rel="noopener noreferrer">brindisiintaxi.it</a></p>
          <p><a href="tel:0831031">0831031</a></p>
        </div>
      </section>
    </div>
  `;
}

function buildLodgingInfoContent(copy) {
  if (copy.lang) {
    lodgingCopyByLang[copy.lang] = copy;
  }

  return `
    <div class="lodging-info-list">
      <section class="lodging-info-item">
        <h4>${copy.bbTitle}</h4>
        <p>${copy.bbText}</p>
        <p>${copy.bbRecommendation}</p>
      </section>

      <section class="lodging-info-item lodging-borgo-item">
        <h4>${copy.borgoTitle}</h4>
        <p>${copy.borgoText}</p>
        <div class="lodging-borgo-actions">
          <a href="${BORGO_MARESCA_URL}" target="_blank" rel="noopener noreferrer">${copy.borgoLinkLabel}</a>
          <a ${whatsappLinkAttrs(accommodationWhatsappNumber, BORGO_MARESCA_INFO_MESSAGE)} target="_blank" rel="noopener noreferrer">${copy.borgoWhatsappLabel}</a>
        </div>
      </section>

      <section class="lodging-info-item">
        <h4>${copy.villaTitle}</h4>
        <p>${copy.villaText}</p>
        <p>${copy.villaArea}</p>
      </section>

      <section class="lodging-info-item">
        <h4>${copy.hotelTitle}</h4>
        <p>${copy.hotelIntro}</p>
        <ul>
          <li><a href="https://www.albergointernazionale.it" target="_blank" rel="noopener noreferrer"><strong>Grand Albergo Internazionale</strong></a>, ${copy.grandHotelLocation}</li>
          <li><a href="https://www.hotelorientale.it" target="_blank" rel="noopener noreferrer"><strong>Hotel Orientale</strong></a>, ${copy.orientaleLocation}</li>
        </ul>
      </section>

      <section class="lodging-info-item">
        <h4>${copy.receptionHotelTitle}</h4>
        <p>${copy.receptionHotelText}</p>
        <p>${copy.receptionHotelBooking}</p>
      </section>

    </div>
  `;
}

function buildVillaCard(villa, copy) {
  return `
    <article class="lodging-villa-card">
      <h4>${villa.name}</h4>
      <p>${copy.capacityLabel}: <strong>${villa.capacity}</strong></p>
      <div class="lodging-villa-actions">
        <a href="${villa.bookingUrl}" target="_blank" rel="noopener noreferrer">${copy.bookingLabel}</a>
        <a href="${villa.mapUrl}" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">⌖</span> ${copy.mapLabel}</a>
      </div>
    </article>
  `;
}

function getLodgingCopy() {
  return lodgingCopyByLang[currentLang] || lodgingCopyByLang.it || {};
}

function buildProgramInfoContent(copy) {
  return `
    <div class="program-info-list">
      <p class="program-update-note">${copy.updateNote}</p>

      <section class="program-day">
        <div class="program-date">
          <span>02</span>
          <small>${copy.friday}</small>
        </div>
        <div class="program-events">
          <article class="program-event">
            <time>18:00</time>
            <p>${copy.fridayParty}</p>
          </article>
        </div>
      </section>

      <section class="program-day">
        <div class="program-date">
          <span>03</span>
          <small>${copy.saturday}</small>
        </div>
        <div class="program-events">
          <article class="program-event">
            <time>16:00</time>
            <p>${copy.groomBoat}</p>
          </article>
          <article class="program-event">
            <time>16:30</time>
            <p>${copy.brideChurch}</p>
          </article>
          <article class="program-event">
            <time>17:30</time>
            <p>${copy.ceremonyEnd}</p>
          </article>
          <article class="program-event">
            <time>18:30</time>
            <p>${copy.receptionArrival}</p>
          </article>
          <article class="program-event">
            <time>00:00</time>
            <p>${copy.cakeCutting}</p>
          </article>
        </div>
      </section>

      <section class="program-day">
        <div class="program-date">
          <span>04</span>
          <small>${copy.sunday}</small>
        </div>
        <div class="program-events">
          <article class="program-event program-event-soft">
            <time>${copy.lunchTime}</time>
            <p>${copy.sundayLunch}</p>
          </article>
        </div>
      </section>
    </div>
  `;
}

const translations = {
  it: {
    weddingInvitation: "WEDDING INVITATION",
    doorOpenLabel: "ENTRA",
    doorIntroLine: "Se sei giunto fin qui, allora sei pronto a varcare la soglia del nostro giorno più bello",
    ceremony: "Cerimonia",
    reception: "Ricevimento",
    rsvp: "Conferma",
    info: "Info",
    photos: "Foto",
    gift: "Pensiero",
    back: "Indietro",

    ceremonyPlace: "Cattedrale di San Giovanni Battista",
    ceremonyAddress: "Via Duomo, 12\n72100 Brindisi (BR), Italia",
    ceremonyTime: "Ore 16:30",
    openMap: "Apri su Google Maps",

    parkingTitle: "Parcheggi consigliati",
    parkingNear: "Parcheggio vicino",
    parkingEasy: "Parcheggio comodo",
    parkingAlt: "Alternativa",
    parkingWalk2: "2 min a piedi",
    parkingWalk5: "5 min a piedi",
    parkingWalk10: "7 min a piedi",
    openSmall: "Apri",

    receptionPlace: "Masseria Caselli",
    receptionAddress: "Contrada Caselli\n72012 Carovigno (BR), Italia",
    receptionTime: "",
    openWebsite: "Sito web",
    countdownKicker: "Mancano",
    countdownDays: "giorni",
    countdownHours: "ore",
    countdownMinutes: "min",
    countdownToday: "Oggi",

    rsvpTitle: "RSVP",
    rsvpText: "Conferma la tua presenza entro il 15 agosto",
    rsvpButton: "Conferma partecipazione",
    changeLanguage: "Cambia lingua",
    restartInvitation: "Torna all'inizio",
    confirmRedirect: "Verrai reindirizzato al modulo di conferma.",
    rsvpModalTitle: "Conferma RSVP",
    rsvpModalText: "Stai per aprire il modulo di conferma partecipazione.",
    guestNoticeTitle: "Una nota per te",
    guestNoticeButton: "Ho letto",
    adultOnlyNoticeTitle: "",
    adultOnlyNoticeText: "Amiamo i vostri bambini, ma per questo giorno speciale speriamo possiate godervi insieme a noi una festa serena tra adulti. Se non fosse possibile organizzarvi diversamente, non preoccupatevi: i vostri piccoli saranno sempre accolti con affetto. Vi ringraziamo per la comprensione e non vediamo l'ora di festeggiare insieme.",
    travelNoticeTitle: "La vostra presenza è già un dono",
    travelNoticeText: "Avervi accanto dopo un viaggio così importante è già il dono più prezioso. La vostra presenza vale più di qualsiasi regalo.",
    cancel: "Annulla",
    continueToForm: "Apri modulo",

    infoIntro: "Scegli le informazioni che vuoi consultare",
    infoTransportTitle: "Trasporti",
    infoTransportContent: `
      <div class="transport-info-list">
        <section class="transport-info-item">
          <img class="transport-info-icon" src="assets/icons/aereo.png?v=1" alt="">
          <div>
            <h4>Aereo</h4>
            <ul class="transport-main-list">
              <li>Aeroporto del Salento di Brindisi</li>
              <li>
                Aeroporto Karol Wojtyla di Bari
                <ul>
                  <li>Auto: noleggio presso l'aeroporto</li>
                  <li>Treno con <a href="https://www.trenitalia.com" target="_blank" rel="noopener noreferrer">Trenitalia</a>, destinazione Brindisi, con scalo alla stazione di Bari Centrale</li>
                  <li>Autobus con <a href="https://shop.marozzivt.it" target="_blank" rel="noopener noreferrer">Marozzi</a>, tratta Aeroporto Bari - Aeroporto Brindisi</li>
                </ul>
              </li>
            </ul>
            <p class="transport-note">Consigliamo l'app/website <a href="https://www.skyscanner.it" target="_blank" rel="noopener noreferrer">Skyscanner</a> per monitorare e prenotare i voli.</p>
          </div>
        </section>

        <section class="transport-info-item">
          <img class="transport-info-icon" src="assets/icons/auto.png?v=1" alt="">
          <div>
            <h4>Auto</h4>
            <ul class="transport-main-list">
              <li>Da Aeroporto Bari circa 1h 20' percorrendo la SS16, circa 130 km</li>
              <li>Per il noleggio a Brindisi: <a href="https://pugliandgo.com/it/" target="_blank" rel="noopener noreferrer">Puglia and Go!</a></li>
              <li>Per il pagamento dei parcheggi: <a href="https://www.easypark.com/en-it" target="_blank" rel="noopener noreferrer">EasyPark</a></li>
            </ul>
          </div>
        </section>

        <section class="transport-info-item">
          <img class="transport-info-icon" src="assets/icons/treno.png?v=1" alt="">
          <div>
            <h4>Treno</h4>
            <ul class="transport-main-list">
              <li>Stazione di arrivo Brindisi con <a href="https://www.trenitalia.com" target="_blank" rel="noopener noreferrer">Trenitalia</a></li>
            </ul>
          </div>
        </section>

        <section class="transport-info-item">
          <img class="transport-info-icon transport-info-icon-taxi" src="assets/icons/taxi.png?v=2" alt="">
          <div>
            <h4>Taxi</h4>
            <p>Per spostamenti in taxi a Brindisi potete consultare il sito o contattare direttamente il servizio.</p>
            <p><a href="https://brindisiintaxi.it" target="_blank" rel="noopener noreferrer">brindisiintaxi.it</a></p>
            <p><a href="tel:0831031">0831031</a></p>
          </div>
        </section>
      </div>
    `,
    infoHotelTitle: "Alloggio",
    infoHotelContent: buildLodgingInfoContent({
      lang: "it",
      bbTitle: "B&B a Brindisi",
      bbText: "Brindisi è piena di B&B molto carini e curati, che si possono trovare facilmente su <a href=\"https://www.booking.com\" target=\"_blank\" rel=\"noopener noreferrer\">Booking.com</a>.",
      bbRecommendation: "Da consigliare <a href=\"https://versorientebeb.it\" target=\"_blank\" rel=\"noopener noreferrer\"><strong>Verso Oriente</strong></a>, dove la sposa alloggerà la notte prima della cerimonia.",
      hotelTitle: "Hotel",
      hotelIntro: "Gli hotel sono molto pochi. Gli unici da prendere in considerazione sono:",
      grandHotelLocation: "ubicato sul lungomare",
      orientaleLocation: "ubicato su Corso Garibaldi",
      receptionHotelTitle: "Hotel della sala ricevimento",
      receptionHotelText: "C'è la possibilità di alloggiare, salvo disponibilità, anche nell'hotel della sala ricevimento.",
      receptionHotelBooking: "Per prenotare, consultare il sito nella sezione <strong>Ricevimento</strong>.",
      borgoTitle: "Villa Borgo Maresca",
      borgoText: `Abbiamo prenotato <a href="${BORGO_MARESCA_URL}" target="_blank" rel="noopener noreferrer"><strong>Villa Borgo Maresca</strong></a>, con 5 camere matrimoniali. Chi desidera maggiori dettagli può richiedere informazioni a Fabio.`,
      borgoLinkLabel: "Vedi la villa",
      borgoWhatsappLabel: "Chiedi info a Fabio",
      villaTitle: "Villa vicino al ricevimento",
      villaText: "Altra possibilità è prenotare una villa con 4+ stanze vicino alla sala ricevimento.",
      villaArea: "L'area da cercare su <a href=\"https://www.booking.com\" target=\"_blank\" rel=\"noopener noreferrer\">Booking.com</a> è <strong>Specchiolla</strong>.",
      mainTitle: "Hai bisogno di un alloggio?",
      mainText: "Se hai difficoltà a trovare una sistemazione, abbiamo bloccato per i nostri ospiti due ville situate una di fronte all'altra e a pochi minuti dalla sala del ricevimento.",
      compareText: "Puoi visualizzare entrambe le strutture, confrontare i prezzi e scegliere quella che preferisci, fino a esaurimento dei posti disponibili.",
      capacityLabel: "Capienza massima",
      bookingLabel: "Booking",
      mapLabel: "Mappa",
      calculatorTitle: "Calcola il costo del soggiorno",
      villaLabel: "Scegli la villa",
      arrivalLabel: "Data di arrivo",
      departureLabel: "Data di partenza",
      peopleLabel: "Quante persone",
      dateOct2: "2 ottobre 2026",
      dateOct3: "3 ottobre 2026",
      dateOct4: "4 ottobre 2026",
      dateOct5: "5 ottobre 2026",
      priceNote: "Il totale si aggiorna automaticamente in base alla villa, alle date e al numero di persone selezionate. La richiesta non blocca automaticamente il posto: la disponibilità sarà verificata da Fabio e la prenotazione sarà confermata solo dopo la sua risposta e il pagamento.",
      acceptButton: "Accetta la proposta",
      paymentTitle: "Invia la richiesta a Fabio",
      paymentText: "Fabio verificherà la disponibilità della villa scelta e, se ci sono posti, ti risponderà su WhatsApp con le istruzioni per il pagamento.",
      beneficiaryLabel: "Intestatario",
      reasonLabel: "Causale",
      copyIban: "Copia IBAN",
      copyReason: "Copia causale",
      requestNoticeButton: "Invia richiesta su WhatsApp",
      paymentNoticeButton: "Ho effettuato il pagamento",
      rulesTitle: "Regole",
      ruleSeats: "I posti sono limitati a 8 persone per ciascuna villa e saranno assegnati in ordine di conferma.",
      rulePayment: "La prenotazione sarà considerata definitiva solo dopo la ricezione del pagamento.",
      ruleDeadline: "In assenza di pagamento entro il 30 agosto 2026, la disponibilità potrà essere assegnata ad altri ospiti.",
      lodgingTotalText: "Il costo del tuo soggiorno è di {total} (totale per {people} persone, {nights} notti).",
      lodgingConfirmIntro: "Stai richiedendo la prenotazione di:",
      lodgingConfirmVilla: "Villa",
      lodgingConfirmArrival: "Arrivo",
      lodgingConfirmDeparture: "Partenza",
      lodgingConfirmNights: "Notti",
      lodgingConfirmPeople: "Persone",
      lodgingConfirmTotal: "Totale da pagare",
      lodgingConfirmName: "Nome",
      lodgingConfirmQuestion: "Confermi la richiesta?",
      lodgingWhatsappGreeting: "Ciao Fabio,",
      lodgingWhatsappAccept: "richiedo la disponibilità per questa proposta di alloggio. Attendo conferma prima di procedere con il pagamento.",
      lodgingWhatsappPaid: "ti confermo di aver effettuato il bonifico per la sistemazione.",
      lodgingWhatsappClosing: "Grazie.",
      lodgingGuestPlaceholder: "Nome e cognome",
      lodgingIbanCopied: "IBAN copiato",
      lodgingReasonCopied: "Causale copiata"
    }),
    infoProgramTitle: "Programma",
    infoProgramContent: `
      <div class="program-info-list">
        <p class="program-update-note">Per gli ultimi aggiornamenti, vi invitiamo a verificare il programma a ridosso dell'evento.</p>

        <section class="program-day">
          <div class="program-date">
            <span>02</span>
            <small>venerdì</small>
          </div>
          <div class="program-events">
            <article class="program-event">
              <time>18:00</time>
              <p>Party nel <strong>Rooftop Cielo</strong> <a class="program-map-link" href="https://maps.app.goo.gl/KvTzhpDJr6JiSXwp8" target="_blank" rel="noopener noreferrer" aria-label="Apri posizione su Google Maps">Mappa</a></p>
            </article>
          </div>
        </section>

        <section class="program-day">
          <div class="program-date">
            <span>03</span>
            <small>sabato</small>
          </div>
          <div class="program-events">
            <article class="program-event">
              <time>16:00</time>
              <p>Arrivo dello sposo in barca sul lungomare <a class="program-map-link" href="https://maps.app.goo.gl/ETmxu6J29mjw4p568" target="_blank" rel="noopener noreferrer" aria-label="Apri posizione su Google Maps">Mappa</a></p>
            </article>
            <article class="program-event">
              <time>16:30</time>
              <p>Arrivo della sposa in chiesa (spero).</p>
            </article>
            <article class="program-event">
              <time>17:30</time>
              <p>Fine della cerimonia liturgica.</p>
            </article>
            <article class="program-event">
              <time>18:30</time>
              <p>Afflusso presso <strong>Masseria Caselli</strong>.</p>
            </article>
            <article class="program-event">
              <time>00:00</time>
              <p>Taglio torta previsto.</p>
            </article>
          </div>
        </section>

        <section class="program-day">
          <div class="program-date">
            <span>04</span>
            <small>domenica</small>
          </div>
          <div class="program-events">
            <article class="program-event program-event-soft">
              <time>14:30</time>
              <p><strong>Pool Party</strong> presso Villa <a class="program-place-link" href="${BORGO_MARESCA_URL}" target="_blank" rel="noopener noreferrer"><strong>Borgo Maresca</strong></a> <a class="program-map-link" href="https://maps.app.goo.gl/m8y6TzWd2YNUVeGJ6" target="_blank" rel="noopener noreferrer" aria-label="Apri posizione su Google Maps">Mappa</a></p>
            </article>
          </div>
        </section>
      </div>
    `,
    infoDressTitle: "Dress code",
    infoDressContent: `
      <div class="dress-code-list">
        <section class="dress-code-item dress-code-intro">
          <h4>Eleganza senza eccessi</h4>
          <p>Il nostro desiderio è vedere tutti eleganti e a proprio agio.</p>
        </section>

        <section class="dress-code-item">
          <h4>Uomini</h4>
          <ul>
            <li>Abito elegante consigliato.</li>
            <li>Cravatta o papillon graditi.</li>
            <li>No jeans, polo, t-shirt o sneakers sportive.</li>
          </ul>
        </section>

        <section class="dress-code-item">
          <h4>Donne</h4>
          <ul>
            <li>Abito da cocktail o lungo.</li>
            <li>Tacchi o calzature eleganti.</li>
            <li>Evitare abiti completamente bianchi o color avorio, riservati alla sposa.</li>
          </ul>
        </section>

        <section class="dress-code-item">
          <h4>Ricevimento in Masseria</h4>
          <p>La festa si svolgerà in una suggestiva masseria pugliese, tra eleganti spazi interni e aree all'aperto. Ti consigliamo calzature che ti permettano di vivere la giornata e di ballare fino a tarda sera in totale comfort.</p>
          <p>La cena si svolgerà sotto le stelle. Nelle ore serali la temperatura potrebbe rinfrescarsi; per questo motivo consigliamo alle signore di portare uno scialle o una stola leggera, così da godersi la serata con il massimo comfort.</p>
        </section>

        <p class="dress-code-closing">L'eleganza migliore sarà il tuo sorriso.</p>
      </div>
    `,
    infoContactsTitle: "Contatti utili",
    infoContactsText: buildUsefulContactsContent(getUsefulContactsCopy("it")),
    backToInfo: "Torna alle info",

    photosTitle: "Foto",
    photosText: "Hai scattato qualche foto? 👇",
    photosButton: "Condividi i tuoi ricordi",
    photosNote: "Il caricamento sarà attivo dal 30 settembre e resterà disponibile anche dopo il matrimonio.",

    giftTitle: "Un pensiero",
    giftText: "La vostra presenza è il dono più bello. Per chi desidera lasciare un pensiero, potete farlo qui.",
    giftQrHint: "Scansiona il QR con l'app della tua banca oppure copia i dati del bonifico.",
    copyGiftDetails: "Copia dati bonifico",
    showBankDetails: "Mostra dettagli bonifico",
    bankBeneficiaryLabel: "Beneficiario",
    bankBicLabel: "Codice BIC/SWIFT",
    bankNameLabel: "Nome e sede della banca",
    bankReasonLabel: "Causale",
    copyIban: "Copia dati bonifico",
    ibanCopied: "Dati bonifico copiati",
    ibanManual: "Copia manualmente i dati del bonifico"
  },

  en: {
    weddingInvitation: "WEDDING INVITATION",
    doorOpenLabel: "OPEN",
    doorIntroLine: "If you have made it this far, you are ready to cross the threshold of our most beautiful day",
    ceremony: "Ceremony",
    reception: "Reception",
    rsvp: "RSVP",
    info: "Info",
    photos: "Photos",
    gift: "A Thought",
    back: "Back",

    ceremonyPlace: "Cathedral of Saint John the Baptist",
    ceremonyAddress: "Via Duomo, 12\n72100 Brindisi (BR), Italy",
    ceremonyTime: "Time: 16:30",
    openMap: "Open in Google Maps",

    parkingTitle: "Recommended parking",
    parkingNear: "Nearest parking",
    parkingEasy: "Easy parking",
    parkingAlt: "Alternative",
    parkingWalk2: "2 min walk",
    parkingWalk5: "5 min walk",
    parkingWalk10: "7 min walk",
    openSmall: "Open",

    receptionPlace: "Masseria Caselli",
    receptionAddress: "Contrada Caselli\n72012 Carovigno (BR), Italy",
    receptionTime: "",
    openWebsite: "Website",
    countdownKicker: "Only",
    countdownDays: "days",
    countdownHours: "hours",
    countdownMinutes: "min",
    countdownToday: "Today",

    rsvpTitle: "RSVP",
    rsvpText: "Please confirm your attendance by August 15",
    rsvpButton: "Confirm attendance",
    changeLanguage: "Change language",
    restartInvitation: "Back to the beginning",
    confirmRedirect: "You will be redirected to the RSVP form.",
    rsvpModalTitle: "Confirm RSVP",
    rsvpModalText: "You are about to open the attendance confirmation form.",
    guestNoticeTitle: "A note for you",
    guestNoticeButton: "I understand",
    adultOnlyNoticeTitle: "",
    adultOnlyNoticeText: "We love your children, but for this special day we hope you’ll enjoy a relaxing adults’ celebration with us. If making other arrangements isn’t possible, please don’t worry—your little ones will always be warmly welcomed. Thank you for your understanding, and we can’t wait to celebrate together.",
    travelNoticeTitle: "Your presence is already a gift",
    travelNoticeText: "Having you with us after such an important journey is already the most precious gift. Your presence means more than any present.",
    cancel: "Cancel",
    continueToForm: "Open form",

    infoIntro: "Choose the information you would like to view",
    infoTransportTitle: "Transport",
    infoTransportContent: buildTransportInfoContent({
      airTitle: "By air",
      brindisiAirport: "Brindisi Salento Airport",
      bariAirport: "Bari Karol Wojtyla Airport",
      bariCar: "Car: rental available at the airport",
      bariTrain: "Train with <a href=\"https://www.trenitalia.com\" target=\"_blank\" rel=\"noopener noreferrer\">Trenitalia</a> to Brindisi, changing at Bari Centrale station",
      bariBus: "Shuttle with <a href=\"https://shop.marozzivt.it\" target=\"_blank\" rel=\"noopener noreferrer\">Marozzi</a>, Bari Airport - Brindisi Airport route",
      flightNote: "We recommend the <a href=\"https://www.skyscanner.it\" target=\"_blank\" rel=\"noopener noreferrer\">Skyscanner</a> app/website to monitor and book flights.",
      carTitle: "By car",
      carFromBari: "From Bari Airport, about 1h 20' via the SS16 road, around 130 km",
      carRental: "For car rental in Brindisi: <a href=\"https://pugliandgo.com/it/\" target=\"_blank\" rel=\"noopener noreferrer\">Puglia and Go!</a>",
      carParkingPayment: "For parking payment: <a href=\"https://www.easypark.com/en-it\" target=\"_blank\" rel=\"noopener noreferrer\">EasyPark</a>",
      trainTitle: "By train",
      trainArrival: "Arrival station: Brindisi, with <a href=\"https://www.trenitalia.com\" target=\"_blank\" rel=\"noopener noreferrer\">Trenitalia</a>",
      taxiTitle: "Taxi",
      taxiText: "For taxi transfers in Brindisi, you can visit the website or contact the service directly."
    }),
    infoHotelTitle: "Accommodation",
    infoHotelContent: buildLodgingInfoContent({
      lang: "en",
      bbTitle: "B&Bs in Brindisi",
      bbText: "Brindisi has many charming and well-kept B&Bs, which can be found easily on <a href=\"https://www.booking.com\" target=\"_blank\" rel=\"noopener noreferrer\">Booking.com</a>.",
      bbRecommendation: "We recommend <a href=\"https://versorientebeb.it\" target=\"_blank\" rel=\"noopener noreferrer\"><strong>Verso Oriente</strong></a>, where the bride will stay the night before the ceremony.",
      hotelTitle: "Hotels",
      hotelIntro: "There are not many hotels. The ones to consider are:",
      grandHotelLocation: "located on the seafront",
      orientaleLocation: "located on Corso Garibaldi",
      receptionHotelTitle: "Reception venue hotel",
      receptionHotelText: "Accommodation may also be available, subject to availability, at the reception venue hotel.",
      receptionHotelBooking: "To book, please check the website in the <strong>Reception</strong> section.",
      borgoTitle: "Villa Borgo Maresca",
      borgoText: `We have reserved <a href="${BORGO_MARESCA_URL}" target="_blank" rel="noopener noreferrer"><strong>Villa Borgo Maresca</strong></a>, with 5 double bedrooms. If you would like more details, you can ask Fabio for further information.`,
      borgoLinkLabel: "View the villa",
      borgoWhatsappLabel: "Ask Fabio",
      villaTitle: "Villa near the reception",
      villaText: "Another option is to book a villa with 4+ rooms near the reception venue.",
      villaArea: "The area to search for on <a href=\"https://www.booking.com\" target=\"_blank\" rel=\"noopener noreferrer\">Booking.com</a> is <strong>Specchiolla</strong>.",
      mainTitle: "Do you need accommodation?",
      mainText: "If you are having trouble finding a place to stay, we have held two villas for our guests. They are located opposite each other and only a few minutes from the reception venue.",
      compareText: "You can view both properties, compare the prices and choose the one you prefer, subject to availability.",
      capacityLabel: "Maximum capacity",
      bookingLabel: "Booking",
      mapLabel: "Map",
      calculatorTitle: "Calculate your stay",
      villaLabel: "Choose the villa",
      arrivalLabel: "Arrival date",
      departureLabel: "Departure date",
      peopleLabel: "Number of people",
      dateOct2: "October 2, 2026",
      dateOct3: "October 3, 2026",
      dateOct4: "October 4, 2026",
      dateOct5: "October 5, 2026",
      priceNote: "The total updates automatically based on the villa, dates and number of people selected. This request does not automatically reserve a place: availability will be checked by Fabio, and the booking will be confirmed only after his reply and payment.",
      acceptButton: "Accept proposal",
      paymentTitle: "Send the request to Fabio",
      paymentText: "Fabio will check availability for the selected villa and, if there are places available, will reply on WhatsApp with the payment instructions.",
      beneficiaryLabel: "Account holder",
      reasonLabel: "Payment reference",
      copyIban: "Copy IBAN",
      copyReason: "Copy reference",
      requestNoticeButton: "Send request on WhatsApp",
      paymentNoticeButton: "I have made the payment",
      rulesTitle: "Rules",
      ruleSeats: "Places are limited to 8 people per villa and will be assigned in order of confirmation.",
      rulePayment: "The booking will be considered final only after payment has been received.",
      ruleDeadline: "If payment is not received by August 30, 2026, availability may be assigned to other guests.",
      lodgingTotalText: "The cost of your stay is {total} (total for {people} people, {nights} nights).",
      lodgingConfirmIntro: "You are requesting the booking of:",
      lodgingConfirmVilla: "Villa",
      lodgingConfirmArrival: "Arrival",
      lodgingConfirmDeparture: "Departure",
      lodgingConfirmNights: "Nights",
      lodgingConfirmPeople: "People",
      lodgingConfirmTotal: "Total to pay",
      lodgingConfirmName: "Name",
      lodgingConfirmQuestion: "Do you confirm the request?",
      lodgingWhatsappGreeting: "Hi Fabio,",
      lodgingWhatsappAccept: "I would like to request availability for this accommodation proposal. I will wait for confirmation before proceeding with payment.",
      lodgingWhatsappPaid: "I confirm that I have made the bank transfer for the accommodation.",
      lodgingWhatsappClosing: "Thank you.",
      lodgingGuestPlaceholder: "Full name",
      lodgingIbanCopied: "IBAN copied",
      lodgingReasonCopied: "Payment reference copied"
    }),
    infoProgramTitle: "Schedule",
    infoProgramContent: buildProgramInfoContent({
      updateNote: "For the latest updates, please check the schedule again close to the event.",
      friday: "Friday",
      fridayParty: "Party at <strong>Rooftop Cielo</strong> <a class=\"program-map-link\" href=\"https://maps.app.goo.gl/KvTzhpDJr6JiSXwp8\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"Open location in Google Maps\">Map</a>",
      saturday: "Saturday",
      groomBoat: "The groom arrives by boat on the seafront <a class=\"program-map-link\" href=\"https://maps.app.goo.gl/ETmxu6J29mjw4p568\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"Open location in Google Maps\">Map</a>",
      brideChurch: "Bride's arrival at the church (hopefully).",
      ceremonyEnd: "End of the liturgical ceremony.",
      receptionArrival: "Arrival at <strong>Masseria Caselli</strong>.",
      cakeCutting: "Expected cake cutting.",
      sunday: "Sunday",
      lunchTime: "14:30",
      sundayLunch: `Pool Party at Villa <a class="program-place-link" href="${BORGO_MARESCA_URL}" target="_blank" rel="noopener noreferrer"><strong>Borgo Maresca</strong></a> <a class="program-map-link" href="https://maps.app.goo.gl/m8y6TzWd2YNUVeGJ6" target="_blank" rel="noopener noreferrer" aria-label="Open location in Google Maps">Map</a>`
    }),
    infoDressTitle: "Dress code",
    infoDressContent: `
      <div class="dress-code-list">
        <section class="dress-code-item dress-code-intro">
          <h4>Elegance without excess</h4>
          <p>Our wish is to see everyone elegant and completely at ease.</p>
        </section>

        <section class="dress-code-item">
          <h4>Men</h4>
          <ul>
            <li>Elegant suit recommended.</li>
            <li>Tie or bow tie appreciated.</li>
            <li>No jeans, polo shirts, t-shirts or sporty sneakers.</li>
          </ul>
        </section>

        <section class="dress-code-item">
          <h4>Women</h4>
          <ul>
            <li>Cocktail or long dress.</li>
            <li>Heels or elegant shoes.</li>
            <li>Please avoid fully white or ivory dresses, as these colours are reserved for the bride.</li>
          </ul>
        </section>

        <section class="dress-code-item">
          <h4>Reception at the Masseria</h4>
          <p>The celebration will take place in a beautiful Apulian masseria, with elegant indoor spaces and outdoor areas. We recommend footwear that will let you enjoy the day and dance until late in total comfort.</p>
          <p>Dinner will be held under the stars. In the evening, the temperature may become cooler; for this reason, we suggest that ladies bring a shawl or a light stole, so they can enjoy the evening with maximum comfort.</p>
        </section>

        <p class="dress-code-closing">The finest elegance will be your smile.</p>
      </div>
    `,
    infoContactsTitle: "Useful contacts",
    infoContactsText: buildUsefulContactsContent(getUsefulContactsCopy("en")),
    backToInfo: "Back to info",

    photosTitle: "Photos",
    photosText: "Did you take some photos? 👇",
    photosButton: "Share your memories",
    photosNote: "Uploads will be active from September 30 and will remain available after the wedding.",

    giftTitle: "A Thought",
    giftText: "Your presence is the greatest gift. If you wish to leave a thoughtful gesture, you can do it here.",
    giftQrHint: "Scan the QR code with your banking app, or copy the bank transfer details.",
    copyGiftDetails: "Copy transfer details",
    showBankDetails: "Show bank details",
    bankBeneficiaryLabel: "Beneficiary",
    bankBicLabel: "BIC/SWIFT code",
    bankNameLabel: "Bank name and address",
    bankReasonLabel: "Payment reference",
    copyIban: "Copy transfer details",
    ibanCopied: "Transfer details copied",
    ibanManual: "Copy the transfer details manually"
  },

  ua: {
    weddingInvitation: "WEDDING INVITATION",
    doorOpenLabel: "ВІДКРИТИ",
    doorIntroLine: "Якщо ти дійшов сюди, то готовий переступити поріг нашого найпрекраснішого дня",
    ceremony: "Церемонія",
    reception: "Святкування",
    rsvp: "Підтвердження",
    info: "Інфо",
    photos: "Фото",
    gift: "Знак уваги",
    back: "Назад",

    ceremonyPlace: "Кафедральний собор Святого Іоанна Хрестителя",
    ceremonyAddress: "Via Duomo, 12\n72100 Brindisi (BR), Італія",
    ceremonyTime: "Час: 16:30",
    openMap: "Відкрити в Google Maps",

    parkingTitle: "Рекомендовані парковки",
    parkingNear: "Найближча парковка",
    parkingEasy: "Зручна парковка",
    parkingAlt: "Альтернатива",
    parkingWalk2: "2 хв пішки",
    parkingWalk5: "5 хв пішки",
    parkingWalk10: "7 хв пішки",
    openSmall: "Відкрити",

    receptionPlace: "Masseria Caselli",
    receptionAddress: "Contrada Caselli\n72012 Carovigno (BR), Італія",
    receptionTime: "",
    openWebsite: "Сайт",
    countdownKicker: "Залишилось",
    countdownDays: "днів",
    countdownHours: "год",
    countdownMinutes: "хв",
    countdownToday: "Сьогодні",

    rsvpTitle: "Підтвердження",
    rsvpText: "Підтвердіть свою присутність до 15 серпня",
    rsvpButton: "Підтвердити участь",
    changeLanguage: "Змінити мову",
    restartInvitation: "Повернутися на початок",
    confirmRedirect: "Вас буде перенаправлено до форми підтвердження.",
    rsvpModalTitle: "Підтвердження RSVP",
    rsvpModalText: "Зараз відкриється форма підтвердження участі.",
    guestNoticeTitle: "Важлива примітка",
    guestNoticeButton: "Я прочитав/прочитала",
    adultOnlyNoticeTitle: "",
    adultOnlyNoticeText: "Ми дуже любимо ваших дітей, але в цей особливий день сподіваємося, що ви зможете насолодитися разом із нами спокійним святкуванням для дорослих. Якщо не вдасться організувати догляд за дітьми, будь ласка, не хвилюйтеся — ваші малюки завжди будуть тепло прийняті. Дякуємо за розуміння і з нетерпінням чекаємо на спільне святкування.",
    travelNoticeTitle: "Ваша присутність уже є подарунком",
    travelNoticeText: "Мати вас поруч після такої важливої подорожі — це вже найцінніший подарунок. Ваша присутність для нас важить більше за будь-який подарунок.",
    cancel: "Скасувати",
    continueToForm: "Відкрити форму",

    infoIntro: "Оберіть інформацію, яку хочете переглянути",
    infoTransportTitle: "Транспорт",
    infoTransportContent: buildTransportInfoContent({
      airTitle: "Літак",
      brindisiAirport: "Аеропорт Salento у Бріндізі",
      bariAirport: "Аеропорт Karol Wojtyla у Барі",
      bariCar: "Авто: оренда доступна в аеропорту",
      bariTrain: "Потяг <a href=\"https://www.trenitalia.com\" target=\"_blank\" rel=\"noopener noreferrer\">Trenitalia</a> до Бріндізі з пересадкою на станції Bari Centrale",
      bariBus: "Автобус <a href=\"https://shop.marozzivt.it\" target=\"_blank\" rel=\"noopener noreferrer\">Marozzi</a>, маршрут Аеропорт Барі - Аеропорт Бріндізі",
      flightNote: "Радимо користуватися додатком/сайтом <a href=\"https://www.skyscanner.it\" target=\"_blank\" rel=\"noopener noreferrer\">Skyscanner</a>, щоб відстежувати та бронювати авіаквитки.",
      carTitle: "Авто",
      carFromBari: "З аеропорту Барі приблизно 1 год 20 хв дорогою SS16, близько 130 км",
      carRental: "Для оренди авто в Бріндізі: <a href=\"https://pugliandgo.com/it/\" target=\"_blank\" rel=\"noopener noreferrer\">Puglia and Go!</a>",
      carParkingPayment: "Для оплати паркування: <a href=\"https://www.easypark.com/en-it\" target=\"_blank\" rel=\"noopener noreferrer\">EasyPark</a>",
      trainTitle: "Потяг",
      trainArrival: "Станція прибуття: Бріндізі, з <a href=\"https://www.trenitalia.com\" target=\"_blank\" rel=\"noopener noreferrer\">Trenitalia</a>",
      taxiTitle: "Таксі",
      taxiText: "Для поїздок на таксі у Бріндізі можна відвідати сайт або зв'язатися зі службою напряму."
    }),
    infoHotelTitle: "Проживання",
    infoHotelContent: buildLodgingInfoContent({
      lang: "ua",
      bbTitle: "B&B у Бріндізі",
      bbText: "У Бріндізі є багато затишних і доглянутих B&B, які легко знайти на <a href=\"https://www.booking.com\" target=\"_blank\" rel=\"noopener noreferrer\">Booking.com</a>.",
      bbRecommendation: "Радимо <a href=\"https://versorientebeb.it\" target=\"_blank\" rel=\"noopener noreferrer\"><strong>Verso Oriente</strong></a>, де наречена ночуватиме перед церемонією.",
      hotelTitle: "Готелі",
      hotelIntro: "Готелів небагато. Варто розглянути:",
      grandHotelLocation: "розташований на набережній",
      orientaleLocation: "розташований на Corso Garibaldi",
      receptionHotelTitle: "Готель при місці прийому",
      receptionHotelText: "Також може бути можливість проживання, за наявності місць, у готелі при місці святкування.",
      receptionHotelBooking: "Для бронювання перегляньте сайт у розділі <strong>Святкування</strong>.",
      borgoTitle: "Villa Borgo Maresca",
      borgoText: `Ми зарезервували <a href="${BORGO_MARESCA_URL}" target="_blank" rel="noopener noreferrer"><strong>Villa Borgo Maresca</strong></a> з 5 двомісними спальнями. Якщо вам потрібні додаткові деталі, ви можете звернутися до Fabio.`,
      borgoLinkLabel: "Переглянути віллу",
      borgoWhatsappLabel: "Запитати Fabio",
      villaTitle: "Вілла біля місця святкування",
      villaText: "Інший варіант — забронювати віллу з 4+ кімнатами неподалік від місця святкування.",
      villaArea: "Район для пошуку на <a href=\"https://www.booking.com\" target=\"_blank\" rel=\"noopener noreferrer\">Booking.com</a>: <strong>Specchiolla</strong>.",
      mainTitle: "Потрібне проживання?",
      mainText: "Якщо вам складно знайти житло, ми зарезервували для гостей дві вілли. Вони розташовані одна навпроти одної та за кілька хвилин від місця святкування.",
      compareText: "Ви можете переглянути обидва варіанти, порівняти ціни та вибрати той, який вам більше підходить, за наявності місць.",
      capacityLabel: "Максимальна місткість",
      bookingLabel: "Booking",
      mapLabel: "Мапа",
      calculatorTitle: "Розрахувати вартість проживання",
      villaLabel: "Оберіть віллу",
      arrivalLabel: "Дата заїзду",
      departureLabel: "Дата виїзду",
      peopleLabel: "Кількість людей",
      dateOct2: "2 жовтня 2026",
      dateOct3: "3 жовтня 2026",
      dateOct4: "4 жовтня 2026",
      dateOct5: "5 жовтня 2026",
      priceNote: "Загальна сума автоматично оновлюється залежно від обраної вілли, дат і кількості людей. Цей запит не резервує місце автоматично: наявність місць перевірить Fabio, а бронювання буде підтверджено лише після його відповіді та оплати.",
      acceptButton: "Прийняти пропозицію",
      paymentTitle: "Надіслати запит Fabio",
      paymentText: "Fabio перевірить наявність місць на обраній віллі і, якщо місця будуть доступні, відповість у WhatsApp з інструкціями для оплати.",
      beneficiaryLabel: "Отримувач",
      reasonLabel: "Призначення платежу",
      copyIban: "Копіювати IBAN",
      copyReason: "Копіювати призначення",
      requestNoticeButton: "Надіслати запит у WhatsApp",
      paymentNoticeButton: "Я здійснив/здійснила оплату",
      rulesTitle: "Правила",
      ruleSeats: "Кількість місць обмежена до 8 осіб на кожній віллі та розподіляється в порядку підтвердження.",
      rulePayment: "Бронювання вважається остаточним лише після отримання оплати.",
      ruleDeadline: "Якщо оплату не буде отримано до 30 серпня 2026 року, місце може бути запропоноване іншим гостям.",
      lodgingTotalText: "Вартість вашого проживання: {total} (разом для {people} осіб, {nights} ночей).",
      lodgingConfirmIntro: "Ви надсилаєте запит на бронювання:",
      lodgingConfirmVilla: "Вілла",
      lodgingConfirmArrival: "Заїзд",
      lodgingConfirmDeparture: "Виїзд",
      lodgingConfirmNights: "Ночі",
      lodgingConfirmPeople: "Люди",
      lodgingConfirmTotal: "Сума до оплати",
      lodgingConfirmName: "Ім’я",
      lodgingConfirmQuestion: "Підтверджуєте запит?",
      lodgingWhatsappGreeting: "Привіт, Fabio,",
      lodgingWhatsappAccept: "я хочу надіслати запит на наявність місць для цієї пропозиції проживання. Я чекатиму підтвердження перед оплатою.",
      lodgingWhatsappPaid: "підтверджую, що здійснив/здійснила банківський переказ за проживання.",
      lodgingWhatsappClosing: "Дякую.",
      lodgingGuestPlaceholder: "Ім’я та прізвище",
      lodgingIbanCopied: "IBAN скопійовано",
      lodgingReasonCopied: "Призначення платежу скопійовано"
    }),
    infoProgramTitle: "Програма",
    infoProgramContent: buildProgramInfoContent({
      updateNote: "Для останніх оновлень радимо перевірити програму ближче до події.",
      friday: "п'ятниця",
      fridayParty: "Вечірка у <strong>Rooftop Cielo</strong> <a class=\"program-map-link\" href=\"https://maps.app.goo.gl/KvTzhpDJr6JiSXwp8\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"Відкрити локацію в Google Maps\">Мапа</a>",
      saturday: "субота",
      groomBoat: "Наречений прибуває на човні на набережній <a class=\"program-map-link\" href=\"https://maps.app.goo.gl/ETmxu6J29mjw4p568\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"Відкрити локацію в Google Maps\">Мапа</a>",
      brideChurch: "Прибуття нареченої до церкви (сподіваємося).",
      ceremonyEnd: "Завершення літургійної церемонії.",
      receptionArrival: "Прибуття до <strong>Masseria Caselli</strong>.",
      cakeCutting: "Орієнтовний час розрізання торта.",
      sunday: "неділя",
      lunchTime: "14:30",
      sundayLunch: `Pool Party на віллі <a class="program-place-link" href="${BORGO_MARESCA_URL}" target="_blank" rel="noopener noreferrer"><strong>Borgo Maresca</strong></a> <a class="program-map-link" href="https://maps.app.goo.gl/m8y6TzWd2YNUVeGJ6" target="_blank" rel="noopener noreferrer" aria-label="Відкрити локацію в Google Maps">Мапа</a>`
    }),
    infoDressTitle: "Дрес-код",
    infoDressContent: `
      <div class="dress-code-list">
        <section class="dress-code-item dress-code-intro">
          <h4>Елегантність без надмірностей</h4>
          <p>Ми хочемо бачити всіх елегантними та водночас почуватися комфортно.</p>
        </section>

        <section class="dress-code-item">
          <h4>Чоловіки</h4>
          <ul>
            <li>Рекомендується елегантний костюм.</li>
            <li>Краватка або метелик вітаються.</li>
            <li>Без джинсів, поло, футболок або спортивних кросівок.</li>
          </ul>
        </section>

        <section class="dress-code-item">
          <h4>Жінки</h4>
          <ul>
            <li>Коктейльна або довга сукня.</li>
            <li>Підбори або елегантне взуття.</li>
            <li>Просимо уникати повністю білих або кольору айворі суконь, адже ці кольори призначені для нареченої.</li>
          </ul>
        </section>

        <section class="dress-code-item">
          <h4>Святкування в Masseria</h4>
          <p>Святкування відбудеться в атмосферній апулійській masseria, серед елегантних внутрішніх просторів і відкритих зон. Радимо обрати взуття, у якому вам буде зручно провести день і танцювати до пізнього вечора.</p>
          <p>Вечеря проходитиме під зорями. У вечірні години температура може знизитися; тому радимо жінкам взяти шаль або легку накидку, щоб насолодитися вечором із максимальним комфортом.</p>
        </section>

        <p class="dress-code-closing">Найкращою елегантністю буде ваша усмішка.</p>
      </div>
    `,
    infoContactsTitle: "Корисні контакти",
    infoContactsText: buildUsefulContactsContent(getUsefulContactsCopy("ua")),
    backToInfo: "Назад до інформації",

    photosTitle: "Фото",
    photosText: "Зробили кілька фото? 👇",
    photosButton: "Поділіться спогадами",
    photosNote: "Завантаження буде активне з 30 вересня і залишиться доступним після весілля.",

    giftTitle: "Знак уваги",
    giftText: "Ваша присутність — найкращий подарунок. Якщо бажаєте залишити знак уваги, можете зробити це тут.",
    giftQrHint: "Відскануйте QR-код у банківському додатку або скопіюйте реквізити переказу.",
    copyGiftDetails: "Скопіювати реквізити",
    showBankDetails: "Показати банківські реквізити",
    bankBeneficiaryLabel: "Отримувач",
    bankBicLabel: "Код BIC/SWIFT",
    bankNameLabel: "Назва та адреса банку",
    bankReasonLabel: "Призначення платежу",
    copyIban: "Скопіювати реквізити",
    ibanCopied: "Реквізити скопійовано",
    ibanManual: "Скопіюйте реквізити вручну"
  }
};

function openExternal(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function cleanWhatsAppPhone(phone) {
  return String(phone || "").replace(/\D/g, "");
}

function makeWhatsAppWebUrl(phone, message = "") {
  const digits = cleanWhatsAppPhone(phone);
  const encoded = encodeURIComponent(message);
  const suffix = message ? `?text=${encoded}` : "";
  return digits ? `https://wa.me/${digits}${suffix}` : `https://wa.me/${suffix}`;
}

function makeWhatsAppAppUrl(phone, message = "") {
  const digits = cleanWhatsAppPhone(phone);
  const encoded = encodeURIComponent(message);
  const query = new URLSearchParams();
  if (digits) query.set("phone", digits);
  if (message) query.set("text", message);
  return `whatsapp://send${query.toString() ? `?${query.toString()}` : ""}`;
}

function whatsappLinkAttrs(phone, message = "") {
  return `href="${makeWhatsAppWebUrl(phone, message)}"`;
}

function openWhatsAppLink(event, link) {
  event.preventDefault();
  const appUrl = link.getAttribute("href");
  const webUrl = link.dataset.whatsappWebUrl;
  const openedAt = Date.now();
  window.location.href = appUrl;
  window.setTimeout(() => {
    if (document.visibilityState === "visible" && document.hasFocus() && Date.now() - openedAt < 1800) {
      openExternal(webUrl);
    }
  }, 900);
}

function openWhatsApp(phone, message = "") {
  openExternal(makeWhatsAppWebUrl(phone, message));
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

  const doorTap = document.querySelector(".door-video-tap");

  if (doorTap && dict.doorOpenLabel) {
    doorTap.textContent = dict.doorOpenLabel;
    doorTap.setAttribute("data-label", dict.doorOpenLabel);
  }

  document.documentElement.lang = lang === "ua" ? "uk" : lang;
  updateDynamicLabels(lang);
  updateCountdown();
  updateAccommodationQuote();
}

function closeInfoSubsection() {
  document.getElementById("info-menu")?.classList.remove("hidden");
  document.querySelectorAll(".info-subpanel").forEach((panel) => {
    panel.classList.add("hidden");
  });
}

function openInfoSubsection(panelName) {
  const target = document.querySelector(`[data-info-panel="${panelName}"]`);

  if (!target) {
    return;
  }

  document.getElementById("info-menu")?.classList.add("hidden");
  document.querySelectorAll(".info-subpanel").forEach((panel) => {
    panel.classList.toggle("hidden", panel !== target);
  });

  if (panelName === "contacts") {
    const contactsContent = target.querySelector('[data-i18n="infoContactsText"]');
    if (contactsContent) {
      contactsContent.innerHTML = buildUsefulContactsContent(getUsefulContactsCopy(currentLang));
    }
  }

  if (panelName === "hotel") {
    updateAccommodationQuote();
  }
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

  if (sectionId === "info") {
    closeInfoSubsection();
  }
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

function getAccommodationQuote() {
  const villaSelect = document.getElementById("lodging-villa");
  const arrivalSelect = document.getElementById("lodging-arrival");
  const departureSelect = document.getElementById("lodging-departure");
  const guestsInput = document.getElementById("lodging-guests");

  if (!villaSelect || !arrivalSelect || !departureSelect || !guestsInput) {
    return null;
  }

  let arrival = arrivalSelect.value;
  let departure = departureSelect.value;

  if (new Date(departure) <= new Date(arrival)) {
    const nextDeparture = Array.from(departureSelect.options).find((option) => new Date(option.value) > new Date(arrival));

    if (nextDeparture) {
      departureSelect.value = nextDeparture.value;
      departure = nextDeparture.value;
    }
  }

  const villa = lodgingVillaOptions[villaSelect.value] || lodgingVillaOptions.citta;
  const guests = Math.min(villa.capacity, Math.max(1, Number.parseInt(guestsInput.value, 10) || 1));
  guestsInput.value = guests;

  const nights = Math.max(1, Math.round((new Date(departure) - new Date(arrival)) / 86400000));
  const pricePerPersonPerNight = villa.total / villa.baseGuests / villa.baseNights;
  const total = pricePerPersonPerNight * guests * nights;

  return {
    villa,
    guests,
    arrival,
    departure,
    nights,
    total
  };
}

function formatAccommodationCurrency(value) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR"
  }).format(value);
}

function formatAccommodationDate(value) {
  const date = new Date(value);
  const labels = {
    "2026-10-02": {
      it: "2 ottobre 2026",
      en: "October 2, 2026",
      ua: "2 жовтня 2026"
    },
    "2026-10-03": {
      it: "3 ottobre 2026",
      en: "October 3, 2026",
      ua: "3 жовтня 2026"
    },
    "2026-10-04": {
      it: "4 ottobre 2026",
      en: "October 4, 2026",
      ua: "4 жовтня 2026"
    },
    "2026-10-05": {
      it: "5 ottobre 2026",
      en: "October 5, 2026",
      ua: "5 жовтня 2026"
    }
  };

  return labels[value]?.[currentLang] || date.toLocaleDateString("it-IT");
}

function accommodationPaymentReason(quote) {
  const params = new URLSearchParams(window.location.search);
  const guestName = params.get("guestName") || params.get("name") || "";
  const cleanGuest = guestName ? guestName.replace(/\+/g, " ").trim() : "";
  const namePart = cleanGuest || getLodgingCopy().lodgingGuestPlaceholder || "";

  return `Alloggio matrimonio - ${namePart} - ${quote.villa.name}`;
}

function updateAccommodationQuote() {
  const quote = getAccommodationQuote();
  const totalEl = document.getElementById("lodging-total");
  const reasonEl = document.getElementById("lodging-payment-reason");
  const dict = getLodgingCopy();

  if (!quote || !totalEl || !dict.lodgingTotalText) {
    return;
  }

  totalEl.textContent = dict.lodgingTotalText
    .replace("{total}", formatAccommodationCurrency(quote.total))
    .replace("{people}", quote.guests)
    .replace("{nights}", quote.nights);

  if (reasonEl) {
    reasonEl.textContent = accommodationPaymentReason(quote);
  }
}

function acceptAccommodationProposal() {
  const quote = getAccommodationQuote();
  const dict = getLodgingCopy();

  if (!quote || !dict.lodgingConfirmIntro) {
    return;
  }

  const details = [
    dict.lodgingConfirmIntro,
    "",
    `${dict.lodgingConfirmVilla}: ${quote.villa.name}`,
    `${dict.lodgingConfirmArrival}: ${formatAccommodationDate(quote.arrival)}`,
    `${dict.lodgingConfirmDeparture}: ${formatAccommodationDate(quote.departure)}`,
    `${dict.lodgingConfirmNights}: ${quote.nights}`,
    `${dict.lodgingConfirmPeople}: ${quote.guests}`,
    `${dict.lodgingConfirmTotal}: ${formatAccommodationCurrency(quote.total)}`,
    "",
    dict.lodgingConfirmQuestion
  ].join("\n");

  if (!window.confirm(details)) {
    return;
  }

  document.getElementById("lodging-payment")?.classList.remove("hidden");
  updateAccommodationQuote();
}

function accommodationWhatsappMessage(quote, dict, paid = false) {
  const params = new URLSearchParams(window.location.search);
  const guestName = (params.get("guestName") || params.get("name") || "").replace(/\+/g, " ").trim();
  const lines = [
    dict.lodgingWhatsappGreeting,
    "",
    paid ? dict.lodgingWhatsappPaid : dict.lodgingWhatsappAccept,
    "",
    `${dict.lodgingConfirmName}: ${guestName || dict.lodgingGuestPlaceholder}`,
    `${dict.lodgingConfirmVilla}: ${quote.villa.name}`,
    `${dict.lodgingConfirmArrival}: ${formatAccommodationDate(quote.arrival)}`,
    `${dict.lodgingConfirmDeparture}: ${formatAccommodationDate(quote.departure)}`,
    `${dict.lodgingConfirmNights}: ${quote.nights}`,
    `${dict.lodgingConfirmPeople}: ${quote.guests}`,
    `${dict.lodgingConfirmTotal}: ${formatAccommodationCurrency(quote.total)}`,
    "",
    dict.lodgingWhatsappClosing
  ];

  return lines.join("\n");
}

function copyTextWithMessage(value, message) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(value).then(() => alert(message)).catch(() => {
      window.prompt(message, value);
    });
    return;
  }

  window.prompt(message, value);
}

function copyAccommodationIban() {
  const dict = getLodgingCopy();
  copyTextWithMessage(accommodationIban, dict.lodgingIbanCopied || "IBAN copiato");
}

function copyAccommodationReason() {
  const quote = getAccommodationQuote();
  const dict = getLodgingCopy();

  if (!quote) {
    return;
  }

  copyTextWithMessage(accommodationPaymentReason(quote), dict.lodgingReasonCopied || "Causale copiata");
}

function sendAccommodationRequestNotice() {
  const quote = getAccommodationQuote();
  const dict = getLodgingCopy();

  if (!quote || !dict.lodgingWhatsappGreeting) {
    return;
  }

  openWhatsApp(accommodationWhatsappNumber, accommodationWhatsappMessage(quote, dict));
}

function sendAccommodationPaymentNotice() {
  const quote = getAccommodationQuote();
  const dict = getLodgingCopy();

  if (!quote || !dict.lodgingWhatsappGreeting) {
    return;
  }

  openWhatsApp(accommodationWhatsappNumber, accommodationWhatsappMessage(quote, dict, true));
}

function copyIBAN() {
  const dict = translations[currentLang] || translations.it;
  const details = giftPaymentDetails;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(details)
      .then(() => alert(dict.ibanCopied))
      .catch(() => copyIBANWithFallback(details, dict));
    return;
  }

  copyIBANWithFallback(details, dict);
}

function copyIBANWithFallback(details, dict) {
  const field = document.createElement("textarea");

  field.value = details;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.top = "-999px";
  document.body.appendChild(field);
  field.select();

  try {
    const copied = document.execCommand("copy");
    alert(copied ? dict.ibanCopied : dict.ibanManual + ":\n" + details);
  } catch (error) {
    alert(dict.ibanManual + ":\n" + details);
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
  openInternalRSVP();
}

function getInvitationParams() {
  const query = new URLSearchParams(window.location.search);
  return {
    guestId: (query.get("guestId") || query.get("id") || "").trim(),
    guestName: (query.get("guestName") || query.get("name") || "").replace(/\+/g, " ").trim(),
    lang: query.get("lang") || currentLang,
    travel: query.get("travel") === "1"
  };
}

function getRsvpCopy() {
  return rsvpFormCopies[currentLang] || rsvpFormCopies.it;
}

function sanitizeRSVPText(value, maxLength = 500) {
  return String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

function hasHtmlLikeText(value) {
  return /<\s*\/?\s*[a-z][^>]*>/i.test(String(value || "")) || /javascript\s*:/i.test(String(value || ""));
}

function rsvpApiConfigured() {
  return Boolean(RSVP_API_URL && RSVP_API_URL !== RSVP_API_PLACEHOLDER);
}

function rsvpMockMode() {
  try {
    return new URLSearchParams(window.location.search).get("rsvpMock") === "1";
  } catch (error) {
    return false;
  }
}

function rsvpMockKey(guestId) {
  return `wedding_rsvp_mock_${guestId}`;
}

function applyRSVPFormTexts() {
  const copy = getRsvpCopy();
  document.querySelectorAll("[data-rsvp-text]").forEach((el) => {
    const key = el.getAttribute("data-rsvp-text");
    if (copy[key]) el.textContent = copy[key];
  });
  document.querySelectorAll("[data-rsvp-option]").forEach((el) => {
    const key = el.getAttribute("data-rsvp-option");
    if (copy[key]) el.textContent = copy[key];
  });
  document.querySelectorAll("[data-rsvp-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-rsvp-placeholder");
    if (copy[key]) el.setAttribute("placeholder", copy[key]);
  });
  document.querySelectorAll("[data-rsvp-aria]").forEach((el) => {
    const key = el.getAttribute("data-rsvp-aria");
    if (copy[key]) el.setAttribute("aria-label", copy[key]);
  });
  document.getElementById("rsvp-form-close")?.setAttribute("aria-label", copy.cancel);
}

function showRSVPError(message) {
  const errorEl = document.getElementById("rsvp-form-error");
  if (!errorEl) return;
  errorEl.textContent = message;
  errorEl.classList.toggle("hidden", !message);
}

function showRSVPExistingStatus(message) {
  const statusEl = document.getElementById("rsvp-existing-status");
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.classList.toggle("hidden", !message);
}

function setRSVPSubmitState(isSubmitting) {
  rsvpSubmitting = isSubmitting;
  const button = document.getElementById("rsvp-submit-button");
  const copy = getRsvpCopy();
  if (!button) return;
  button.disabled = isSubmitting;
  button.textContent = isSubmitting ? copy.submitting : copy.submit;
}

function setRSVPDetailsEnabled(enabled) {
  const details = document.querySelector("[data-rsvp-details]");
  if (!details) return;
  details.classList.toggle("rsvp-details-disabled", !enabled);
  details.querySelectorAll("input, select, textarea").forEach((field) => {
    field.disabled = !enabled;
  });
}

function syncRSVPAttendanceFields() {
  const form = document.getElementById("rsvp-internal-form");
  if (!form) return;
  const attending = form.elements.attendance.value === "yes";
  const invitation = getInvitationParams();
  const borgoField = document.querySelector("[data-rsvp-borgo-field]");
  setRSVPDetailsEnabled(attending);
  borgoField?.classList.toggle("hidden", !(attending && invitation.travel));
  if (!attending) {
    form.elements.participantsTotal.value = "0";
    form.elements.adults.value = "0";
    form.elements.children.value = "0";
    if (form.elements.borgoInfoRequest) form.elements.borgoInfoRequest.checked = false;
  } else {
    if (Number(form.elements.participantsTotal.value) < 1) form.elements.participantsTotal.value = "1";
    if (Number(form.elements.adults.value) < 1) form.elements.adults.value = "1";
  }
}

function readRSVPForm() {
  const form = document.getElementById("rsvp-internal-form");
  const invitation = getInvitationParams();
  const attendance = form.elements.attendance.value;
  const participantsTotal = Number.parseInt(form.elements.participantsTotal.value, 10);
  const adults = Number.parseInt(form.elements.adults.value, 10);
  const children = Number.parseInt(form.elements.children.value, 10);

  return {
    guestId: sanitizeRSVPText(invitation.guestId, 80),
    guestName: sanitizeRSVPText(form.elements.guestName.value || invitation.guestName, 160),
    attendance,
    participantsTotal: Number.isFinite(participantsTotal) ? participantsTotal : 0,
    adults: Number.isFinite(adults) ? adults : 0,
    children: Number.isFinite(children) ? children : 0,
    participantNames: sanitizeRSVPText(form.elements.participantNames.value, 500),
    childrenAges: sanitizeRSVPText(form.elements.childrenAges.value, 300),
    dietaryPreferences: sanitizeRSVPText(form.elements.dietaryPreferences.value, 500),
    allergies: sanitizeRSVPText(form.elements.allergies.value, 500),
    borgoInfoRequest: Boolean(form.elements.borgoInfoRequest?.checked),
    message: sanitizeRSVPText(form.elements.message.value, 800),
    privacy: Boolean(form.elements.privacy.checked),
    language: currentLang,
    inviteUrl: window.location.href,
    userAgent: navigator.userAgent || ""
  };
}

function validateRSVPPayload(payload) {
  const copy = getRsvpCopy();
  const textFields = [
    payload.guestName,
    payload.participantNames,
    payload.childrenAges,
    payload.dietaryPreferences,
    payload.allergies,
    payload.borgoInfoRequest ? "Borgo Maresca" : "",
    payload.message
  ];
  const allowedBinary = ["yes", "no"];

  if (!payload.guestId) return copy.missingGuestId;
  if (!allowedBinary.includes(payload.attendance)) return copy.validationRequiredAttendance;
  if (!payload.privacy) return copy.validationPrivacy;
  if (textFields.some(hasHtmlLikeText)) return copy.validationHtml;

  if (payload.attendance === "yes") {
    const validTotal = payload.participantsTotal >= 1 && payload.participantsTotal <= 12;
    const validAdults = payload.adults >= 1 && payload.adults <= payload.participantsTotal;
    const validChildren = payload.children >= 0 && payload.children <= payload.participantsTotal;
    const coherent = payload.adults + payload.children === payload.participantsTotal;
    if (!validTotal || !validAdults || !validChildren || !coherent) return copy.validationNumbers;
    if (payload.participantsTotal > 1 && !payload.participantNames) return copy.validationNames;
  }

  if (payload.attendance === "no" && (payload.participantsTotal !== 0 || payload.adults !== 0 || payload.children !== 0)) {
    return copy.validationNumbers;
  }

  return "";
}

function fillRSVPForm(data = {}) {
  const form = document.getElementById("rsvp-internal-form");
  const invitation = getInvitationParams();
  if (!form) return;

  form.elements.guestId.value = invitation.guestId || data.guestId || "";
  form.elements.language.value = currentLang;
  form.elements.guestName.value = data.guestName || invitation.guestName || "";
  form.elements.attendance.value = data.attendance || "";
  form.elements.participantsTotal.value = data.participantsTotal ?? (data.attendance === "no" ? 0 : 1);
  form.elements.adults.value = data.adults ?? (data.attendance === "no" ? 0 : 1);
  form.elements.children.value = data.children ?? 0;
  form.elements.participantNames.value = data.participantNames || "";
  form.elements.childrenAges.value = data.childrenAges || "";
  form.elements.dietaryPreferences.value = data.dietaryPreferences || "";
  form.elements.allergies.value = data.allergies || "";
  if (form.elements.borgoInfoRequest) form.elements.borgoInfoRequest.checked = Boolean(data.borgoInfoRequest);
  form.elements.message.value = data.message || "";
  form.elements.privacy.checked = Boolean(data.privacy);
  syncRSVPAttendanceFields();
}

function buildRSVPSummary(payload) {
  const copy = getRsvpCopy();
  const summary = document.getElementById("rsvp-summary");
  if (!summary) return;

  const dietary = [payload.dietaryPreferences, payload.allergies].filter(Boolean).join(" · ") || copy.noneLabel;
  const names = [payload.participantNames, payload.childrenAges ? `${copy.childrenAgesLabel}: ${payload.childrenAges}` : ""]
    .filter(Boolean)
    .join(" · ") || copy.noneLabel;

  const rows = payload.attendance === "no" ? [
    [copy.summaryGuest, payload.guestName || payload.guestId],
    [copy.summaryAttendance, copy.noLabel],
    [copy.summaryMessage, payload.message || copy.noneLabel]
  ] : [
    [copy.summaryGuest, payload.guestName || payload.guestId],
    [copy.summaryAttendance, copy.yesLabel],
    [copy.summaryPeople, String(payload.participantsTotal)],
    [copy.summaryAdultsChildren, `${payload.adults} / ${payload.children}`],
    [copy.summaryNames, names],
    [copy.summaryDietary, dietary],
    [copy.summaryBorgo, payload.borgoInfoRequest ? copy.yesLabel : copy.noLabel],
    [copy.summaryMessage, payload.message || copy.noneLabel]
  ];

  summary.innerHTML = rows.map(([label, value]) => `
    <div class="rsvp-summary-row">
      <strong>${label}</strong>
      <span>${String(value).replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>
    </div>
  `).join("");
}

function showRSVPSuccess(payload) {
  document.getElementById("rsvp-internal-form")?.classList.add("hidden");
  document.getElementById("rsvp-success-panel")?.classList.remove("hidden");
  document.getElementById("rsvp-absence-message")?.classList.toggle("hidden", payload.attendance !== "no");
  buildRSVPSummary(payload);
}

function showRSVPFormPanel() {
  document.getElementById("rsvp-success-panel")?.classList.add("hidden");
  document.getElementById("rsvp-absence-message")?.classList.add("hidden");
  document.getElementById("rsvp-internal-form")?.classList.remove("hidden");
}

function openRSVPPrivacyInfo() {
  applyRSVPFormTexts();
  document.getElementById("rsvp-privacy-info-panel")?.classList.remove("hidden");
}

function closeRSVPPrivacyInfo() {
  document.getElementById("rsvp-privacy-info-panel")?.classList.add("hidden");
}

async function requestExistingRSVP(guestId) {
  if (rsvpMockMode()) {
    const stored = localStorage.getItem(rsvpMockKey(guestId));
    return stored ? { success: true, found: true, data: JSON.parse(stored) } : { success: true, found: false };
  }

  if (!rsvpApiConfigured()) {
    return { success: true, found: false };
  }

  const url = new URL(RSVP_API_URL);
  url.searchParams.set("guestId", guestId);
  url.searchParams.set("lang", currentLang);
  const response = await fetch(url.toString(), { method: "GET", cache: "no-store" });
  return response.json();
}

function waitForRSVP(ms = 900) {
  return new Promise(resolve => window.setTimeout(resolve, ms));
}

function normalizeRsvpComparable(value) {
  return String(value ?? "").trim();
}

function rsvpResponseMatchesPayload(data, payload) {
  if (!data) return false;
  const comparableKeys = [
    "guestId",
    "guestName",
    "attendance",
    "participantsTotal",
    "adults",
    "children",
    "participantNames",
    "childrenAges",
    "dietaryPreferences",
    "allergies",
    "message",
    "language"
  ];

  const baseMatches = comparableKeys.every(key => (
    normalizeRsvpComparable(data[key]) === normalizeRsvpComparable(payload[key])
  ));

  return baseMatches && Boolean(data.borgoInfoRequest) === Boolean(payload.borgoInfoRequest);
}

async function sendRSVPToApi(payload) {
  if (rsvpMockMode()) {
    const existing = localStorage.getItem(rsvpMockKey(payload.guestId));
    localStorage.setItem(rsvpMockKey(payload.guestId), JSON.stringify(payload));
    return {
      success: true,
      status: existing ? "updated" : "created",
      message: existing ? "RSVP aggiornato correttamente" : "RSVP registrato correttamente"
    };
  }

  if (!rsvpApiConfigured()) {
    throw new Error(getRsvpCopy().setupMissing);
  }

  const existingBefore = await requestExistingRSVP(payload.guestId).catch(() => ({ success: true, found: false }));

  await fetch(RSVP_API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(payload)
  });

  await waitForRSVP();
  const verified = await requestExistingRSVP(payload.guestId);

  if (!verified?.success || !verified.found || !rsvpResponseMatchesPayload(verified.data, payload)) {
    throw new Error(getRsvpCopy().networkError);
  }

  const status = existingBefore?.found ? "updated" : "created";
  return {
    success: true,
    status,
    message: status === "updated" ? "RSVP aggiornato correttamente" : "RSVP registrato correttamente"
  };
}

async function loadExistingRSVPForGuest(guestId) {
  const copy = getRsvpCopy();
  try {
    const result = await requestExistingRSVP(guestId);
    if (result?.success && result.found && result.data) {
      fillRSVPForm(result.data);
      showRSVPExistingStatus(copy.alreadySent);
    }
  } catch (error) {
    console.warn("RSVP esistente non recuperabile", error);
  }
}

function openInternalRSVP() {
  const modal = document.getElementById("rsvp-form-modal");
  const invitation = getInvitationParams();
  const copy = getRsvpCopy();
  if (!modal) return;

  applyRSVPFormTexts();
  showRSVPFormPanel();
  showRSVPError("");
  showRSVPExistingStatus("");
  fillRSVPForm();
  modal.classList.remove("hidden");

  if (!invitation.guestId) {
    showRSVPError(copy.missingGuestId);
    return;
  }

  loadExistingRSVPForGuest(invitation.guestId);
}

function closeInternalRSVP() {
  closeRSVPPrivacyInfo();
  document.getElementById("rsvp-form-modal")?.classList.add("hidden");
  showRSVPError("");
  showRSVPExistingStatus("");
  setRSVPSubmitState(false);
}

async function handleRSVPSubmit(event) {
  event.preventDefault();

  if (rsvpSubmitting) {
    return;
  }

  const copy = getRsvpCopy();
  const payload = readRSVPForm();
  const validationError = validateRSVPPayload(payload);

  if (validationError) {
    showRSVPError(validationError);
    return;
  }

  showRSVPError("");
  setRSVPSubmitState(true);

  try {
    const result = await sendRSVPToApi(payload);
    if (!result || result.success !== true) {
      throw new Error(result?.message || copy.networkError);
    }
    showRSVPExistingStatus("");
    showRSVPSuccess(payload);
  } catch (error) {
    console.warn("Invio RSVP fallito", error);
    showRSVPError(error?.message || copy.networkError);
  } finally {
    setRSVPSubmitState(false);
  }
}

function initInternalRSVP() {
  const form = document.getElementById("rsvp-internal-form");
  if (!form) return;

  form.addEventListener("submit", handleRSVPSubmit);
  form.addEventListener("change", (event) => {
    if (event.target?.name === "attendance") {
      syncRSVPAttendanceFields();
    }
  });

  document.getElementById("rsvp-form-close")?.addEventListener("click", closeInternalRSVP);
  document.getElementById("rsvp-cancel-button")?.addEventListener("click", closeInternalRSVP);
  document.getElementById("rsvp-edit-button")?.addEventListener("click", showRSVPFormPanel);
  document.getElementById("rsvp-home-button")?.addEventListener("click", () => {
    closeInternalRSVP();
    goBack();
  });
  document.getElementById("rsvp-privacy-info-button")?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openRSVPPrivacyInfo();
  });
  document.getElementById("rsvp-privacy-info-close")?.addEventListener("click", closeRSVPPrivacyInfo);
  document.getElementById("rsvp-privacy-info-panel")?.addEventListener("click", (event) => {
    if (event.target?.id === "rsvp-privacy-info-panel") {
      closeRSVPPrivacyInfo();
    }
  });
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
  const heading = title ? `<h3>${title}</h3>` : "";
  return `
    <section class="guest-notice-block">
      ${heading}
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
  openInternalRSVP();
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
  initInternalRSVP();
  startCountdown();

  try {
    if (new URLSearchParams(window.location.search).get("rsvpOpen") === "1") {
      openInternalRSVP();
    }
  } catch (error) {
    console.warn("Parametro RSVP test non leggibile", error);
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeRSVPModal();
    closeInternalRSVP();
  }
});
