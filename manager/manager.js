const storageKey = "wedding-manager-guests-v1";
const storageRecoveryKey = "wedding-manager-guests-replaced-before-restore-v1";
const hotelRoomsKey = "wedding-manager-hotel-rooms-v1";
const weddingCostsKey = "wedding-manager-costs-v1";
const bankTransfersKey = "wedding-manager-bank-transfers-v1";
const lastSavedAtKey = "wedding-manager-last-saved-at-v1";
const tableLayoutKey = "wedding-manager-table-layout-v1";
const seed = window.WEDDING_MANAGER_DATA || { baseUrl: "", guests: [] };
const publicInviteBaseUrl = "https://fgreco1984.github.io/wedding-invitation/invito-20260704.html";
const relationOptions = [
  "Madre",
  "Padre",
  "Genitore",
  "Fratello",
  "Sorella",
  "Figlio/a",
  "Nonno",
  "Nonna",
  "Zio",
  "Zia",
  "Cugino",
  "Cugina",
  "Nipote",
  "Suocero",
  "Suocera",
  "Cognato",
  "Cognata",
  "Genero",
  "Nuora",
  "Testimone",
  "Compare",
  "Comare",
  "Amico",
  "Amica",
  "Migliore amico/a",
  "Amico/a degli sposi",
  "Amico/a di Fabio",
  "Amico/a di Inna",
  "Amico/a di famiglia",
  "Collega",
  "Ex collega",
  "Conoscente",
  "Vicino/a di casa",
  "Famiglia",
  "Coppia",
  "Parente Fabio",
  "Parente Inna",
  "Famiglia Fabio",
  "Famiglia Inna",
  "Ospite da fuori",
  "Altro"
];
const phonePrefixes = window.PHONE_PREFIXES || [
  { flag: "🇮🇹", label: "Italia", code: "39", iso2: "it", value: "it:39" }
];
const companionOptions = [
  { key: "husband", field: "companionHusband", label: "Marito" },
  { key: "wife", field: "companionWife", label: "Moglie" },
  { key: "child1", field: "companionChild1", label: "Figlio/a" },
  { key: "child2", field: "companionChild2", label: "Figlio/a" },
  { key: "child3", field: "companionChild3", label: "Figlio/a" }
];
const hotelDays = [
  { key: "before", field: "hotelBefore", label: "Giorno prima", short: "Prima" },
  { key: "wedding", field: "hotelWedding", label: "Giorno matrimonio", short: "Matrimonio" },
  { key: "after", field: "hotelAfter", label: "Giorno dopo", short: "Dopo" }
];
const saveDateFields = ["saveDateSent", "saveDateViewed", "saveDateReplied", "saveDateFollowUp"];
const saveDateFolder = "Save The Date";
const saveDateFolderUrl = encodeURI(saveDateFolder);
const defaultWeddingCosts = {
  restaurantPerPax: 170,
  restaurantDeposit: 0,
  photographer: 0,
  flowers: 0,
  car: 0,
  music: 0,
  openBar: 0,
  extraBuffet: 0,
  preWeddingParty: 0,
  bus: 0,
  favors: 0,
  fireworksLights: 0,
  symbolicCeremony: 0,
  siae: 0,
  makeupHair: 0,
  fabioOutfit: 0,
  innaOutfit: 0,
  unexpectedExtra: 0,
};

let guests = loadGuests();
let hotelRooms = loadHotelRooms();
let weddingCosts = loadWeddingCosts();
let bankTransfers = loadBankTransfers();
let tableLayout = loadTableLayout();
let hotelSelectedSingles = makeEmptyHotelSelections();
let selectedKey = null;
let activeFilter = "all";
let activeTransferFilter = "all";

const listEl = document.getElementById("guest-list");
const formEl = document.getElementById("guest-form");
const emptyEl = document.getElementById("empty-state");
const searchInput = document.getElementById("search-input");
const saveStatusEl = document.getElementById("save-status");
const globalSaveStatusEl = document.getElementById("global-save-status");
const hotelModalEl = document.getElementById("hotel-modal");
const hotelOverviewEl = document.getElementById("hotel-overview");
const hotelGridEl = document.getElementById("hotel-grid");
const costModalEl = document.getElementById("cost-modal");
const transferModalEl = document.getElementById("transfer-modal");
const restaurantCostTableEl = document.getElementById("restaurant-cost-table");
const extraCostTableEl = document.getElementById("extra-cost-table");
const costSummaryEl = document.getElementById("cost-summary");
const transferSummaryEl = document.getElementById("transfer-summary");
const transferProgressBarEl = document.getElementById("transfer-progress-bar");
const transferListEl = document.getElementById("transfer-list");
const transferSearchInput = document.getElementById("transfer-search-input");
const dashboardEl = document.getElementById("manager-dashboard");
const workspaceEl = document.getElementById("manager-workspace");
const tableModalEl = document.getElementById("table-modal");
const tableSummaryEl = document.getElementById("table-summary");
const tableBoardEl = document.getElementById("table-board");
const tableSearchInput = document.getElementById("table-search-input");
const tableIncludePendingInput = document.getElementById("table-include-pending");
const tableNameInput = document.getElementById("table-name-input");
const tableAddButton = document.getElementById("table-add-button");

function setupRelationOptions() {
  const select = document.getElementById("relation-select");
  select.innerHTML = relationOptions.map((option) => `<option value="${option}">${option}</option>`).join("");
}

function setupPhonePrefixes() {
  const select = document.getElementById("phone-prefix-select");
  select.innerHTML = phonePrefixes.map((item) => {
    const label = item.code ? `${item.flag} +${item.code} ${item.label}` : `${item.flag} ${item.label}`;
    return `<option value="${item.value || `${item.iso2 || ""}:${item.code}`}">${label}</option>`;
  }).join("");
}

function loadGuests() {
  const seedGuests = structuredClone(seed.guests || []);

  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const storedGuests = JSON.parse(stored);
      if (guestDataScore(seedGuests) > guestDataScore(storedGuests)) {
        localStorage.setItem(storageRecoveryKey, stored);
        localStorage.setItem(storageKey, JSON.stringify(seedGuests));
        return seedGuests;
      }

      return storedGuests;
    }
  } catch (error) {
    console.warn("Impossibile leggere i dati locali", error);
  }

  return seedGuests;
}

function guestDataScore(items) {
  if (!Array.isArray(items)) return 0;

  return items.reduce((score, guest) => {
    const phoneScore = guest.phone ? 4 : 0;
    const noteScore = guest.notes ? 2 : 0;
    const sendScore = guest.sendStatus && guest.sendStatus !== "Da inviare" ? 2 : 0;
    const rsvpScore = guest.rsvpStatus && guest.rsvpStatus !== "In attesa" ? 3 : 0;
    const hotelScore = guest.needsAccommodation ? 2 : 0;
    return score + 10 + phoneScore + noteScore + sendScore + rsvpScore + hotelScore;
  }, 0);
}

function makeEmptyHotelRooms() {
  return hotelDays.reduce((rooms, day) => {
    rooms[day.key] = {};
    return rooms;
  }, {});
}

function makeEmptyHotelSelections() {
  return hotelDays.reduce((selections, day) => {
    selections[day.key] = new Set();
    return selections;
  }, {});
}

function loadHotelRooms() {
  try {
    const stored = localStorage.getItem(hotelRoomsKey);
    if (stored) {
      return { ...makeEmptyHotelRooms(), ...JSON.parse(stored) };
    }
  } catch (error) {
    console.warn("Impossibile leggere le camere locali", error);
  }

  return seed.hotelRooms ? { ...makeEmptyHotelRooms(), ...structuredClone(seed.hotelRooms) } : makeEmptyHotelRooms();
}

function loadWeddingCosts() {
  try {
    const stored = localStorage.getItem(weddingCostsKey);
    if (stored) {
      return normalizeWeddingCosts(JSON.parse(stored));
    }
  } catch (error) {
    console.warn("Impossibile leggere i costi locali", error);
  }

  return normalizeWeddingCosts(seed.weddingCosts || defaultWeddingCosts);
}

function bankTransferSourceToObject(source) {
  if (Array.isArray(source)) {
    return source.reduce((next, item) => {
      const key = item?.guestId || item?.id || item?._key;
      if (key) next[key] = item;
      return next;
    }, {});
  }

  return source && typeof source === "object" ? source : {};
}

function normalizeTransferEntry(entry) {
  const source = entry && typeof entry === "object" ? entry : {};
  return {
    expected: Boolean(source.expected),
    amount: numericCost(source.amount),
    date: typeof source.date === "string" ? source.date : ""
  };
}

function normalizeBankTransferSource(source) {
  const entries = bankTransferSourceToObject(source);

  return guests.reduce((next, guest) => {
    const entry = normalizeTransferEntry(entries[guest.id] || entries[guest._key]);
    if (entry.expected || entry.amount || entry.date) {
      next[guest.id] = entry;
    }
    return next;
  }, {});
}

function normalizeBankTransfers() {
  bankTransfers = normalizeBankTransferSource(bankTransfers);
  return bankTransfers;
}

function loadBankTransfers() {
  try {
    const stored = localStorage.getItem(bankTransfersKey);
    if (stored) {
      return normalizeBankTransferSource(JSON.parse(stored));
    }
  } catch (error) {
    console.warn("Impossibile leggere i bonifici locali", error);
  }

  return normalizeBankTransferSource(seed.bankTransfers || {});
}

function normalizeTableLayoutSource(source) {
  const rawTables = Array.isArray(source) ? source : source?.tables;
  const tables = [...new Set((rawTables || []).map(normalizedTableName).filter(Boolean))];
  return { tables };
}

function loadTableLayout() {
  try {
    const stored = localStorage.getItem(tableLayoutKey);
    if (stored) {
      return normalizeTableLayoutSource(JSON.parse(stored));
    }
  } catch (error) {
    console.warn("Impossibile leggere i tavoli locali", error);
  }

  return normalizeTableLayoutSource(seed.tableLayout || {});
}

function normalizeTableLayout() {
  tableLayout = normalizeTableLayoutSource(tableLayout);
  return tableLayout;
}

function saveTableLayout() {
  normalizeTableLayout();
  localStorage.setItem(tableLayoutKey, JSON.stringify(tableLayout));
  markSaved("Tavoli salvati");
}

function saveBankTransfers() {
  normalizeBankTransfers();
  localStorage.setItem(bankTransfersKey, JSON.stringify(bankTransfers));
  markSaved("Bonifici salvati");
}

function normalizeWeddingCosts(costs) {
  const source = costs && typeof costs === "object" ? costs : {};
  const normalized = Object.keys(defaultWeddingCosts).reduce((next, key) => {
    next[key] = numericCost(source[key] ?? defaultWeddingCosts[key]);
    return next;
  }, {});

  if (!source.fabioOutfit && !source.innaOutfit && source.outfitsTailoring) {
    normalized.fabioOutfit = numericCost(source.outfitsTailoring) / 2;
    normalized.innaOutfit = numericCost(source.outfitsTailoring) / 2;
  }

  return normalized;
}

function saveGuests() {
  localStorage.setItem(storageKey, JSON.stringify(guests));
  markSaved("Salvato in locale");
}

function saveHotelRooms() {
  localStorage.setItem(hotelRoomsKey, JSON.stringify(hotelRooms));
  markSaved("Hotel salvato");
}

function saveWeddingCosts() {
  localStorage.setItem(weddingCostsKey, JSON.stringify(weddingCosts));
  markSaved("Costi salvati");
}

function langCode(language) {
  if (language === "English") return "en";
  if (language === "Українська") return "ua";
  return "it";
}

function saveDateLangCode(language) {
  return langCode(language).toUpperCase();
}

function languageLabel(language) {
  if (language === "English") return "English";
  if (language === "Українська") return "Українська";
  return "Italiano";
}

function normalizeSide(side) {
  if (side === "Fabio" || side === "Inna" || side === "Entrambi") return side;
  return "Entrambi";
}

function sideClass(side) {
  const normalized = normalizeSide(side);
  if (normalized === "Fabio") return "side-fabio";
  if (normalized === "Inna") return "side-inna";
  return "side-both";
}

function normalizeCompanionTypes(guest) {
  const current = guest.companionTypes;
  if (current && typeof current === "object") {
    return companionOptions.reduce((types, option) => {
      types[option.key] = Boolean(current[option.key]);
      return types;
    }, {});
  }

  const legacyCount = Math.max(0, Math.min(companionOptions.length, Number(guest.companions) || 0));
  return companionOptions.reduce((types, option, index) => {
    types[option.key] = index < legacyCount;
    return types;
  }, {});
}

function companionCount(guest) {
  return companionOptions.filter((option) => guest.companionTypes?.[option.key]).length;
}

function isExcludedFromCounts(guest) {
  return Boolean(guest.excludedFromCounts);
}

function expectedGuestPax(guest) {
  if (isExcludedFromCounts(guest)) return 0;
  return 1 + companionCount(guest);
}

function rsvpState(guest) {
  const status = String(guest.rsvpStatus || "").trim().toLowerCase();
  if (status === "sì" || status === "si" || status === "yes") return "yes";
  if (status === "no") return "no";
  return "pending";
}

function normalizeStoredRsvpPax(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function confirmedGuestPax(guest) {
  if (isExcludedFromCounts(guest)) return 0;
  if (rsvpState(guest) !== "yes") return 0;
  return guest.rsvpPax !== null && guest.rsvpPax !== undefined && guest.rsvpPax > 0 ? guest.rsvpPax : expectedGuestPax(guest);
}

function normalizeHotelNights(guest) {
  const current = guest.hotelNights && typeof guest.hotelNights === "object" ? guest.hotelNights : {};
  return hotelDays.reduce((nights, day) => {
    nights[day.key] = Boolean(current[day.key]);
    return nights;
  }, {});
}

function hasSpouseCompanion(guest) {
  return Boolean(guest.companionTypes?.husband || guest.companionTypes?.wife);
}

function childCompanionCount(guest) {
  return ["child1", "child2", "child3"].filter((key) => guest.companionTypes?.[key]).length;
}

function hotelGuestCount(guest) {
  if (isExcludedFromCounts(guest)) return 0;
  return 1 + companionCount(guest);
}

function isStaying(guest, dayKey) {
  return Boolean(!isExcludedFromCounts(guest) && guest.needsAccommodation && guest.hotelNights?.[dayKey]);
}

function hasHotelNightSelected(guest) {
  return hotelDays.some((day) => Boolean(guest.hotelNights?.[day.key]));
}

function hotelInterestedGuests() {
  return guests.filter((guest) => !isExcludedFromCounts(guest) && guest.needsAccommodation);
}

function hotelNeedsDatesGuests() {
  return hotelInterestedGuests().filter((guest) => !hasHotelNightSelected(guest));
}

function hotelOutOfTownWithoutRoomGuests() {
  return guests.filter((guest) => !isExcludedFromCounts(guest) && guest.travelsFromAway && !guest.needsAccommodation);
}

function isManualShareEligible(guest, dayKey) {
  return isStaying(guest, dayKey) && !hasSpouseCompanion(guest) && childCompanionCount(guest) === 0;
}

function nextAvailableGuestId(usedIds, reservedIds, fallbackNumber) {
  const maxExisting = [...new Set([...usedIds, ...reservedIds])].reduce((max, id) => {
    const match = String(id).match(/^G(\d+)$/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  let nextNumber = Math.max(fallbackNumber, maxExisting + 1);
  let nextId = `G${String(nextNumber).padStart(3, "0")}`;

  while (usedIds.has(nextId) || reservedIds.has(nextId)) {
    nextNumber += 1;
    nextId = `G${String(nextNumber).padStart(3, "0")}`;
  }

  return nextId;
}

function makeId(guest, index, usedIds, reservedIds) {
  if (guest.id && !guest.id.startsWith("GNEW") && !usedIds.has(guest.id)) {
    usedIds.add(guest.id);
    return guest.id;
  }

  const nextId = nextAvailableGuestId(usedIds, reservedIds, index + 1);
  usedIds.add(nextId);
  return nextId;
}

function makeGuestKey(guest, index, usedKeys) {
  const currentKey = guest._key || guest.key;
  if (currentKey && !usedKeys.has(currentKey)) {
    usedKeys.add(currentKey);
    return currentKey;
  }

  const newKey = `guest-${Date.now().toString(36)}-${index}-${Math.random().toString(36).slice(2, 8)}`;
  usedKeys.add(newKey);
  return newKey;
}

function normalizeGuests() {
  const usedIds = new Set();
  const usedKeys = new Set();
  const reservedIds = new Set(guests
    .map((guest) => guest.id)
    .filter((id) => id && !String(id).startsWith("GNEW")));

  guests.forEach((guest, index) => {
    guest._key = makeGuestKey(guest, index, usedKeys);
    guest.number = index + 1;
    guest.side = normalizeSide(guest.side);
    guest.companionTypes = normalizeCompanionTypes(guest);
    guest.companions = companionCount(guest);
    guest.needsAccommodation = Boolean(guest.needsAccommodation);
    guest.hotelNights = normalizeHotelNights(guest);
    guest.id = makeId(guest, index, usedIds, reservedIds);
    guest.fullName = `${guest.name || ""} ${guest.surname || ""}`.trim();
    guest.inviteLink = makeInviteLink(guest);
    guest.rsvpReviewRequired = Boolean(guest.rsvpReviewRequired);
    guest.likelyNotAttending = Boolean(guest.likelyNotAttending);
    guest.excludedFromCounts = Boolean(guest.excludedFromCounts);
    if (guest.excludedFromCounts) guest.table = "";
    guest.rsvpPax = normalizeStoredRsvpPax(guest.rsvpPax);
    saveDateFields.forEach((field) => {
      guest[field] = Boolean(guest[field]);
    });
  });

  if (!selectedKey || !guestByKey(selectedKey)) {
    selectedKey = guests[0]?._key || null;
  }

  normalizeHotelRooms();
}

function makeInviteLink(guest) {
  const configuredBase = seed.baseUrl || publicInviteBaseUrl;
  const base = /GitHub_PAGES_save-date\/index\.html|^index\.html$/i.test(configuredBase) ? publicInviteBaseUrl : configuredBase;
  const params = new URLSearchParams({
    id: guest.id || "",
    name: guest.fullName || "",
    lang: langCode(guest.language)
  });

  if (guest.hasChildren) params.set("kids", "1");
  if (guest.travelsFromAway) params.set("travel", "1");
  if (guest.needsAccommodation) params.set("hotel", "1");

  return `${base}?${params.toString()}`;
}

function guestById(id) {
  return guests.find((guest) => guest.id === id);
}

function guestByKey(key) {
  return guests.find((guest) => guest._key === key);
}

function guestByRoomRef(ref) {
  return guestByKey(ref) || guestById(ref);
}

function normalizeHotelRooms() {
  const next = makeEmptyHotelRooms();

  hotelDays.forEach((day) => {
    Object.entries(hotelRooms?.[day.key] || {}).forEach(([roomId, ids]) => {
      const validIds = [...new Set((ids || []).map((id) => {
        const guest = guestByRoomRef(id);
        return guest && isManualShareEligible(guest, day.key) ? guest._key : null;
      }).filter(Boolean))];

      if (validIds.length >= 2) {
        next[day.key][roomId] = validIds;
      }
    });
  });

  hotelRooms = next;
}

function companionLabels(guest) {
  const labels = [];
  if (guest.companionTypes?.husband) labels.push("marito");
  if (guest.companionTypes?.wife) labels.push("moglie");
  const children = childCompanionCount(guest);
  for (let index = 0; index < children; index += 1) {
    labels.push("figlio/a");
  }
  return labels;
}

function roomGuestLabel(guest) {
  const companions = companionLabels(guest);
  return [guest.fullName || "Senza nome", ...companions].join(" + ");
}

function hotelAssignedSingleIds(dayKey) {
  return new Set(Object.values(hotelRooms?.[dayKey] || {}).flat().map((id) => {
    const guest = guestByRoomRef(id);
    return guest?._key || id;
  }));
}

function hotelDayData(dayKey) {
  const staying = guests.filter((guest) => isStaying(guest, dayKey));
  const selfManaged = guests.filter((guest) => guest.travelsFromAway && !guest.needsAccommodation);
  const automaticRooms = staying.filter((guest) => !isManualShareEligible(guest, dayKey));
  const assignedIds = hotelAssignedSingleIds(dayKey);
  const manualRooms = Object.entries(hotelRooms?.[dayKey] || {}).map(([roomId, ids]) => ({
    roomId,
    guests: ids.map(guestByRoomRef).filter(Boolean)
  }));
  const unassignedSingles = staying.filter((guest) => isManualShareEligible(guest, dayKey) && !assignedIds.has(guest._key));
  const selected = hotelSelectedSingles[dayKey] || new Set();
  const people =
    automaticRooms.reduce((sum, guest) => sum + hotelGuestCount(guest), 0) +
    manualRooms.reduce((sum, room) => sum + room.guests.length, 0) +
    unassignedSingles.length;
  const rooms = automaticRooms.length + manualRooms.length + unassignedSingles.length;

  return { staying, selfManaged, automaticRooms, manualRooms, unassignedSingles, selected, people, rooms };
}

function hotelNamesList(items) {
  return items.map((guest) => guest.fullName || "Senza nome").join(" · ");
}

function renderHotelOverview() {
  const interested = hotelInterestedGuests();
  const needsDates = hotelNeedsDatesGuests();
  const withoutRoom = hotelOutOfTownWithoutRoomGuests();

  hotelOverviewEl.innerHTML = `
    <article>
      <span>Interessati camere venue</span>
      <strong>${interested.length}</strong>
      <small>${interested.length ? "Hanno chiesto o potrebbero volere dettagli camera." : "Nessuna richiesta camera segnata."}</small>
    </article>
    <article>
      <span>Giorni da definire</span>
      <strong>${needsDates.length}</strong>
      <small>${needsDates.length ? hotelNamesList(needsDates) : "Tutte le richieste hanno almeno una notte."}</small>
    </article>
    <article>
      <span>Da fuori senza camera</span>
      <strong>${withoutRoom.length}</strong>
      <small>${withoutRoom.length ? hotelNamesList(withoutRoom) : "Nessun ospite da fuori senza richiesta camera."}</small>
    </article>
  `;
}

function renderHotelRoom(dayKey, guest) {
  const type = childCompanionCount(guest) ? "Famiglia" : "Doppia";
  return `
    <article class="hotel-room">
      <div class="hotel-room-head">
        <div>
          <strong>${roomGuestLabel(guest)}</strong>
          <small>${type} · ${hotelGuestCount(guest)} ospiti</small>
        </div>
        <button type="button" class="soft-button hotel-remove-guest-night" data-day="${dayKey}" data-key="${guest._key}">Rimuovi</button>
      </div>
    </article>
  `;
}

function renderManualHotelRoom(dayKey, room) {
  const names = room.guests.map((guest) => guest.fullName || "Senza nome").join(" + ");
  return `
    <article class="hotel-room manual">
      <div class="hotel-room-head">
        <div>
          <strong>${names}</strong>
          <small>Camera condivisa · ${room.guests.length} ospiti</small>
        </div>
        <button type="button" class="soft-button hotel-remove-room" data-day="${dayKey}" data-room-id="${room.roomId}">Sciogli</button>
      </div>
    </article>
  `;
}

function renderSingleHotelRoom(dayKey, guest) {
  return `
    <article class="hotel-room single">
      <div class="hotel-room-head">
        <div>
          <strong>${guest.fullName || "Senza nome"}</strong>
          <small>Singola provvisoria · puoi abbinarla ad altri single</small>
        </div>
        <button type="button" class="soft-button hotel-remove-guest-night" data-day="${dayKey}" data-key="${guest._key}">Rimuovi</button>
      </div>
    </article>
  `;
}

function removeGuestHotelNight(guestKey, dayKey) {
  const guest = guestByKey(guestKey);
  if (!guest) return;

  guest.hotelNights = normalizeHotelNights(guest);
  guest.hotelNights[dayKey] = false;
  hotelSelectedSingles[dayKey]?.delete(guest._key);

  Object.entries(hotelRooms?.[dayKey] || {}).forEach(([roomId, ids]) => {
    if (!ids.includes(guest._key) && !ids.includes(guest.id)) return;
    delete hotelRooms[dayKey][roomId];
  });

  if (!hasHotelNightSelected(guest)) {
    guest.hotelNights = normalizeHotelNights({});
  }

  saveGuests();
  saveHotelRooms();
  renderHotelPlanner();
}

function renderHotelPlanner() {
  normalizeGuests();
  renderHotelOverview();

  hotelGridEl.innerHTML = hotelDays.map((day) => {
    const data = hotelDayData(day.key);
    const canCreateRoom = data.selected.size >= 2;

    return `
      <section class="hotel-day">
        <div>
          <p class="eyebrow">${day.short}</p>
          <h3>${day.label}</h3>
        </div>
        <div class="hotel-summary">
          <span>${data.rooms} camere</span>
          <span>${data.people} ospiti</span>
        </div>
        ${data.selfManaged.length ? `
          <details class="hotel-self-managed">
            <summary>${data.selfManaged.length} da fuori senza camera</summary>
            <p>${data.selfManaged.map((guest) => guest.fullName || "Senza nome").join(" · ")}</p>
          </details>
        ` : ""}
        <div class="hotel-room-list">
          ${data.automaticRooms.map((guest) => renderHotelRoom(day.key, guest)).join("")}
          ${data.manualRooms.map((room) => renderManualHotelRoom(day.key, room)).join("")}
          ${data.unassignedSingles.map((guest) => renderSingleHotelRoom(day.key, guest)).join("")}
          ${data.rooms ? "" : '<p class="hotel-empty">Nessun pernottamento selezionato.</p>'}
        </div>
        <div class="hotel-single-picker">
          <strong>Abbina single</strong>
          ${data.unassignedSingles.length ? data.unassignedSingles.map((guest) => `
            <label>
              <input type="checkbox" class="hotel-single-check" data-day="${day.key}" data-key="${guest._key}" ${data.selected.has(guest._key) ? "checked" : ""}>
              <span>${guest.fullName || "Senza nome"}</span>
            </label>
          `).join("") : '<p class="hotel-empty">Nessun single libero da abbinare.</p>'}
          <button type="button" class="primary-button hotel-create-room" data-day="${day.key}" ${canCreateRoom ? "" : "disabled"}>Crea camera condivisa</button>
        </div>
      </section>
    `;
  }).join("");

  hotelGridEl.querySelectorAll(".hotel-single-check").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const dayKey = checkbox.dataset.day;
      const selection = hotelSelectedSingles[dayKey];
      if (checkbox.checked) {
        selection.add(checkbox.dataset.key);
      } else {
        selection.delete(checkbox.dataset.key);
      }
      renderHotelPlanner();
    });
  });

  hotelGridEl.querySelectorAll(".hotel-create-room").forEach((button) => {
    button.addEventListener("click", () => {
      const dayKey = button.dataset.day;
      const ids = [...hotelSelectedSingles[dayKey]].filter((key) => {
        const guest = guestByKey(key);
        return guest && isManualShareEligible(guest, dayKey);
      });
      if (ids.length < 2) return;

      hotelRooms[dayKey][`camera-${Date.now()}`] = ids;
      hotelSelectedSingles[dayKey].clear();
      saveHotelRooms();
      renderHotelPlanner();
    });
  });

  hotelGridEl.querySelectorAll(".hotel-remove-room").forEach((button) => {
    button.addEventListener("click", () => {
      delete hotelRooms[button.dataset.day][button.dataset.roomId];
      saveHotelRooms();
      renderHotelPlanner();
    });
  });

  hotelGridEl.querySelectorAll(".hotel-remove-guest-night").forEach((button) => {
    button.addEventListener("click", () => {
      removeGuestHotelNight(button.dataset.key, button.dataset.day);
    });
  });
}

function money(value) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(Number(value) || 0);
}

function numericCost(value) {
  return Math.max(0, Number(value) || 0);
}

function sidePaxSummary(scenario = "all") {
  return ["Fabio", "Inna", "Entrambi"].reduce((summary, side) => {
    const sideGuests = guests.filter((guest) => normalizeSide(guest.side) === side && !isExcludedFromCounts(guest));
    const scenarioGuests = sideGuests.filter((guest) => {
      const state = rsvpState(guest);
      if (scenario === "confirmed") return state === "yes";
      if (scenario === "pending") return state === "pending";
      if (scenario === "declined") return state === "no";
      return true;
    });

    summary[side] = {
      guests: scenarioGuests.length,
      pax: scenarioGuests.reduce((sum, guest) => {
        if (scenario === "confirmed") return sum + confirmedGuestPax(guest);
        return sum + expectedGuestPax(guest);
      }, 0)
    };
    return summary;
  }, {});
}

function weddingCostBreakdown(scenario = "all") {
  const pax = sidePaxSummary(scenario);
  const perPax = numericCost(weddingCosts.restaurantPerPax);
  const fabioRestaurant = (pax.Fabio.pax * perPax) + ((pax.Entrambi.pax * perPax) / 2);
  const innaRestaurant = (pax.Inna.pax * perPax) + ((pax.Entrambi.pax * perPax) / 2);
  const restaurantGrossTotal = fabioRestaurant + innaRestaurant;
  const restaurantDeposit = Math.min(numericCost(weddingCosts.restaurantDeposit), restaurantGrossTotal);
  const fabioDepositShare = restaurantGrossTotal ? restaurantDeposit * (fabioRestaurant / restaurantGrossTotal) : 0;
  const innaDepositShare = restaurantGrossTotal ? restaurantDeposit * (innaRestaurant / restaurantGrossTotal) : 0;
  const fabioRestaurantNet = Math.max(fabioRestaurant - fabioDepositShare, 0);
  const innaRestaurantNet = Math.max(innaRestaurant - innaDepositShare, 0);
  const restaurantNetTotal = fabioRestaurantNet + innaRestaurantNet;
  const sharedExtraTotal =
    numericCost(weddingCosts.photographer) +
    numericCost(weddingCosts.flowers) +
    numericCost(weddingCosts.car) +
    numericCost(weddingCosts.music) +
    numericCost(weddingCosts.openBar) +
    numericCost(weddingCosts.extraBuffet) +
    numericCost(weddingCosts.preWeddingParty) +
    numericCost(weddingCosts.bus) +
    numericCost(weddingCosts.favors) +
    numericCost(weddingCosts.fireworksLights) +
    numericCost(weddingCosts.symbolicCeremony) +
    numericCost(weddingCosts.siae) +
    numericCost(weddingCosts.unexpectedExtra);
  const sharedExtraHalf = sharedExtraTotal / 2;
  const fabioPersonal = numericCost(weddingCosts.fabioOutfit);
  const innaPersonal = numericCost(weddingCosts.makeupHair) + numericCost(weddingCosts.innaOutfit);
  const extraTotal = sharedExtraTotal + fabioPersonal + innaPersonal;

  return {
    pax,
    perPax,
    restaurant: {
      Fabio: fabioRestaurant,
      Inna: innaRestaurant,
      FabioNet: fabioRestaurantNet,
      InnaNet: innaRestaurantNet,
      total: restaurantGrossTotal,
      deposit: restaurantDeposit,
      netTotal: restaurantNetTotal
    },
    extraTotal,
    sharedExtraTotal,
    sharedExtraHalf,
    fabioPersonal,
    innaPersonal,
    totals: {
      Fabio: fabioRestaurantNet + sharedExtraHalf + fabioPersonal,
      Inna: innaRestaurantNet + sharedExtraHalf + innaPersonal,
      total: restaurantNetTotal + extraTotal,
      grossTotal: restaurantGrossTotal + extraTotal
    }
  };
}

function paxTotals(pax) {
  return pax.Fabio.pax + pax.Inna.pax + pax.Entrambi.pax;
}

function guestTotals(pax) {
  return pax.Fabio.guests + pax.Inna.guests + pax.Entrambi.guests;
}

function renderCostPlanner() {
  normalizeGuests();

  const fields = {
    restaurantPerPax: document.getElementById("restaurant-cost-input"),
    restaurantDeposit: document.getElementById("restaurant-deposit-cost-input"),
    photographer: document.getElementById("photographer-cost-input"),
    flowers: document.getElementById("flowers-cost-input"),
    car: document.getElementById("car-cost-input"),
    music: document.getElementById("music-cost-input"),
    openBar: document.getElementById("open-bar-cost-input"),
    extraBuffet: document.getElementById("extra-buffet-cost-input"),
    preWeddingParty: document.getElementById("pre-wedding-party-cost-input"),
    bus: document.getElementById("bus-cost-input"),
    favors: document.getElementById("favors-cost-input"),
    fireworksLights: document.getElementById("fireworks-lights-cost-input"),
    symbolicCeremony: document.getElementById("symbolic-ceremony-cost-input"),
    siae: document.getElementById("siae-cost-input"),
    makeupHair: document.getElementById("makeup-hair-cost-input"),
    fabioOutfit: document.getElementById("fabio-outfit-cost-input"),
    innaOutfit: document.getElementById("inna-outfit-cost-input"),
    unexpectedExtra: document.getElementById("unexpected-extra-cost-input")
  };

  Object.entries(fields).forEach(([key, field]) => {
    if (field && document.activeElement !== field) {
      field.value = weddingCosts[key] ?? 0;
    }
  });

  const maxData = weddingCostBreakdown("all");
  const confirmedData = weddingCostBreakdown("confirmed");
  const pendingData = weddingCostBreakdown("pending");
  const data = confirmedData;

  restaurantCostTableEl.innerHTML = `
    <div class="cost-scenario-grid">
      <article>
        <span>Confermato RSVP</span>
        <strong>${money(confirmedData.restaurant.netTotal)}</strong>
        <small>${paxTotals(confirmedData.pax)} pax · lordo ${money(confirmedData.restaurant.total)} - anticipo ${money(confirmedData.restaurant.deposit)}</small>
      </article>
      <article>
        <span>Massimo teorico</span>
        <strong>${money(maxData.restaurant.netTotal)}</strong>
        <small>${paxTotals(maxData.pax)} pax · al netto dell'anticipo</small>
      </article>
      <article>
        <span>Da confermare</span>
        <strong>${money(pendingData.restaurant.total)}</strong>
        <small>${paxTotals(pendingData.pax)} pax senza RSVP</small>
      </article>
    </div>
    <div class="cost-row header">
      <strong>Gruppo</strong>
      <span>Max pax</span>
      <span>RSVP sì</span>
      <span>Da confermare</span>
      <b>Costo RSVP lordo</b>
    </div>
    <div class="cost-row">
      <strong>Fabio</strong>
      <span>${maxData.pax.Fabio.pax}</span>
      <span>${confirmedData.pax.Fabio.pax}</span>
      <span>${pendingData.pax.Fabio.pax}</span>
      <b>${money(confirmedData.pax.Fabio.pax * data.perPax)}</b>
    </div>
    <div class="cost-row">
      <strong>Inna</strong>
      <span>${maxData.pax.Inna.pax}</span>
      <span>${confirmedData.pax.Inna.pax}</span>
      <span>${pendingData.pax.Inna.pax}</span>
      <b>${money(confirmedData.pax.Inna.pax * data.perPax)}</b>
    </div>
    <div class="cost-row">
      <strong>Entrambi</strong>
      <span>${maxData.pax.Entrambi.pax}</span>
      <span>${confirmedData.pax.Entrambi.pax}</span>
      <span>${pendingData.pax.Entrambi.pax}</span>
      <b>${money(confirmedData.pax.Entrambi.pax * data.perPax)}</b>
    </div>
  `;

  extraCostTableEl.innerHTML = `
    <div class="cost-total-row header">
      <strong>Voce</strong>
      <span>Totale</span>
      <b>Ripartizione</b>
    </div>
    <div class="cost-total-row">
      <strong>Fotografo</strong>
      <span>${money(weddingCosts.photographer)}</span>
      <b>${money(numericCost(weddingCosts.photographer) / 2)}</b>
    </div>
    <div class="cost-total-row">
      <strong>Fiori</strong>
      <span>${money(weddingCosts.flowers)}</span>
      <b>${money(numericCost(weddingCosts.flowers) / 2)}</b>
    </div>
    <div class="cost-total-row">
      <strong>Auto</strong>
      <span>${money(weddingCosts.car)}</span>
      <b>${money(numericCost(weddingCosts.car) / 2)}</b>
    </div>
    <div class="cost-total-row">
      <strong>Musica</strong>
      <span>${money(weddingCosts.music)}</span>
      <b>${money(numericCost(weddingCosts.music) / 2)}</b>
    </div>
    <div class="cost-total-row">
      <strong>Open bar</strong>
      <span>${money(weddingCosts.openBar)}</span>
      <b>${money(numericCost(weddingCosts.openBar) / 2)}</b>
    </div>
    <div class="cost-total-row">
      <strong>Extra buffet</strong>
      <span>${money(weddingCosts.extraBuffet)}</span>
      <b>${money(numericCost(weddingCosts.extraBuffet) / 2)}</b>
    </div>
    <div class="cost-total-row">
      <strong>Pre-wedding party</strong>
      <span>${money(weddingCosts.preWeddingParty)}</span>
      <b>${money(numericCost(weddingCosts.preWeddingParty) / 2)}</b>
    </div>
    <div class="cost-total-row">
      <strong>Transfer ospiti / taxi extra</strong>
      <span>${money(weddingCosts.bus)}</span>
      <b>${money(numericCost(weddingCosts.bus) / 2)}</b>
    </div>
    <div class="cost-total-row">
      <strong>Bomboniere</strong>
      <span>${money(weddingCosts.favors)}</span>
      <b>${money(numericCost(weddingCosts.favors) / 2)}</b>
    </div>
    <div class="cost-total-row">
      <strong>Allestimenti extra</strong>
      <span>${money(weddingCosts.fireworksLights)}</span>
      <b>${money(numericCost(weddingCosts.fireworksLights) / 2)}</b>
    </div>
    <div class="cost-total-row">
      <strong>Cerimonia (rito simbolico)</strong>
      <span>${money(weddingCosts.symbolicCeremony)}</span>
      <b>${money(numericCost(weddingCosts.symbolicCeremony) / 2)}</b>
    </div>
    <div class="cost-total-row">
      <strong>SIAE / permessi musica</strong>
      <span>${money(weddingCosts.siae)}</span>
      <b>${money(numericCost(weddingCosts.siae) / 2)}</b>
    </div>
    <div class="cost-total-row">
      <strong>Make-up e hair stylist (Inna)</strong>
      <span>${money(weddingCosts.makeupHair)}</span>
      <b>Inna ${money(weddingCosts.makeupHair)}</b>
    </div>
    <div class="cost-total-row">
      <strong>Abito / sartoria Fabio</strong>
      <span>${money(weddingCosts.fabioOutfit)}</span>
      <b>Fabio ${money(weddingCosts.fabioOutfit)}</b>
    </div>
    <div class="cost-total-row">
      <strong>Abito / sartoria Inna</strong>
      <span>${money(weddingCosts.innaOutfit)}</span>
      <b>Inna ${money(weddingCosts.innaOutfit)}</b>
    </div>
    <div class="cost-total-row">
      <strong>Extra imprevisti</strong>
      <span>${money(weddingCosts.unexpectedExtra)}</span>
      <b>${money(numericCost(weddingCosts.unexpectedExtra) / 2)}</b>
    </div>
  `;

  costSummaryEl.innerHTML = `
    <div class="cost-scenario-grid">
      <article>
        <span>Totale aggiornato RSVP</span>
        <strong>${money(confirmedData.totals.total)}</strong>
        <small>Netto dopo anticipo venue: ${money(confirmedData.restaurant.deposit)}</small>
      </article>
      <article>
        <span>Massimo se venissero tutti</span>
        <strong>${money(maxData.totals.total)}</strong>
        <small>Lordo ${money(maxData.totals.grossTotal)} · netto anticipo</small>
      </article>
      <article>
        <span>Solo rischio da confermare</span>
        <strong>${money(pendingData.restaurant.total)}</strong>
        <small>Ristorante potenziale ancora aperto</small>
      </article>
    </div>
    <div class="cost-total-row header">
      <strong>Persona</strong>
      <span>Ristorante</span>
      <b>Totale con extra</b>
    </div>
    <div class="cost-total-row">
      <strong>Fabio</strong>
      <span>${money(data.restaurant.FabioNet)} ristorante netto + ${money(data.sharedExtraHalf)} condivisi + ${money(data.fabioPersonal)} personali</span>
      <b>${money(data.totals.Fabio)}</b>
    </div>
    <div class="cost-total-row">
      <strong>Inna</strong>
      <span>${money(data.restaurant.InnaNet)} ristorante netto + ${money(data.sharedExtraHalf)} condivisi + ${money(data.innaPersonal)} personali</span>
      <b>${money(data.totals.Inna)}</b>
    </div>
    <div class="cost-total-row">
      <strong>Anticipo ristorante venue</strong>
      <span>${money(data.restaurant.deposit)} già scalati dal ristorante</span>
      <b>- ${money(data.restaurant.deposit)}</b>
    </div>
    <div class="cost-total-row">
      <strong>Totale aggiornato RSVP</strong>
      <span>${money(data.restaurant.netTotal)} ristorante netto + ${money(data.extraTotal)} extra</span>
      <b>${money(data.totals.total)}</b>
    </div>
  `;
}

function readCostPlanner() {
  const fields = {
    restaurantPerPax: document.getElementById("restaurant-cost-input"),
    restaurantDeposit: document.getElementById("restaurant-deposit-cost-input"),
    photographer: document.getElementById("photographer-cost-input"),
    flowers: document.getElementById("flowers-cost-input"),
    car: document.getElementById("car-cost-input"),
    music: document.getElementById("music-cost-input"),
    openBar: document.getElementById("open-bar-cost-input"),
    extraBuffet: document.getElementById("extra-buffet-cost-input"),
    preWeddingParty: document.getElementById("pre-wedding-party-cost-input"),
    bus: document.getElementById("bus-cost-input"),
    favors: document.getElementById("favors-cost-input"),
    fireworksLights: document.getElementById("fireworks-lights-cost-input"),
    symbolicCeremony: document.getElementById("symbolic-ceremony-cost-input"),
    siae: document.getElementById("siae-cost-input"),
    makeupHair: document.getElementById("makeup-hair-cost-input"),
    fabioOutfit: document.getElementById("fabio-outfit-cost-input"),
    innaOutfit: document.getElementById("inna-outfit-cost-input"),
    unexpectedExtra: document.getElementById("unexpected-extra-cost-input")
  };

  Object.entries(fields).forEach(([key, field]) => {
    if (field) {
      weddingCosts[key] = numericCost(field.value);
    }
  });

  saveWeddingCosts();
  renderCostPlanner();
  if (!transferModalEl.classList.contains("hidden")) {
    renderTransferSummary();
  }
}

function transferEntryFor(guest) {
  return normalizeTransferEntry(bankTransfers[guest.id]);
}

function transferStatus(entry) {
  if (entry.amount > 0) return { label: "Ricevuto", detail: entry.date || "Data non segnata", className: "received" };
  if (entry.expected) return { label: "Mancante", detail: "Bonifico previsto", className: "missing" };
  return { label: "Non previsto", detail: "Nessun importo", className: "" };
}

function bankTransferTotals() {
  normalizeBankTransfers();

  const totalCost = weddingCostBreakdown("confirmed").totals.total;
  const entries = guests.filter((guest) => !isExcludedFromCounts(guest)).map((guest) => transferEntryFor(guest));
  const received = entries.reduce((sum, entry) => sum + numericCost(entry.amount), 0);
  const expectedCount = entries.filter((entry) => entry.expected).length;
  const receivedCount = entries.filter((entry) => entry.amount > 0).length;
  const missingExpectedCount = entries.filter((entry) => entry.expected && entry.amount <= 0).length;
  const remaining = Math.max(totalCost - received, 0);
  const surplus = Math.max(received - totalCost, 0);
  const percent = totalCost > 0 ? Math.min(100, (received / totalCost) * 100) : 0;

  return {
    totalCost,
    received,
    expectedCount,
    receivedCount,
    missingExpectedCount,
    remaining,
    surplus,
    percent
  };
}

function renderTransferSummary() {
  const totals = bankTransferTotals();
  const costData = weddingCostBreakdown("confirmed");
  transferProgressBarEl.style.width = `${totals.percent}%`;

  transferSummaryEl.innerHTML = `
    <article>
      <span>Totale aggiornato RSVP</span>
      <strong>${money(totals.totalCost)}</strong>
      <small>Fabio ${money(costData.totals.Fabio)} · Inna ${money(costData.totals.Inna)}</small>
    </article>
    <article>
      <span>Ricevuto</span>
      <strong>${money(totals.received)}</strong>
      <small>${totals.receivedCount} bonifici registrati</small>
    </article>
    <article>
      <span>${totals.surplus > 0 ? "Avanzo" : "Manca"}</span>
      <strong>${money(totals.surplus > 0 ? totals.surplus : totals.remaining)}</strong>
      <small>${Math.round(totals.percent)}% coperto</small>
    </article>
    <article>
      <span>Da seguire</span>
      <strong>${totals.missingExpectedCount}</strong>
      <small>${totals.expectedCount} bonifici previsti</small>
    </article>
  `;
}

function filteredTransferGuests() {
  const query = transferSearchInput.value.trim().toLowerCase();

  return guests.filter((guest) => {
    if (isExcludedFromCounts(guest)) return false;
    const entry = transferEntryFor(guest);
    const haystack = `${guest.id} ${guest.fullName} ${guest.relation}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesFilter =
      activeTransferFilter === "all" ||
      (activeTransferFilter === "expected" && entry.expected) ||
      (activeTransferFilter === "received" && entry.amount > 0) ||
      (activeTransferFilter === "missing" && entry.expected && entry.amount <= 0);

    return matchesQuery && matchesFilter;
  });
}

function renderTransferPlanner() {
  normalizeGuests();
  normalizeBankTransfers();
  renderTransferSummary();

  const rows = filteredTransferGuests();
  const header = `
    <div class="transfer-row header">
      <span>Invitato</span>
      <span>Bonifico</span>
      <span>Importo</span>
      <span>Data</span>
    </div>
  `;

  if (!rows.length) {
    transferListEl.innerHTML = `${header}<p class="transfer-empty">Nessun risultato con questi filtri.</p>`;
    return;
  }

  transferListEl.innerHTML = `${header}${rows.map((guest) => {
    const entry = transferEntryFor(guest);
    const status = transferStatus(entry);
    const pax = 1 + companionCount(guest);
    return `
      <div class="transfer-row ${sideClass(guest.side)} ${status.className}" data-guest-id="${guest.id}">
        <div class="transfer-person">
          <strong>${guest.fullName || "Senza nome"}</strong>
          <small>${guest.id} · ${guest.side || "Entrambi"} · ${pax} pax</small>
        </div>
        <label class="transfer-expected">
          <input type="checkbox" data-transfer-field="expected" data-guest-id="${guest.id}" ${entry.expected ? "checked" : ""}>
          <span>Farà bonifico</span>
        </label>
        <input type="number" min="0" step="1" inputmode="decimal" data-transfer-field="amount" data-guest-id="${guest.id}" value="${entry.amount || ""}" placeholder="0">
        <div class="transfer-status">
          <input type="date" data-transfer-field="date" data-guest-id="${guest.id}" value="${entry.date || ""}">
          <small><strong>${status.label}</strong> ${status.detail}</small>
        </div>
      </div>
    `;
  }).join("")}`;
}

function readTransferPlanner(event) {
  const field = event.target.dataset.transferField;
  const guestId = event.target.dataset.guestId;
  if (!field || !guestId) return;

  const entry = normalizeTransferEntry(bankTransfers[guestId]);
  if (field === "expected") {
    entry.expected = event.target.checked;
  }
  if (field === "amount") {
    entry.amount = numericCost(event.target.value);
    if (entry.amount > 0) entry.expected = true;
  }
  if (field === "date") {
    entry.date = event.target.value;
  }

  bankTransfers[guestId] = entry;
  const row = event.target.closest(".transfer-row");
  if (row) {
    const status = transferStatus(entry);
    row.classList.toggle("received", status.className === "received");
    row.classList.toggle("missing", status.className === "missing");
    const checkbox = row.querySelector('[data-transfer-field="expected"]');
    const statusText = row.querySelector(".transfer-status small");
    if (checkbox) checkbox.checked = entry.expected;
    if (statusText) statusText.innerHTML = `<strong>${status.label}</strong> ${status.detail}`;
  }

  saveBankTransfers();
  renderTransferSummary();
}

function makeWhatsAppMessage(guest) {
  const link = makeInviteLink(guest);
  const isGroupInvite = companionCount(guest) > 0;

  if (guest.language === "English") {
    const intro = isGroupInvite
      ? "With great joy, we would love to share the beginning of our forever with you all."
      : "With great joy, we would love to share the beginning of our forever with you.";
    const action = isGroupInvite
      ? "Open your invitation and kindly confirm your presence:"
      : "Open your personal invitation and kindly confirm your presence:";

    return `${intro}\n${action}\n${link}\nInna & Fabio`;
  }

  if (guest.language === "Українська") {
    const intro = isGroupInvite
      ? "З великою радістю хочемо розділити з вами початок нашого назавжди."
      : "З великою радістю хочемо розділити з тобою початок нашого назавжди.";
    const action = isGroupInvite
      ? "Відкрийте ваше запрошення та підтвердьте присутність:"
      : "Відкрий своє персональне запрошення та підтвердь присутність:";

    return `${intro}\n${action}\n${link}\nInna & Fabio`;
  }

  const intro = isGroupInvite
    ? "Con grande gioia desideriamo condividere con voi l'inizio del nostro per sempre."
    : "Con grande gioia desideriamo condividere con te l'inizio del nostro per sempre.";
  const action = isGroupInvite
    ? "Aprite il vostro invito personale e confermate la vostra presenza:"
    : "Apri il tuo invito personale e conferma la tua presenza:";

  return `${intro}\n${action}\n${link}\nInna & Fabio`;
}

function makeSaveDateMessage(guest) {
  const name = guest.name ? ` ${guest.name}` : "";
  const isGroupInvite = companionCount(guest) > 0;
  const scratchLink = makeSaveDateScratchUrl(guest);

  if (guest.language === "English") {
    const greeting = `Hi${name},`;
    const audience = isGroupInvite ? "you all" : "you";
    return `${greeting}\n\nwith great joy, we would like to share a special date with ${audience}.\n\nOpen the link, scratch the golden card and discover the date of our wedding:\n${scratchLink}\n\nInna & Fabio`;
  }

  if (guest.language === "Українська") {
    const greeting = `Привіт${name},`;
    const audience = isGroupInvite ? "з вами" : "з тобою";
    return `${greeting}\n\nз великою радістю хочемо поділитися ${audience} особливою датою.\n\nВідкрий посилання, зітри золоту картку та дізнайся дату нашого весілля:\n${scratchLink}\n\nInna & Fabio`;
  }

  const greeting = `Ciao${name},`;
  const audience = isGroupInvite ? "con voi" : "con te";
  return `${greeting}\n\ncon grande gioia vogliamo condividere ${audience} una data speciale.\n\nApri il link, gratta e scopri la data del nostro matrimonio:\n${scratchLink}\n\nInna & Fabio`;
}

function saveDateImageCandidates(guest) {
  const code = saveDateLangCode(guest.language);
  const names = [
    `save the date_${code}`,
    `Save the date_${code}`,
    `save-the-date_${code}`,
    `save_the_date_${code}`
  ];
  const extensions = ["png", "jpg", "jpeg", "webp"];

  return names.flatMap((name) => extensions.map((extension) => `${saveDateFolderUrl}/${encodeURIComponent(name)}.${extension}`));
}

function setSaveDateImagePreview(guest) {
  const image = document.getElementById("save-date-image-preview");
  const link = document.getElementById("save-date-image-link");
  if (!image || !link) return;

  const candidates = saveDateImageCandidates(guest);
  let index = 0;
  const applyCandidate = () => {
    const url = candidates[index] || candidates[0];
    image.src = url;
    link.href = url;
    link.textContent = decodeURIComponent(url);
    link.dataset.imageUrl = url;
  };

  image.onerror = () => {
    if (index < candidates.length - 1) {
      index += 1;
      applyCandidate();
      return;
    }
    image.removeAttribute("src");
    link.textContent = `${saveDateFolder}/save the date_${saveDateLangCode(guest.language)}.png`;
    link.removeAttribute("href");
    link.dataset.imageUrl = "";
  };

  image.onload = () => {
    link.dataset.imageUrl = link.getAttribute("href") || candidates[index] || candidates[0];
  };

  applyCandidate();
}

async function resolveExistingSaveDateImage(guest) {
  for (const url of saveDateImageCandidates(guest)) {
    try {
      const response = await fetch(url, { method: "HEAD", cache: "no-store" });
      if (response.ok) return url;
    } catch (error) {
      console.warn("Controllo immagine Save the Date fallito", error);
    }
  }

  return document.getElementById("save-date-image-link")?.dataset.imageUrl || saveDateImageCandidates(guest)[0];
}

function makeWhatsAppUrl(phone, message) {
  const digits = cleanPhoneNumber(phone);
  const encoded = encodeURIComponent(message);
  return digits ? `https://wa.me/${digits}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
}

function currentSaveDateImageUrl(guest) {
  const link = document.getElementById("save-date-image-link");
  return link?.getAttribute("href") || link?.dataset.imageUrl || saveDateImageCandidates(guest)[0];
}

function makeSaveDateScratchBaseUrl() {
  const publicScratchUrl = "https://fgreco1984.github.io/save-the-date-inna-fabio/GitHub_PAGES_save-date/save-date-scratch.html";
  if (!/GitHub_PAGES_save-date\/index\.html/i.test(seed.baseUrl || "")) {
    return publicScratchUrl;
  }

  const base = seed.baseUrl || "index.html";
  const scratchPath = base.includes("index.html")
    ? base.replace(/index\.html.*/, "save-date-scratch.html")
    : base.endsWith("/")
      ? `${base}save-date-scratch.html`
      : "save-date-scratch.html";

  try {
    return new URL(scratchPath, window.location.href).href;
  } catch (error) {
    return scratchPath;
  }
}

function makeSaveDateScratchUrl(guest) {
  const params = new URLSearchParams({
    lang: langCode(guest.language)
  });

  return `${makeSaveDateScratchBaseUrl()}?${params.toString()}`;
}

function makeSaveDateSenderUrl(guest) {
  const params = new URLSearchParams({
    name: guest.fullName || guest.name || "Invitato",
    phone: guest.phone || "",
    lang: langCode(guest.language),
    message: makeSaveDateMessage(guest),
    image: currentSaveDateImageUrl(guest),
    scratch: makeSaveDateScratchUrl(guest)
  });

  return `save-date-send.html?${params.toString()}`;
}

function filteredGuests() {
  const query = searchInput.value.trim().toLowerCase();

  return guests.filter((guest) => {
    const haystack = `${guest.id} ${guest.fullName} ${guest.relation}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "children" && guest.hasChildren) ||
      (activeFilter === "travel" && guest.travelsFromAway) ||
      (activeFilter === "save-date-pending" && !guest.saveDateSent) ||
      (activeFilter === "save-date-follow-up" && guest.saveDateFollowUp) ||
      (activeFilter === "rsvp-review" && guest.rsvpReviewRequired) ||
      (activeFilter === "likely-not-attending" && guest.likelyNotAttending) ||
      (activeFilter === "excluded" && isExcludedFromCounts(guest)) ||
      (activeFilter === "missing-phone" && !guest.phone);

    return matchesQuery && matchesFilter;
  });
}

function renderMetrics() {
  const activeGuests = guests.filter((guest) => !isExcludedFromCounts(guest));
  const total = activeGuests.length;
  const people = activeGuests.reduce((sum, guest) => sum + expectedGuestPax(guest), 0);
  const travelPeople = activeGuests
    .filter((guest) => guest.travelsFromAway)
    .reduce((sum, guest) => sum + expectedGuestPax(guest), 0);
  const toSend = activeGuests.filter((guest) => guest.sendStatus === "Da inviare").length;
  const excluded = guests.filter((guest) => isExcludedFromCounts(guest)).length;

  document.getElementById("metric-total").textContent = total;
  document.getElementById("metric-people").textContent = people;
  document.getElementById("metric-travel").textContent = travelPeople;
  document.getElementById("metric-to-send").textContent = toSend;
  document.getElementById("metric-likely-not").textContent = excluded;
}

function renderList() {
  normalizeGuests();
  renderMetrics();

  const rows = filteredGuests();

  listEl.innerHTML = rows.map((guest) => `
    <button type="button" class="guest-row ${sideClass(guest.side)} ${guest._key === selectedKey ? "active" : ""}" data-key="${guest._key}">
      <span>
        <strong>${guest.fullName || "Senza nome"}</strong>
        <small>N° ${guest.number} · ${guest.id} · ${guest.side || "Entrambi"} · ${guest.relation || "N/D"} · ${guest.language || "Italiano"}</small>
      </span>
      <span class="badge-stack">
        ${!isExcludedFromCounts(guest) && companionCount(guest) ? `<span class="badge">${expectedGuestPax(guest)} pax</span>` : ""}
        ${isExcludedFromCounts(guest) ? '<span class="badge excluded">Escluso</span>' : ""}
        ${guest.hasChildren ? '<span class="badge warn">Figli</span>' : ""}
        ${guest.travelsFromAway ? '<span class="badge travel">Fuori</span>' : ""}
        ${guest.saveDateSent ? '<span class="badge save-date">STD</span>' : ""}
        ${guest.saveDateViewed ? '<span class="badge travel">Visto</span>' : ""}
        ${guest.saveDateReplied ? '<span class="badge save-date">Risposto</span>' : ""}
        ${guest.saveDateFollowUp ? '<span class="badge warn">Sollecito</span>' : ""}
        ${guest.rsvpReviewRequired ? '<span class="badge review">RSVP check</span>' : ""}
        ${guest.likelyNotAttending ? '<span class="badge absence">Prob. no</span>' : ""}
      </span>
    </button>
  `).join("");

  listEl.querySelectorAll(".guest-row").forEach((button) => {
    button.addEventListener("click", () => {
      selectedKey = button.dataset.key;
      render();
    });
  });
}

function selectedGuest() {
  return guestByKey(selectedKey) || guests[0];
}

function safeText(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

function showDashboard() {
  dashboardEl?.classList.remove("hidden");
  workspaceEl?.classList.add("hidden");
}

function showGuestWorkspace() {
  dashboardEl?.classList.add("hidden");
  workspaceEl?.classList.remove("hidden");
  renderList();
  renderEditor();
}

function openHotelPlanner() {
  renderHotelPlanner();
  hotelModalEl.classList.remove("hidden");
}

function openCostPlanner() {
  renderCostPlanner();
  costModalEl.classList.remove("hidden");
}

function openTransferPlanner() {
  renderTransferPlanner();
  transferModalEl.classList.remove("hidden");
}

function openTablePlanner() {
  if (tableIncludePendingInput) tableIncludePendingInput.checked = true;
  renderTablePlanner();
  tableModalEl.classList.remove("hidden");
}

function normalizedTableName(value) {
  return String(value || "").trim();
}

function tableDisplayName(tableName) {
  const normalized = normalizedTableName(tableName);
  if (!normalized) return "Da assegnare";
  return /^\d+$/.test(normalized) ? `Tavolo ${normalized}` : normalized;
}

function tableSort(a, b) {
  const numberA = Number(String(a).match(/\d+/)?.[0]);
  const numberB = Number(String(b).match(/\d+/)?.[0]);
  if (Number.isFinite(numberA) && Number.isFinite(numberB) && numberA !== numberB) {
    return numberA - numberB;
  }
  return String(a).localeCompare(String(b), "it", { numeric: true });
}

function tableGuestPax(guest) {
  if (isExcludedFromCounts(guest)) return 0;
  return rsvpState(guest) === "yes" ? confirmedGuestPax(guest) : expectedGuestPax(guest);
}

function tableEligibleGuests() {
  const query = (tableSearchInput?.value || "").trim().toLowerCase();
  const includePending = Boolean(tableIncludePendingInput?.checked);

  return guests.filter((guest) => {
    if (isExcludedFromCounts(guest)) return false;
    const state = rsvpState(guest);
    const tableName = normalizedTableName(guest.table);
    const matchesStatus = state === "yes" || tableName || (includePending && state === "pending");
    const haystack = `${guest.id} ${guest.fullName} ${guest.side} ${guest.relation} ${tableName}`.toLowerCase();
    return matchesStatus && (!query || haystack.includes(query));
  });
}

function allTableNames() {
  normalizeTableLayout();
  const names = new Set(tableLayout.tables);
  guests.forEach((guest) => {
    if (isExcludedFromCounts(guest)) return;
    const tableName = normalizedTableName(guest.table);
    if (tableName) names.add(tableName);
  });
  return [...names].sort(tableSort);
}

function nextTableName() {
  const used = new Set(allTableNames().map((name) => {
    const number = Number(String(name).match(/\d+/)?.[0]);
    return Number.isFinite(number) ? number : null;
  }).filter(Boolean));

  let index = 1;
  while (used.has(index)) index += 1;
  return String(index);
}

function ensureTableExists(tableName) {
  const normalized = normalizedTableName(tableName);
  if (!normalized) return;
  normalizeTableLayout();
  if (!tableLayout.tables.includes(normalized)) {
    tableLayout.tables.push(normalized);
    tableLayout.tables.sort(tableSort);
  }
}

function addTable(tableName = "") {
  const normalized = normalizedTableName(tableName) || nextTableName();
  ensureTableExists(normalized);
  if (tableNameInput) tableNameInput.value = "";
  saveTableLayout();
  renderTablePlanner();
}

function removeEmptyTable(tableName) {
  const normalized = normalizedTableName(tableName);
  const hasGuests = guests.some((guest) => normalizedTableName(guest.table) === normalized);
  if (!normalized || hasGuests) return;

  tableLayout.tables = tableLayout.tables.filter((name) => name !== normalized);
  saveTableLayout();
  renderTablePlanner();
}

function assignGuestToTable(guestKey, tableName) {
  const guest = guestByKey(guestKey);
  if (!guest) return;

  guest.table = normalizedTableName(tableName);
  if (guest.table) ensureTableExists(guest.table);
  normalizeTableLayout();
  localStorage.setItem(tableLayoutKey, JSON.stringify(tableLayout));
  saveGuests();
  renderList();
  renderTablePlanner();
}

function tablePersonCard(guest) {
  const state = rsvpState(guest);
  const rsvpLabel = state === "yes" ? "RSVP sì" : state === "no" ? "RSVP no" : "In attesa";

  return `
    <div class="table-person table-draggable" draggable="true" data-guest-key="${safeText(guest._key)}">
      <strong>${safeText(guest.fullName || "Senza nome")}</strong>
      <small>${safeText(guest.id)} · ${safeText(guest.side)} · ${tableGuestPax(guest)} pax · ${rsvpLabel}</small>
    </div>
  `;
}

function tableSeatMarkup(guest, index, total) {
  const angle = total <= 1 ? 0 : Math.round((360 / total) * index);
  const firstName = String(guest.fullName || "Senza nome").split(/\s+/).slice(0, 2).join(" ");

  return `
    <div class="table-seat table-draggable" draggable="true" data-guest-key="${safeText(guest._key)}" style="--seat-angle: ${angle}deg;" title="${safeText(guest.fullName || "Senza nome")}">
      ${safeText(firstName)}
      <small>${tableGuestPax(guest)} pax</small>
    </div>
  `;
}

function renderTablePlanner() {
  normalizeGuests();
  normalizeTableLayout();

  const eligibleGuests = tableEligibleGuests();
  const confirmedGuests = guests.filter((guest) => rsvpState(guest) === "yes" && !isExcludedFromCounts(guest));
  const assignedGuests = eligibleGuests.filter((guest) => normalizedTableName(guest.table));
  const unassignedVisibleGuests = eligibleGuests.filter((guest) => !normalizedTableName(guest.table));
  const tableNames = allTableNames();

  const confirmedPax = confirmedGuests.reduce((sum, guest) => sum + confirmedGuestPax(guest), 0);
  const assignedPax = assignedGuests.reduce((sum, guest) => sum + tableGuestPax(guest), 0);
  const unassignedPax = unassignedVisibleGuests.reduce((sum, guest) => sum + tableGuestPax(guest), 0);

  tableSummaryEl.innerHTML = `
    <article>
      <span>RSVP sì</span>
      <strong>${confirmedPax}</strong>
      <small>${confirmedGuests.length} schede confermate</small>
    </article>
    <article>
      <span>Assegnati</span>
      <strong>${assignedPax}</strong>
      <small>Pax già messi a tavolo</small>
    </article>
    <article>
      <span>Da assegnare</span>
      <strong>${unassignedPax}</strong>
      <small>Pax visibili senza tavolo</small>
    </article>
    <article>
      <span>Tavoli</span>
      <strong>${tableNames.length}</strong>
      <small>Tavoli con almeno una scheda</small>
    </article>
  `;

  if (!eligibleGuests.length && !tableNames.length) {
    tableBoardEl.innerHTML = `<p class="table-empty">Non ci sono invitati da mostrare con questi filtri.</p>`;
    return;
  }

  const unassignedGuests = unassignedVisibleGuests;
  const tablesHtml = tableNames.map((tableName) => {
    const tableGuests = eligibleGuests.filter((guest) => normalizedTableName(guest.table) === tableName);
    const pax = tableGuests.reduce((sum, guest) => sum + tableGuestPax(guest), 0);
    const canRemove = tableGuests.length === 0;

    return `
      <section class="round-table-card table-drop-zone" data-table-name="${safeText(tableName)}">
        <div class="round-table-head">
          <strong>${safeText(tableDisplayName(tableName))}</strong>
          <span>${pax} pax · ${tableGuests.length} schede</span>
        </div>
        <div class="round-table">
          <div class="round-table-center">${safeText(tableDisplayName(tableName))}</div>
          ${tableGuests.length ? tableGuests.map((guest, index) => tableSeatMarkup(guest, index, tableGuests.length)).join("") : '<div class="round-table-empty">Trascina qui</div>'}
        </div>
        ${canRemove ? `<button type="button" class="soft-button table-remove-button" data-remove-table="${safeText(tableName)}">Elimina tavolo vuoto</button>` : ""}
      </section>
    `;
  }).join("");

  tableBoardEl.innerHTML = `
    <div class="table-layout">
      <section class="table-pool table-drop-zone" data-table-name="">
        <div class="table-section-head">
          <strong>Da assegnare</strong>
          <span>${unassignedGuests.reduce((sum, guest) => sum + tableGuestPax(guest), 0)} pax · ${unassignedGuests.length} schede</span>
        </div>
        <div class="table-person-list">
          ${unassignedGuests.length ? unassignedGuests.map(tablePersonCard).join("") : '<p class="table-empty">Tutti gli invitati visibili sono già assegnati.</p>'}
        </div>
      </section>
      <section class="table-map">
        ${tablesHtml || '<p class="table-empty">Aggiungi un tavolo e poi trascina i nomi sopra il cerchio.</p>'}
      </section>
    </div>
  `;
}

function setFormValue(name, value) {
  const field = formEl.elements[name];
  if (!field) return;

  if (field.type === "checkbox") {
    field.checked = Boolean(value);
    return;
  }

  if (name === "relation" && value && !relationOptions.includes(value)) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    field.appendChild(option);
  }

  field.value = value ?? "";
}

function parsePhonePrefixValue(value) {
  const [iso2 = "", code = ""] = String(value || "").split(":");
  return { iso2, code: cleanPhoneNumber(code) };
}

function prefixValueFor(iso2, code) {
  const normalizedIso2 = String(iso2 || "").toLowerCase();
  const normalizedCode = cleanPhoneNumber(code);
  const exact = phonePrefixes.find((item) => item.iso2 === normalizedIso2 && item.code === normalizedCode);
  if (exact) return exact.value;

  const byCode = phonePrefixes.find((item) => item.code === normalizedCode);
  if (byCode) return byCode.value;

  return phonePrefixes.find((item) => item.iso2 === "it")?.value || phonePrefixes[0]?.value || "";
}

function splitPhone(guest) {
  const digits = String(guest?.phone || "").replace(/\D/g, "");
  const sorted = [...phonePrefixes].filter((item) => item.code).sort((a, b) => b.code.length - a.code.length);
  const matched = sorted.find((item) => digits.startsWith(item.code));

  if (!digits) {
    return { prefix: prefixValueFor(guest?.phoneCountry || "it", "39"), number: "" };
  }

  if (!matched) {
    return { prefix: "", number: digits };
  }

  const preferredPrefix = prefixValueFor(guest?.phoneCountry || matched.iso2, matched.code);

  return {
    prefix: preferredPrefix,
    number: digits.slice(matched.code.length)
  };
}

function cleanPhoneNumber(value) {
  return String(value || "").replace(/\D/g, "");
}

function renderEditor() {
  const guest = selectedGuest();

  if (!guest) {
    emptyEl.classList.remove("hidden");
    formEl.classList.add("hidden");
    return;
  }

  emptyEl.classList.add("hidden");
  formEl.classList.remove("hidden");

  document.getElementById("guest-id-label").textContent = guest.id;
  document.getElementById("guest-title").textContent = guest.fullName || "Nuovo invitato";

  ["language", "side", "name", "surname", "relation", "email", "table", "sendStatus", "rsvpStatus", "notes"].forEach((name) => {
    setFormValue(name, guest[name]);
  });
  saveDateFields.forEach((name) => {
    setFormValue(name, guest[name]);
  });
  companionOptions.forEach((option) => {
    setFormValue(option.field, guest.companionTypes?.[option.key]);
  });
  hotelDays.forEach((day) => {
    setFormValue(day.field, guest.hotelNights?.[day.key]);
  });
  const phone = splitPhone(guest);
  setFormValue("phonePrefix", phone.prefix);
  setFormValue("phoneNumber", phone.number);
  setFormValue("hasChildren", guest.hasChildren);
  setFormValue("travelsFromAway", guest.travelsFromAway);
  setFormValue("needsAccommodation", guest.needsAccommodation);
  setFormValue("rsvpReviewRequired", guest.rsvpReviewRequired);
  setFormValue("likelyNotAttending", guest.likelyNotAttending);
  setFormValue("excludedFromCounts", guest.excludedFromCounts);

  const inviteLink = makeInviteLink(guest);
  const linkEl = document.getElementById("invite-link");
  linkEl.textContent = inviteLink;
  linkEl.href = inviteLink;
  document.getElementById("whatsapp-message").value = makeWhatsAppMessage(guest);
  document.getElementById("save-date-language").textContent = languageLabel(guest.language);
  setSaveDateImagePreview(guest);
}

function readEditor() {
  const guest = selectedGuest();
  if (!guest) return;

  const fields = ["language", "name", "surname", "relation", "email", "table", "sendStatus", "rsvpStatus", "notes"];
  fields.forEach((name) => {
    guest[name] = formEl.elements[name].value.trim();
  });
  guest.side = normalizeSide(formEl.elements.side.value);
  guest.companionTypes = companionOptions.reduce((types, option) => {
    types[option.key] = formEl.elements[option.field].checked;
    return types;
  }, {});
  guest.companions = companionCount(guest);
  guest.hotelNights = hotelDays.reduce((nights, day) => {
    nights[day.key] = formEl.elements[day.field].checked;
    return nights;
  }, {});
  const { iso2, code: prefix } = parsePhonePrefixValue(formEl.elements.phonePrefix.value);
  const number = cleanPhoneNumber(formEl.elements.phoneNumber.value);
  guest.phoneCountry = iso2;
  guest.phone = number ? `${prefix}${number}` : "";
  guest.hasChildren = formEl.elements.hasChildren.checked;
  guest.rsvpReviewRequired = formEl.elements.rsvpReviewRequired.checked;
  guest.likelyNotAttending = formEl.elements.likelyNotAttending.checked;
  guest.excludedFromCounts = formEl.elements.excludedFromCounts.checked;
  if (guest.excludedFromCounts) {
    guest.table = "";
    setFormValue("table", "");
  }
  saveDateFields.forEach((name) => {
    guest[name] = formEl.elements[name].checked;
  });
  guest.travelsFromAway = formEl.elements.travelsFromAway.checked;
  guest.needsAccommodation = formEl.elements.needsAccommodation.checked;

  if (!guest.needsAccommodation) {
    guest.hotelNights = normalizeHotelNights({});
    hotelDays.forEach((day) => setFormValue(day.field, false));
  }

  normalizeGuests();
  selectedKey = guest._key;
  saveGuests();
  if (!hotelModalEl.classList.contains("hidden")) {
    renderHotelPlanner();
  }
}

function updateDerivedFields() {
  const guest = selectedGuest();
  if (!guest) return;

  const inviteLink = makeInviteLink(guest);
  const linkEl = document.getElementById("invite-link");
  linkEl.textContent = inviteLink;
  linkEl.href = inviteLink;
  document.getElementById("whatsapp-message").value = makeWhatsAppMessage(guest);
  document.getElementById("save-date-language").textContent = languageLabel(guest.language);
  setSaveDateImagePreview(guest);
  document.getElementById("guest-id-label").textContent = guest.id;
  document.getElementById("guest-title").textContent = guest.fullName || "Nuovo invitato";
}

function fallbackCopyText(text) {
  const temp = document.createElement("textarea");
  temp.value = text;
  temp.setAttribute("readonly", "");
  temp.style.position = "fixed";
  temp.style.top = "-1000px";
  document.body.appendChild(temp);
  temp.select();
  const copied = document.execCommand("copy");
  temp.remove();
  showSaveStatus(copied ? "Copiato" : "Copia manuale");
}

function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => showSaveStatus("Copiato"))
      .catch(() => fallbackCopyText(text));
    return;
  }

  fallbackCopyText(text);
}

function formatSaveTime(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function updateGlobalSaveStatus(text = "") {
  if (!globalSaveStatusEl) return;

  const stored = localStorage.getItem(lastSavedAtKey);
  const time = formatSaveTime(stored);
  globalSaveStatusEl.textContent = text || (time ? `Ultimo salvataggio: ${time}` : "Salvataggio automatico attivo");
}

function markSaved(text) {
  const now = new Date().toISOString();
  localStorage.setItem(lastSavedAtKey, now);
  const time = formatSaveTime(now);
  showSaveStatus(time ? `${text} · ${time}` : text);
  updateGlobalSaveStatus(time ? `Ultimo salvataggio: ${time}` : text);
}

function showSaveStatus(text) {
  if (!saveStatusEl) return;

  saveStatusEl.textContent = text;
  saveStatusEl.classList.add("flash");
  window.setTimeout(() => saveStatusEl.classList.remove("flash"), 700);
}

function saveEverything() {
  normalizeGuests();
  normalizeBankTransfers();
  normalizeTableLayout();
  localStorage.setItem(storageKey, JSON.stringify(guests));
  localStorage.setItem(hotelRoomsKey, JSON.stringify(hotelRooms));
  localStorage.setItem(weddingCostsKey, JSON.stringify(weddingCosts));
  localStorage.setItem(bankTransfersKey, JSON.stringify(bankTransfers));
  localStorage.setItem(tableLayoutKey, JSON.stringify(tableLayout));
  markSaved("Tutto salvato");
  render();
}

function exportBackup() {
  normalizeGuests();
  normalizeBankTransfers();
  const payload = {
    exportedAt: new Date().toISOString(),
    baseUrl: seed.baseUrl,
    guests,
    hotelRooms,
    weddingCosts,
    bankTransfers,
    tableLayout
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `wedding-manager-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showSaveStatus("Backup esportato");
}

function importBackup(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const payload = JSON.parse(reader.result);
      const importedGuests = Array.isArray(payload) ? payload : payload.guests;

      if (!Array.isArray(importedGuests)) {
        throw new Error("Formato backup non valido");
      }

      const confirmed = window.confirm(`Importare ${importedGuests.length} invitati dal backup? I dati locali attuali saranno sostituiti.`);
      if (!confirmed) return;

      guests = importedGuests;
      hotelRooms = payload.hotelRooms ? { ...makeEmptyHotelRooms(), ...payload.hotelRooms } : makeEmptyHotelRooms();
      weddingCosts = payload.weddingCosts ? { ...defaultWeddingCosts, ...payload.weddingCosts } : weddingCosts;
      bankTransfers = normalizeBankTransferSource(payload.bankTransfers || {});
      tableLayout = normalizeTableLayoutSource(payload.tableLayout || {});
      hotelSelectedSingles = makeEmptyHotelSelections();
      normalizeGuests();
      normalizeBankTransfers();
      normalizeTableLayout();
      selectedKey = guests[0]?._key || null;
      saveGuests();
      saveHotelRooms();
      saveWeddingCosts();
      saveBankTransfers();
      saveTableLayout();
      render();
      showSaveStatus("Backup importato");
    } catch (error) {
      console.warn("Import backup fallito", error);
      window.alert("Non riesco a leggere questo backup. Usa un file esportato dal Wedding Manager.");
    }
  });
  reader.readAsText(file);
}

const rsvpImportAliases = {
  id: ["id invitato", "id ospite", "guest id", "id"],
  name: ["nome e cognome", "nome completo", "full name", "name"],
  attendance: ["parteciperai", "partecipazione", "attendance", "will you attend"],
  pax: ["quante persone confermi", "persone confermi", "numero persone", "pax", "people", "guests confirmed"],
  participants: ["nomi e cognomi dei partecipanti", "partecipanti confermati", "confirmed guests", "participants"],
  children: ["ci saranno bambini", "bambini", "children", "kids"],
  allergies: ["allergie", "intolleranze", "esigenze alimentari", "dietary", "allergies"],
  accommodation: ["alloggio", "accommodation", "hotel"],
  hotelNights: ["notti", "pernottamento", "quali notti", "giorni camera", "camera giorni", "room nights", "nights"],
  transfer: ["transfer", "taxi", "trasporto"],
  notes: ["note", "messaggio", "message", "notes"]
};

function normalizeLookup(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u0400-\u04ff]+/gi, " ")
    .trim();
}

function compactGuestId(value) {
  return String(value || "").trim().toUpperCase().replace(/\s+/g, "");
}

function countUnquotedDelimiter(line, delimiter) {
  let count = 0;
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === "\"") {
      quoted = !quoted;
    } else if (char === delimiter && !quoted) {
      count += 1;
    }
  }

  return count;
}

function detectDelimiter(text) {
  const firstLine = String(text || "").split(/\r?\n/)[0] || "";
  const options = [",", ";", "\t"];
  return options
    .map((delimiter) => ({ delimiter, count: countUnquotedDelimiter(firstLine, delimiter) }))
    .sort((a, b) => b.count - a.count)[0]?.delimiter || ",";
}

function parseDelimitedRows(text) {
  const source = String(text || "").replace(/^\uFEFF/, "");
  const delimiter = detectDelimiter(source);
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (char === "\"") {
      if (quoted && next === "\"") {
        cell += "\"";
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === delimiter && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell.trim());
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell.trim());
  if (row.some((value) => value !== "")) rows.push(row);
  return rows;
}

function findRsvpColumn(headers, aliases) {
  const normalizedHeaders = headers.map(normalizeLookup);
  const normalizedAliases = aliases.map(normalizeLookup);

  for (const alias of normalizedAliases) {
    const exactIndex = normalizedHeaders.findIndex((header) => header === alias);
    if (exactIndex >= 0) return exactIndex;
  }

  for (const alias of normalizedAliases) {
    const partialIndex = normalizedHeaders.findIndex((header) => header.includes(alias));
    if (partialIndex >= 0) return partialIndex;
  }

  return -1;
}

function makeRsvpColumnMap(headers) {
  return Object.entries(rsvpImportAliases).reduce((map, [key, aliases]) => {
    map[key] = findRsvpColumn(headers, aliases);
    return map;
  }, {});
}

function rsvpCell(row, map, key) {
  const index = map[key];
  return index >= 0 ? String(row[index] || "").trim() : "";
}

function rsvpCellsByHeader(row, headers, terms) {
  const normalizedTerms = terms.map(normalizeLookup);

  return headers.reduce((items, header, index) => {
    const label = String(header || "").trim();
    const value = String(row[index] || "").trim();
    const normalizedLabel = normalizeLookup(label);

    if (!label || !value) return items;

    const matches = normalizedTerms.some((term) => normalizedLabel.includes(term));
    if (matches) items.push(`${label}: ${value}`);

    return items;
  }, []);
}

function answerMeansYes(value) {
  const normalized = normalizeLookup(value);
  return Boolean(normalized) && (
    normalized.startsWith("si") ||
    normalized.startsWith("yes") ||
    normalized.startsWith("y") ||
    normalized.startsWith("так") ||
    normalized.startsWith("да")
  );
}

function answerMeansNo(value) {
  const normalized = normalizeLookup(value);
  return Boolean(normalized) && (
    normalized.startsWith("no") ||
    normalized.startsWith("non") ||
    normalized.startsWith("not") ||
    normalized.startsWith("ні") ||
    normalized.startsWith("ni") ||
    normalized.includes("gia sistemato") ||
    normalized.includes("already")
  );
}

function parseHotelNightsFromText(value) {
  const normalized = normalizeLookup(value);
  const nights = normalizeHotelNights({});
  if (!normalized) return nights;

  const hasAny = (terms) => terms.some((term) => normalized.includes(term));
  const allNights = hasAny([
    "tutte e tre",
    "tutte le notti",
    "all three",
    "all nights",
    "usi tri",
    "usi tri nochi",
    "усі три",
    "усi три"
  ]);

  if (allNights) {
    nights.before = true;
    nights.wedding = true;
    nights.after = true;
    return nights;
  }

  if (hasAny(["prima", "precedente", "before", "previous", "напередодні", "напередоднi"])) nights.before = true;
  if (hasAny(["matrimonio", "cerimonia", "wedding", "ceremony", "evento", "весілля", "весiлля"])) nights.wedding = true;
  if (hasAny(["dopo", "seguente", "successiva", "after", "following", "наступна", "після", "пiсля"])) nights.after = true;
  return nights;
}

function hasParsedHotelNight(nights) {
  return hotelDays.some((day) => Boolean(nights?.[day.key]));
}

function parseRsvpPax(value) {
  const match = String(value || "").match(/\d+/);
  return match ? Number(match[0]) : null;
}

function rsvpReviewReasons(guest, totalPax, childrenAnswer) {
  const reasons = [];
  const expectedPax = 1 + companionCount(guest);

  if (Number.isFinite(totalPax) && totalPax !== expectedPax) {
    reasons.push(`Pax RSVP ${totalPax}, scheda ${expectedPax}`);
  }

  if (childrenAnswer && (answerMeansYes(childrenAnswer) || answerMeansNo(childrenAnswer))) {
    const hasChildrenAnswer = answerMeansYes(childrenAnswer);
    if (hasChildrenAnswer !== Boolean(guest.hasChildren)) {
      reasons.push(`Bambini RSVP ${hasChildrenAnswer ? "Sì" : "No"}, scheda ${guest.hasChildren ? "Sì" : "No"}`);
    }
  }

  return reasons;
}

function mergeRsvpNotes(existingNotes, lines) {
  const block = `[RSVP importato]\n${lines.filter(Boolean).join("\n")}\n[/RSVP importato]`;
  const existing = String(existingNotes || "").trim();
  const previousBlock = /\n?\[RSVP importato\][\s\S]*?\[\/RSVP importato\]/;

  if (previousBlock.test(existing)) {
    return existing.replace(previousBlock, `\n${block}`).trim();
  }

  return [existing, block].filter(Boolean).join("\n\n");
}

function findGuestForRsvpRow(row, map, idIndex, nameIndex) {
  const id = compactGuestId(rsvpCell(row, map, "id"));
  if (id && idIndex.has(id)) return idIndex.get(id);

  const name = normalizeLookup(rsvpCell(row, map, "name"));
  if (name && nameIndex.has(name)) return nameIndex.get(name);

  return null;
}

function applyRsvpRowToGuest(guest, row, map, headers = []) {
  const attendance = rsvpCell(row, map, "attendance");
  const paxValue = rsvpCell(row, map, "pax");
  const participants = rsvpCell(row, map, "participants");
  const children = rsvpCell(row, map, "children");
  const allergies = rsvpCell(row, map, "allergies");
  const accommodation = rsvpCell(row, map, "accommodation");
  const hotelNightsAnswer = rsvpCell(row, map, "hotelNights");
  const transfer = rsvpCell(row, map, "transfer");
  const notes = rsvpCell(row, map, "notes");
  const totalPax = parseRsvpPax(paxValue);
  const menuChoices = rsvpCellsByHeader(row, headers, [
    "menu",
    "primo",
    "secondo",
    "piatto",
    "pesce",
    "carne",
    "meal",
    "first course",
    "second course",
    "main course",
    "страва",
    "риба",
    "м'ясо"
  ]);

  if (answerMeansYes(attendance)) {
    guest.rsvpStatus = "Sì";
    guest.rsvpPax = Number.isFinite(totalPax) ? totalPax : confirmedGuestPax(guest);
    if (guest.sendStatus === "Da inviare") guest.sendStatus = "Inviato";
  } else if (answerMeansNo(attendance)) {
    guest.rsvpStatus = "No";
    guest.rsvpPax = 0;
    if (guest.sendStatus === "Da inviare") guest.sendStatus = "Inviato";
  }

  const reviewReason = rsvpReviewReasons(guest, totalPax, children).join("; ");
  if (reviewReason) {
    guest.rsvpReviewRequired = true;
    guest.rsvpReviewReason = reviewReason;
  } else if (!guest.rsvpReviewRequired) {
    guest.rsvpReviewReason = "";
  }

  if (accommodation || hotelNightsAnswer) {
    const parsedNights = parseHotelNightsFromText(`${accommodation} ${hotelNightsAnswer}`);
    if (answerMeansYes(accommodation)) {
      guest.travelsFromAway = true;
      guest.needsAccommodation = true;
      if (hasParsedHotelNight(parsedNights)) {
        guest.hotelNights = normalizeHotelNights({ ...guest.hotelNights, ...parsedNights });
      }
    } else if (answerMeansNo(accommodation)) {
      guest.needsAccommodation = false;
      if (normalizeLookup(accommodation).includes("gia") || normalizeLookup(accommodation).includes("already")) {
        guest.travelsFromAway = true;
      }
    } else if (hasParsedHotelNight(parsedNights)) {
      guest.travelsFromAway = true;
      guest.needsAccommodation = true;
      guest.hotelNights = normalizeHotelNights({ ...guest.hotelNights, ...parsedNights });
    }
  }

  const importedAt = new Date().toLocaleString("it-IT", { dateStyle: "short", timeStyle: "short" });
  const importedLines = [
    `Importato: ${importedAt}`,
    attendance ? `Partecipazione: ${attendance}` : "",
    paxValue ? `Pax confermati: ${paxValue}` : "",
    participants ? `Partecipanti: ${participants}` : "",
    children ? `Bambini: ${children}` : "",
    reviewReason ? `Da verificare: ${reviewReason}` : "",
    ...menuChoices.map((item) => `Menu: ${item}`),
    allergies ? `Allergie/esigenze: ${allergies}` : "",
    accommodation ? `Info camere venue: ${accommodation}` : "",
    hotelNightsAnswer ? `Notti camere: ${hotelNightsAnswer}` : "",
    transfer ? `Transfer/taxi: ${transfer}` : "",
    notes ? `Messaggio: ${notes}` : ""
  ];

  guest.notes = mergeRsvpNotes(guest.notes, importedLines);
  guest.rsvpImportedAt = new Date().toISOString();
}

function importRsvpText(text, fileName = "file RSVP") {
  const rows = parseDelimitedRows(text);
  if (rows.length < 2) {
    window.alert("Non trovo righe RSVP da importare. Esporta le risposte Google Sheets in CSV e riprova.");
    return;
  }

  const headers = rows[0];
  const dataRows = rows.slice(1);
  const map = makeRsvpColumnMap(headers);

  if (map.id < 0 && map.name < 0) {
    window.alert("Nel file RSVP non trovo una colonna ID invitato o Nome e Cognome. Senza una delle due non posso abbinare le schede.");
    return;
  }

  normalizeGuests();
  const idIndex = new Map(guests.map((guest) => [compactGuestId(guest.id), guest]).filter(([id]) => id));
  const nameIndex = new Map();
  guests.forEach((guest) => {
    const key = normalizeLookup(guest.fullName);
    if (key && !nameIndex.has(key)) nameIndex.set(key, guest);
  });

  let matched = 0;
  const unmatched = [];
  let firstMatchedKey = null;

  dataRows.forEach((row, index) => {
    const guest = findGuestForRsvpRow(row, map, idIndex, nameIndex);
    if (!guest) {
      const label = rsvpCell(row, map, "id") || rsvpCell(row, map, "name") || `riga ${index + 2}`;
      unmatched.push(label);
      return;
    }

    applyRsvpRowToGuest(guest, row, map, headers);
    if (!firstMatchedKey) firstMatchedKey = guest._key;
    matched += 1;
  });

  if (!matched) {
    window.alert("Ho letto il file, ma non ho trovato nessuna scheda da aggiornare. Controlla gli ID invitato.");
    return;
  }

  normalizeGuests();
  selectedKey = firstMatchedKey || selectedKey;
  saveGuests();
  render();

  const unmatchedText = unmatched.length
    ? `\n\nNon abbinate (${unmatched.length}):\n${unmatched.slice(0, 12).join("\n")}${unmatched.length > 12 ? "\n..." : ""}`
    : "";
  window.alert(`Import RSVP completato da ${fileName}.\n\nRighe lette: ${dataRows.length}\nSchede aggiornate: ${matched}${unmatchedText}`);
  showSaveStatus(`RSVP importati: ${matched}`);
}

function importRsvpFile(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      importRsvpText(reader.result, file.name);
    } catch (error) {
      console.warn("Import RSVP fallito", error);
      window.alert("Non riesco a leggere questo file RSVP. Usa un CSV esportato dal foglio risposte di Google Forms.");
    }
  });
  reader.readAsText(file);
}

function addGuest() {
  const next = {
    id: "GNEW",
    language: "Italiano",
    side: "Entrambi",
    name: "",
    surname: "",
    relation: "Altro",
    brindisi: "No",
    companionTypes: normalizeCompanionTypes({ companions: 0 }),
    companions: 0,
    phone: "",
    phoneCountry: "it",
    email: "",
    table: "",
    notes: "",
    sendStatus: "Da inviare",
    rsvpStatus: "In attesa",
    rsvpPax: null,
    rsvpReviewRequired: false,
    likelyNotAttending: false,
    excludedFromCounts: false,
    saveDateSent: false,
    saveDateViewed: false,
    saveDateReplied: false,
    saveDateFollowUp: false,
    needsAccommodation: false,
    hotelNights: normalizeHotelNights({}),
    hasChildren: false,
    travelsFromAway: false
  };

  guests.push(next);
  normalizeGuests();
  selectedKey = next._key;
  saveGuests();
  render();
}

function deleteSelectedGuest() {
  const guest = selectedGuest();
  if (!guest) return;

  const confirmed = window.confirm(`Eliminare ${guest.fullName || "questo contatto"}?`);
  if (!confirmed) return;

  const index = guests.findIndex((item) => item._key === guest._key);
  guests = guests.filter((item) => item._key !== guest._key);
  selectedKey = guests[Math.max(0, index - 1)]?._key || guests[0]?._key || null;
  saveGuests();
  render();
  showSaveStatus("Contatto eliminato");
}

function render() {
  renderList();
  renderEditor();
  if (!hotelModalEl.classList.contains("hidden")) {
    renderHotelPlanner();
  }
  if (!costModalEl.classList.contains("hidden")) {
    renderCostPlanner();
  }
  if (!transferModalEl.classList.contains("hidden")) {
    renderTransferPlanner();
  }
  if (!tableModalEl.classList.contains("hidden")) {
    renderTablePlanner();
  }
}

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    renderList();
  });
});

searchInput.addEventListener("input", renderList);
document.getElementById("global-save-button").addEventListener("click", saveEverything);
document.getElementById("dashboard-home-button").addEventListener("click", showDashboard);
document.getElementById("add-guest-button").addEventListener("click", addGuest);
document.getElementById("hotel-planner-button").addEventListener("click", openHotelPlanner);
document.getElementById("cost-planner-button").addEventListener("click", openCostPlanner);
document.getElementById("transfer-planner-button").addEventListener("click", openTransferPlanner);
document.getElementById("table-planner-button").addEventListener("click", openTablePlanner);
document.getElementById("hotel-close-button").addEventListener("click", () => {
  hotelModalEl.classList.add("hidden");
});
document.getElementById("hotel-close-backdrop").addEventListener("click", () => {
  hotelModalEl.classList.add("hidden");
});
document.getElementById("cost-close-button").addEventListener("click", () => {
  costModalEl.classList.add("hidden");
});
document.getElementById("cost-close-backdrop").addEventListener("click", () => {
  costModalEl.classList.add("hidden");
});
document.getElementById("transfer-close-button").addEventListener("click", () => {
  transferModalEl.classList.add("hidden");
});
document.getElementById("transfer-close-backdrop").addEventListener("click", () => {
  transferModalEl.classList.add("hidden");
});
document.getElementById("table-close-button").addEventListener("click", () => {
  tableModalEl.classList.add("hidden");
});
document.getElementById("table-close-backdrop").addEventListener("click", () => {
  tableModalEl.classList.add("hidden");
});
["restaurant-cost-input", "restaurant-deposit-cost-input", "photographer-cost-input", "flowers-cost-input", "car-cost-input", "music-cost-input", "open-bar-cost-input", "extra-buffet-cost-input", "pre-wedding-party-cost-input", "bus-cost-input", "favors-cost-input", "fireworks-lights-cost-input", "symbolic-ceremony-cost-input", "siae-cost-input", "makeup-hair-cost-input", "fabio-outfit-cost-input", "inna-outfit-cost-input", "unexpected-extra-cost-input"].forEach((id) => {
  document.getElementById(id).addEventListener("input", readCostPlanner);
});
document.querySelectorAll("[data-dashboard-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.dashboardAction;
    if (action === "guests") {
      showGuestWorkspace();
      return;
    }
    if (action === "rsvp") {
      showGuestWorkspace();
      activeFilter = "rsvp-review";
      document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("active", item.dataset.filter === activeFilter));
      renderList();
      document.getElementById("import-rsvp-input").click();
      return;
    }
    if (action === "costs") {
      openCostPlanner();
      return;
    }
    if (action === "transfers") {
      openTransferPlanner();
      return;
    }
    if (action === "hotel") {
      openHotelPlanner();
      return;
    }
    if (action === "tables") {
      openTablePlanner();
    }
  });
});
transferSearchInput.addEventListener("input", renderTransferPlanner);
document.querySelectorAll("[data-transfer-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-transfer-filter]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeTransferFilter = button.dataset.transferFilter;
    renderTransferPlanner();
  });
});
transferListEl.addEventListener("input", readTransferPlanner);
transferListEl.addEventListener("change", readTransferPlanner);
tableSearchInput.addEventListener("input", renderTablePlanner);
tableIncludePendingInput.addEventListener("change", renderTablePlanner);
tableAddButton.addEventListener("click", () => addTable(tableNameInput.value));
tableNameInput.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  addTable(tableNameInput.value);
});
tableBoardEl.addEventListener("dragstart", (event) => {
  const card = event.target.closest(".table-draggable");
  if (!card) return;

  event.dataTransfer.setData("text/plain", card.dataset.guestKey);
  event.dataTransfer.effectAllowed = "move";
  card.classList.add("dragging");
});
tableBoardEl.addEventListener("dragend", (event) => {
  event.target.closest(".table-draggable")?.classList.remove("dragging");
  tableBoardEl.querySelectorAll(".drag-over").forEach((item) => item.classList.remove("drag-over"));
});
tableBoardEl.addEventListener("dragover", (event) => {
  const dropZone = event.target.closest(".table-drop-zone");
  if (!dropZone) return;

  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  tableBoardEl.querySelectorAll(".drag-over").forEach((item) => {
    if (item !== dropZone) item.classList.remove("drag-over");
  });
  dropZone.classList.add("drag-over");
});
tableBoardEl.addEventListener("dragleave", (event) => {
  const dropZone = event.target.closest(".table-drop-zone");
  if (!dropZone || dropZone.contains(event.relatedTarget)) return;
  dropZone.classList.remove("drag-over");
});
tableBoardEl.addEventListener("drop", (event) => {
  const dropZone = event.target.closest(".table-drop-zone");
  if (!dropZone) return;

  event.preventDefault();
  dropZone.classList.remove("drag-over");
  const guestKey = event.dataTransfer.getData("text/plain");
  assignGuestToTable(guestKey, dropZone.dataset.tableName || "");
});
tableBoardEl.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-table]");
  if (!removeButton) return;

  removeEmptyTable(removeButton.dataset.removeTable);
});
document.getElementById("export-backup-button").addEventListener("click", exportBackup);
document.getElementById("import-backup-button").addEventListener("click", () => {
  document.getElementById("import-backup-input").click();
});
document.getElementById("import-backup-input").addEventListener("change", (event) => {
  importBackup(event.target.files[0]);
  event.target.value = "";
});
document.getElementById("import-rsvp-button").addEventListener("click", () => {
  document.getElementById("import-rsvp-input").click();
});
document.getElementById("import-rsvp-input").addEventListener("change", (event) => {
  importRsvpFile(event.target.files[0]);
  event.target.value = "";
});
document.getElementById("delete-guest-button").addEventListener("click", deleteSelectedGuest);
document.getElementById("save-button").addEventListener("click", () => {
  readEditor();
  render();
});
document.getElementById("copy-link-button").addEventListener("click", () => copyText(makeInviteLink(selectedGuest())));
document.getElementById("open-invite-button").addEventListener("click", () => window.open(makeInviteLink(selectedGuest()), "_blank", "noopener"));
document.getElementById("copy-message-button").addEventListener("click", () => copyText(makeWhatsAppMessage(selectedGuest())));
document.getElementById("save-date-copy-message-button").addEventListener("click", () => copyText(makeSaveDateMessage(selectedGuest())));
document.getElementById("save-date-open-image-button").addEventListener("click", async () => {
  const guest = selectedGuest();
  await resolveExistingSaveDateImage(guest);
  window.open(makeSaveDateScratchUrl(guest), "_blank", "noopener");
});
document.getElementById("save-date-whatsapp-button").addEventListener("click", () => {
  const guest = selectedGuest();
  if (!guest) return;

  window.open(makeSaveDateSenderUrl(guest), "_blank", "noopener");
  showSaveStatus("Save the Date pronto");
});
document.getElementById("save-date-share-image-button").addEventListener("click", async () => {
  const guest = selectedGuest();
  if (!guest) return;

  try {
    await resolveExistingSaveDateImage(guest);
    const data = {
      title: "Save the Date",
      text: makeSaveDateMessage(guest),
      url: makeSaveDateScratchUrl(guest)
    };

    if (navigator.canShare?.(data) && navigator.share) {
      await navigator.share(data);
      showSaveStatus("Condivisione link aperta");
      return;
    }

    copyText(makeSaveDateMessage(guest));
    showSaveStatus("Testo con link copiato");
  } catch (error) {
    console.warn("Condivisione Save the Date fallita", error);
    copyText(makeSaveDateMessage(guest));
    showSaveStatus("Testo con link copiato");
  }
});

function handleEditorChange() {
  readEditor();
  renderList();
  updateDerivedFields();
  renderMetrics();
}

formEl.addEventListener("input", handleEditorChange);
formEl.addEventListener("change", handleEditorChange);

setupRelationOptions();
setupPhonePrefixes();
normalizeGuests();
updateGlobalSaveStatus();
render();
