
function openmenu(){ const s=document.getElementById("sidemenu"); if(s){ s.style.right="0"; document.body.style.overflow="hidden"; } }
function closemenu(){ const s=document.getElementById("sidemenu"); if(s){ s.style.right="-240px"; document.body.style.overflow=""; } }


const PLANS_KEY = "trainingPlans_v1";

function readJSON(key, fallback){ try{ return JSON.parse(localStorage.getItem(key)) ?? fallback; }catch{ return fallback; } }
function writeJSON(key, val){ try{ localStorage.setItem(key, JSON.stringify(val)); }catch{} }
function getPlans(){ return readJSON(PLANS_KEY, []); }
function savePlans(plans){ writeJSON(PLANS_KEY, plans); }
function uid(){ return (self.crypto&&crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()); }

if (!window.UEBUNGEN_DB) {
    window.UEBUNGEN_DB = {
        "Bankdrücken": { key:"Bankdrücken", gif:"../../assets/gifs/bankdruecken.gif", beschreibung:"Brust/Trizeps.", muskelgruppe:"Brust, Trizeps, Schulter", standort:"Bankdrück-Station" },
        "Bauchpresse": { key:"Bauchpresse", gif:"../../assets/gifs/bauchpresse.gif", beschreibung:"Bauch gezielt.", muskelgruppe:"Bauch", standort:"Kraftraum" },
        "Beinpresse": { key:"Beinpresse", gif:"../../assets/gifs/beinpresse.gif", beschreibung:"Beine/Gesäß.", muskelgruppe:"Beine, Gesäß", standort:"Kraftraum" },
        "Klimmzüge":   { key:"Klimmzüge",   gif:"../../assets/gifs/klimmzuege.gif",   beschreibung:"Rücken/Bizeps.", muskelgruppe:"Rücken, Bizeps", standort:"Crossfitbox" }
    };
}


document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.getAttribute("data-page");
    if (page === "list") initListPage();
    if (page === "create") initCreatePage();
});


function initListPage(){
    const listRoot = document.getElementById("plansList");
    renderPlans();

    function renderPlans(){
        const plans = getPlans();
        listRoot.innerHTML = "";
        if (plans.length === 0){
            const empty = document.createElement("div");
            empty.className = "plan-card";
            empty.innerHTML = `<p>Es sind noch keine Trainingspläne vorhanden. Erstelle den ersten über <b>„Neuer Trainingsplan“</b>.</p>`;
            listRoot.appendChild(empty);
            return;
        }

        for (const p of plans){
            const card = document.createElement("div");
            card.className = "plan-card";
            card.innerHTML = `
        <h3>${escapeHtml(p.title)}</h3>
        <p class="plan-meta">${escapeHtml(p.description || "")}</p>
        <p class="plan-meta"><b>Muskelgruppen:</b> ${p.muscles?.join(", ") || "—"}</p>
        <p class="plan-meta"><b>Übungen:</b> ${p.exercises.map(e => `${e.key} (${e.sets}×${e.reps})`).join(", ")}</p>
        <div class="card-actions">
          <button class="btn-accent" data-action="start" data-id="${p.id}"><i class="fas fa-play"></i> Plan starten</button>
          <button class="ghost-btn" data-action="edit" data-id="${p.id}"><i class="fas fa-edit"></i> Bearbeiten</button>
          <button class="ghost-btn" data-action="delete" data-id="${p.id}"><i class="fas fa-trash"></i> Löschen</button>
        </div>
      `;
            listRoot.appendChild(card);
        }


        listRoot.querySelectorAll("[data-action='start']").forEach(btn => {
            btn.addEventListener("click", () => startPlan(btn.getAttribute("data-id")));
        });
        listRoot.querySelectorAll("[data-action='edit']").forEach(btn => {
            btn.addEventListener("click", () => editPlan(btn.getAttribute("data-id")));
        });
        listRoot.querySelectorAll("[data-action='delete']").forEach(btn => {
            btn.addEventListener("click", () => deletePlan(btn.getAttribute("data-id")));
        });
    }

    function deletePlan(id){
        if (!confirm("Diesen Trainingsplan wirklich löschen?")) return;
        const plans = getPlans().filter(p => p.id !== id);
        savePlans(plans);
        renderPlans();
    }

    function startPlan(id){
        const plan = getPlans().find(p => p.id === id);
        if (!plan) return;


        localStorage.setItem("currentPlanName", plan.title);
        localStorage.setItem("currentPlanExercises", JSON.stringify(plan.exercises.map(e => e.key)));
        localStorage.setItem("currentTrainingStart", String(Date.now()));


        const shared = {};
        for (const ex of plan.exercises){
            const base = window.UEBUNGEN_DB[ex.key] || { key: ex.key, gif:"../../assets/platzhalter.gif", beschreibung:"", muskelgruppe:"", standort:"" };
            shared[ex.key] = {
                name: base.key || ex.key,
                muskelgruppe: base.muskelgruppe || "",
                beschreibung: base.beschreibung || "",
                standort: base.standort || "",
                gif: base.gif || "../../assets/platzhalter.gif",
                vorgabe: { saetze: ex.sets, whd: ex.reps }
            };
        }
        localStorage.setItem("sharedExercisesDB", JSON.stringify(shared));


        window.location.href = "../trainingsplan/uebung.html";
    }

    function editPlan(id){
        window.location.href = `erstellen.html?id=${id}`;
    }
}


function initCreatePage(){
    const form = document.getElementById("planForm");
    const list = document.getElementById("exerciseList");
    const addBtn = document.getElementById("addExerciseBtn");

    const params = new URLSearchParams(location.search);
    const editId = params.get("id");
    let editing = null;

    if (editId){
        const plan = getPlans().find(p => p.id === editId);
        if (plan){
            editing = plan;
            document.querySelector('.page-title').textContent = 'Trainingsplan bearbeiten';
            form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Plan aktualisieren';
            document.getElementById('planTitle').value = plan.title;
            document.getElementById('planDesc').value = plan.description || '';
            document.getElementById('planMuscles').value = plan.muscles?.join(', ') || '';
            plan.exercises.forEach(ex => addExerciseRow(ex));
        } else {
            addExerciseRow();
        }
    } else {
        addExerciseRow();
    }

    addBtn.addEventListener("click", () => addExerciseRow());

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("planTitle").value.trim();
        const description = document.getElementById("planDesc").value.trim();
        const muscles = document.getElementById("planMuscles").value
            .split(",").map(s => s.trim()).filter(Boolean);

        const exercises = [];
        list.querySelectorAll(".exercise-row").forEach(row => {
            const nameInput = row.querySelector("input[name='exName']");
            const setsInput = row.querySelector("input[name='exSets']");
            const repsInput = row.querySelector("input[name='exReps']");

            const key = (nameInput.value || "").trim();
            const sets = parseInt(setsInput.value, 10) || 1;
            const reps = parseInt(repsInput.value, 10) || 10;
            if (!key) return;

            if (!window.UEBUNGEN_DB[key]) {
                alert(`Übung „${key}“ nicht gefunden.`);
                return;
            }
            exercises.push({ key, sets, reps });
        });

        if (exercises.length === 0){
            alert("Bitte mindestens eine Übung hinzufügen.");
            return;
        }

        const plan = {
            id: editing ? editing.id : uid(),
            title, description, muscles, exercises,
            createdAt: editing ? editing.createdAt : new Date().toISOString()
        };

        const plans = getPlans();
        if (editing){
            const idx = plans.findIndex(p => p.id === editing.id);
            if (idx !== -1) plans[idx] = plan;
        } else {
            plans.push(plan);
        }
        savePlans(plans);

        window.location.href = "index.html";
    });

    function addExerciseRow(prefill){
        const row = document.createElement("div");
        row.className = "exercise-row";

        const name = document.createElement("input");
        name.type = "text";
        name.name = "exName";
        name.placeholder = "Übung suchen… (z. B. „Bauch…“)";
        const listId = "dl_" + Math.random().toString(36).slice(2);
        name.setAttribute("list", listId);

        const dl = document.createElement("datalist");
        dl.id = listId;

        name.addEventListener("input", () => {
            const q = name.value.toLowerCase();
            dl.innerHTML = "";
            Object.keys(window.UEBUNGEN_DB)
                .filter(k => k.toLowerCase().includes(q))
                .slice(0, 12)
                .forEach(k => {
                    const opt = document.createElement("option");
                    opt.value = k;
                    dl.appendChild(opt);
                });
        });

        const sets = document.createElement("input");
        sets.type = "number"; sets.min = "1"; sets.name = "exSets"; sets.placeholder = "Sätze"; sets.value = prefill?.sets || "3";

        const reps = document.createElement("input");
        reps.type = "number"; reps.min = "1"; reps.name = "exReps"; reps.placeholder = "Wdh."; reps.value = prefill?.reps || "10";

        const remove = document.createElement("button");
        remove.type = "button"; remove.className = "remove"; remove.textContent = "Entfernen";
        remove.addEventListener("click", () => row.remove());

        row.appendChild(name);
        row.appendChild(dl);
        row.appendChild(sets);
        row.appendChild(reps);
        row.appendChild(remove);
        list.appendChild(row);

        if (prefill) {
            name.value = prefill.key;
        }
        name.dispatchEvent(new Event("input"));
    }
}

function escapeHtml(str=""){
    return str.replace(/[&<>"']/g, s => ({
        "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"
    }[s]));
}
