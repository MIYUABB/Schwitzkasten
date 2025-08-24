
(function () {
    const sidemenu = document.getElementById("sidemenu");
    if (!sidemenu) return;

    function openmenu() { sidemenu.style.right = "0"; document.body.style.overflow = "hidden"; }
    function closemenu() { sidemenu.style.right = "-240px"; document.body.style.overflow = ""; }
    window.openmenu = openmenu; window.closemenu = closemenu;

    const mq = window.matchMedia("(min-width: 768px)");
    const handle = e => {
        if (e.matches){ sidemenu.style.right = "auto"; document.body.style.overflow = ""; }
        else { sidemenu.style.right = "-240px"; }
    };
    handle(mq); mq.addEventListener("change", handle);
})();

const LOG_KEY        = "trainingLog_v2";       // Sätze je Übung
const DIARY_KEY      = "diaryEntries_v1";      // Tagebuch-Einträge
const PLAN_NAME_KEY  = "currentPlanName";      // Name des Plans (vom Detail setzen)
const TRAIN_START_KEY= "currentTrainingStart"; // Startzeit (ms)

function qs(id){ return document.getElementById(id); }
function readJSON(key, fallback){ try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
function writeJSON(key, val){ try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }
function unique(arr){ return [...new Set(arr)]; }
function todayISO(){ const d=new Date(); return d.toISOString().slice(0,10); }


const FALLBACK_EXERCISES = [
    {
        name: "Bankdrücken",
        muskelgruppe: "Brust, Trizeps, Schulter",
        beschreibung: "Klassische Übung für Brust, Trizeps und Schulter.",
        standort: "Bankdrück-Station",
        gif: "../../assets/gifs/bankdruecken.gif",
        vorgabe: { saetze: 3, whd: [12, 10, 8] }
    },
    {
        name: "Klimmzüge",
        muskelgruppe: "Rücken, Bizeps",
        beschreibung: "Eigengewicht – ideal für Rücken und Bizeps.",
        standort: "Klimmzugstange",
        gif: "../../assets/gifs/klimmzuege.gif",
        vorgabe: { saetze: 3, whd: 8 }
    }
];

function loadExercisesFromPlan() {
    const names = readJSON("currentPlanExercises", null); // ["Bankdrücken","Klimmzüge",...]
    const db = readJSON("sharedExercisesDB", null);       // optional: globale DB als Objekt {name:{...}}
    if (!names) return FALLBACK_EXERCISES;
    // map Namen zu Objekten (aus DB oder Fallback)
    return names.map(n => (db && db[n]) ? db[n] : (FALLBACK_EXERCISES.find(x=>x.name===n) || { name:n, muskelgruppe:"", beschreibung:"", standort:"", gif:"../../assets/platzhalter.gif", vorgabe:{} }));
}

let exercises = loadExercisesFromPlan();
let currentExercise = 0;

// Startzeit setzen, falls nicht vorhanden
(function ensureStartTime(){
    const exist = localStorage.getItem(TRAIN_START_KEY);
    if (!exist) localStorage.setItem(TRAIN_START_KEY, String(Date.now()));
})();

function setPrescription(vorgabe){
    const s = (vorgabe?.saetze ?? "—");
    let w = vorgabe?.whd ?? "—";
    if (Array.isArray(w)) w = w.join(" / ");
    const saetzeEl = document.getElementById("vorgabeSaetze");
    const wdhEl    = document.getElementById("vorgabeWdh");
    if (saetzeEl) saetzeEl.textContent = s;
    if (wdhEl)    wdhEl.textContent    = w;
}

function renderExercise() {
    const e = exercises[currentExercise];
    qs("uebungsName").textContent = e.name || "—";
    qs("muskelgruppe").textContent = e.muskelgruppe || "—";
    qs("beschreibung").textContent = e.beschreibung || "—";
    qs("standort").textContent = e.standort || "—";
    qs("uebungGif").src = e.gif || "../../assets/platzhalter.gif";
    qs("progressText").textContent = `Übung ${currentExercise + 1} von ${exercises.length}`;
    setPrescription(e.vorgabe);
    // bestehende Sätze laden
    renderSets(readJSON(LOG_KEY, {})[e.name] || []);
}

function makeRow(index, data = { weight:"", reps:"", note:"" }) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
    <td class="idx">${index}</td>
    <td><input type="number" min="0" step="0.5" placeholder="kg" value="${data.weight ?? ""}"></td>
    <td><input type="number" min="0" step="1" placeholder="Wdh." value="${data.reps ?? ""}"></td>
    <td class="hide-sm"><input type="text" placeholder="Notiz" value="${data.note ?? ""}"></td>
    <td><button class="row-btn delete">Löschen</button></td>
  `;
    tr.querySelector(".delete").addEventListener("click", () => {
        tr.remove(); renumberRows();
    });
    return tr;
}

function renumberRows() {
    [...document.querySelectorAll("#setsBody .idx")].forEach((el, i) => el.textContent = i + 1);
}

function renderSets(sets) {
    const body = qs("setsBody");
    body.innerHTML = "";
    sets.forEach((s, i) => body.appendChild(makeRow(i+1, s)));
    if (sets.length === 0) addSet(); // mindestens eine Zeile
}

function addSet() {
    const body = qs("setsBody");
    body.appendChild(makeRow(body.children.length + 1));
}

function readSetsFromTable() {
    const rows = [...document.querySelectorAll("#setsBody tr")];
    return rows.map(r => {
        const inputs = r.querySelectorAll("input");
        const weight = inputs[0]?.value.trim() || "";
        const reps   = inputs[1]?.value.trim() || "";
        const note   = (r.querySelector(".hide-sm input") || inputs[2])?.value.trim() || "";
        return (weight !== "" || reps !== "" || note !== "") ? { weight, reps, note } : null;
    }).filter(Boolean);
}

function saveCurrent() {
    const e = exercises[currentExercise];
    const log = readJSON(LOG_KEY, {});
    log[e.name] = readSetsFromTable();
    writeJSON(LOG_KEY, log);
}

function finishTraining() {
    saveCurrent();

    const planName = localStorage.getItem(PLAN_NAME_KEY) || "Unbekannter Trainingsplan";
    const startMs  = Number(localStorage.getItem(TRAIN_START_KEY) || Date.now());
    const durationMin = Math.max(1, Math.round((Date.now() - startMs) / 60000));

    const log = readJSON(LOG_KEY, {});
    const muscles = unique(exercises.flatMap(e => (e.muskelgruppe || "")
        .split(",").map(s => s.trim()).filter(Boolean)));

    const entry = {
        id: (self.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()),
        plan: planName,
        date: todayISO(),
        durationMin,
        muscles,
        note: "",
        exercises: exercises.map(e => ({
            name: e.name,
            sets: log[e.name] || []
        }))
    };

    const diary = readJSON(DIARY_KEY, []);
    diary.push(entry);
    writeJSON(DIARY_KEY, diary);

    localStorage.removeItem(LOG_KEY);
    localStorage.removeItem(TRAIN_START_KEY);
    localStorage.removeItem("currentPlanExercises");

    window.location.href = `../tagebuch/detail.html`;
}

document.getElementById("addSetBtn")?.addEventListener("click", addSet);
document.getElementById("saveBtn")?.addEventListener("click", () => {
    saveCurrent();
    const btn = document.getElementById("saveBtn");
    btn.textContent = "Gespeichert ✓";
    setTimeout(()=> btn.innerHTML = `<i class="fas fa-save"></i> Speichern`, 900);
});
document.getElementById("nextBtn")?.addEventListener("click", () => {
    saveCurrent();
    if (currentExercise < exercises.length - 1) {
        currentExercise++; renderExercise();
    } else {
        finishTraining();
    }
});
document.getElementById("prevBtn")?.addEventListener("click", () => {
    saveCurrent();
    if (currentExercise > 0) { currentExercise--; renderExercise(); }
});

renderExercise();
