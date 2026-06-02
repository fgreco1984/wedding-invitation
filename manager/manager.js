const storageKey = "wedding-manager-guests-v1";
const seed = window.WEDDING_MANAGER_DATA || { baseUrl: "", guests: [] };
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

let guests = loadGuests();
let selectedId = guests[0]?.id || null;
let activeFilter = "all";

const listEl = document.getElementById("guest-list");
const formEl = document.getElementById("guest-form");
const emptyEl = document.getElementById("empty-state");
const searchInput = document.getElementById("search-input");
const saveStatusEl = document.getElementById("save-status");

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
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn("Impossibile leggere i dati locali", error);
  }

  return structuredClone(seed.guests || []);
}

function saveGuests() {
  localStorage.setItem(storageKey, JSON.stringify(guests));
  showSaveStatus("Salvato in locale");
}

function langCode(language) {
  if (language === "English") return "en";
  if (language === "Українська") return "ua";
  return "it";
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

function makeId(guest, index) {
  if (guest.id && !guest.id.startsWith("GNEW")) {
    return guest.id;
  }

  return `G${String(index + 1).padStart(3, "0")}`;
}

function normalizeGuests() {
  guests.forEach((guest, index) => {
    guest.number = index + 1;
    guest.side = normalizeSide(guest.side);
    guest.companionTypes = normalizeCompanionTypes(guest);
    guest.companions = companionCount(guest);
    guest.id = makeId(guest, index);
    guest.fullName = `${guest.name || ""} ${guest.surname || ""}`.trim();
    guest.inviteLink = makeInviteLink(guest);
  });
}

function makeInviteLink(guest) {
  const base = seed.baseUrl || "../index.html";
  const params = new URLSearchParams({
    id: guest.id || "",
    name: guest.fullName || "",
    lang: langCode(guest.language)
  });

  if (guest.hasChildren) params.set("kids", "1");
  if (guest.travelsFromAway) params.set("travel", "1");

  return `${base}?${params.toString()}`;
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

function filteredGuests() {
  const query = searchInput.value.trim().toLowerCase();

  return guests.filter((guest) => {
    const haystack = `${guest.id} ${guest.fullName} ${guest.relation}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "children" && guest.hasChildren) ||
      (activeFilter === "travel" && guest.travelsFromAway) ||
      (activeFilter === "missing-phone" && !guest.phone);

    return matchesQuery && matchesFilter;
  });
}

function renderMetrics() {
  const total = guests.length;
  const people = guests.reduce((sum, guest) => sum + 1 + companionCount(guest), 0);
  const toSend = guests.filter((guest) => guest.sendStatus === "Da inviare").length;
  const flags = guests.filter((guest) => guest.hasChildren || guest.travelsFromAway).length;

  document.getElementById("metric-total").textContent = total;
  document.getElementById("metric-people").textContent = people;
  document.getElementById("metric-to-send").textContent = toSend;
  document.getElementById("metric-flags").textContent = flags;
}

function renderList() {
  normalizeGuests();
  renderMetrics();

  const rows = filteredGuests();

  listEl.innerHTML = rows.map((guest) => `
    <button type="button" class="guest-row ${sideClass(guest.side)} ${guest.id === selectedId ? "active" : ""}" data-id="${guest.id}">
      <span>
        <strong>${guest.fullName || "Senza nome"}</strong>
        <small>${guest.id} · ${guest.side || "Entrambi"} · ${guest.relation || "N/D"} · ${guest.language || "Italiano"}</small>
      </span>
      <span class="badge-stack">
        ${companionCount(guest) ? `<span class="badge">${companionCount(guest) + 1} pax</span>` : ""}
        ${guest.hasChildren ? '<span class="badge warn">Figli</span>' : ""}
        ${guest.travelsFromAway ? '<span class="badge travel">Fuori</span>' : ""}
      </span>
    </button>
  `).join("");

  listEl.querySelectorAll(".guest-row").forEach((button) => {
    button.addEventListener("click", () => {
      selectedId = button.dataset.id;
      render();
    });
  });
}

function selectedGuest() {
  return guests.find((guest) => guest.id === selectedId) || guests[0];
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
  companionOptions.forEach((option) => {
    setFormValue(option.field, guest.companionTypes?.[option.key]);
  });
  const phone = splitPhone(guest);
  setFormValue("phonePrefix", phone.prefix);
  setFormValue("phoneNumber", phone.number);
  setFormValue("hasChildren", guest.hasChildren);
  setFormValue("travelsFromAway", guest.travelsFromAway);

  const inviteLink = makeInviteLink(guest);
  const linkEl = document.getElementById("invite-link");
  linkEl.textContent = inviteLink;
  linkEl.href = inviteLink;
  document.getElementById("whatsapp-message").value = makeWhatsAppMessage(guest);
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
  const { iso2, code: prefix } = parsePhonePrefixValue(formEl.elements.phonePrefix.value);
  const number = cleanPhoneNumber(formEl.elements.phoneNumber.value);
  guest.phoneCountry = iso2;
  guest.phone = number ? `${prefix}${number}` : "";
  guest.hasChildren = formEl.elements.hasChildren.checked;
  guest.travelsFromAway = formEl.elements.travelsFromAway.checked;
  normalizeGuests();
  selectedId = guest.id;
  saveGuests();
}

function updateDerivedFields() {
  const guest = selectedGuest();
  if (!guest) return;

  const inviteLink = makeInviteLink(guest);
  const linkEl = document.getElementById("invite-link");
  linkEl.textContent = inviteLink;
  linkEl.href = inviteLink;
  document.getElementById("whatsapp-message").value = makeWhatsAppMessage(guest);
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

function showSaveStatus(text) {
  if (!saveStatusEl) return;

  saveStatusEl.textContent = text;
  saveStatusEl.classList.add("flash");
  window.setTimeout(() => saveStatusEl.classList.remove("flash"), 700);
}

function exportBackup() {
  normalizeGuests();
  const payload = {
    exportedAt: new Date().toISOString(),
    baseUrl: seed.baseUrl,
    guests
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
      normalizeGuests();
      selectedId = guests[0]?.id || null;
      saveGuests();
      render();
      showSaveStatus("Backup importato");
    } catch (error) {
      console.warn("Import backup fallito", error);
      window.alert("Non riesco a leggere questo backup. Usa un file esportato dal Wedding Manager.");
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
    hasChildren: false,
    travelsFromAway: false
  };

  guests.push(next);
  normalizeGuests();
  selectedId = next.id;
  saveGuests();
  render();
}

function deleteSelectedGuest() {
  const guest = selectedGuest();
  if (!guest) return;

  const confirmed = window.confirm(`Eliminare ${guest.fullName || "questo contatto"}?`);
  if (!confirmed) return;

  const index = guests.findIndex((item) => item.id === guest.id);
  guests = guests.filter((item) => item.id !== guest.id);
  selectedId = guests[Math.max(0, index - 1)]?.id || guests[0]?.id || null;
  saveGuests();
  render();
  showSaveStatus("Contatto eliminato");
}

function render() {
  renderList();
  renderEditor();
}

document.querySelectorAll(".filter-pill").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-pill").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    renderList();
  });
});

searchInput.addEventListener("input", renderList);
document.getElementById("add-guest-button").addEventListener("click", addGuest);
document.getElementById("export-backup-button").addEventListener("click", exportBackup);
document.getElementById("import-backup-button").addEventListener("click", () => {
  document.getElementById("import-backup-input").click();
});
document.getElementById("import-backup-input").addEventListener("change", (event) => {
  importBackup(event.target.files[0]);
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
render();
