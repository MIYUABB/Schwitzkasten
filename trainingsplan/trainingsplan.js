
(function () {
    const sidemenu = document.getElementById("sidemenu");
    if (!sidemenu) return;

    function openmenu() {
        sidemenu.style.right = "0";
        document.body.style.overflow = "hidden";
    }
    function closemenu() {
        sidemenu.style.right = "-240px";
        document.body.style.overflow = "";
    }
    window.openmenu = openmenu;
    window.closemenu = closemenu;

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closemenu();
    });
    sidemenu.addEventListener("click", (e) => {
        if (e.target.closest("a")) closemenu();
    });

    const mq = window.matchMedia("(min-width: 768px)");
    function handleMQ(ev) {
        if (ev.matches) {
            sidemenu.style.right = "auto";
            document.body.style.overflow = "";
        } else {
            sidemenu.style.right = "-240px";
        }
    }
    handleMQ(mq);
    mq.addEventListener("change", handleMQ);
})();

const PLANS_KEY = "trainingPlans_v1";

function getPlans() {
    try {
        return JSON.parse(localStorage.getItem(PLANS_KEY)) || [];
    } catch {
        return [];
    }
}

let plaene = getPlans();

function createPlanCard(plan) {
    const a = document.createElement("a");
    a.className = "plan-card";
    a.href = "#";
    a.addEventListener("click", (e) => {
        e.preventDefault();
        startPlan(plan.id);
    });

    const icon = document.createElement("div");
    icon.className = "icon";
    icon.innerHTML = `<i class="fas fa-dumbbell" aria-hidden="true"></i>`;

    const content = document.createElement("div");
    content.className = "content";

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = plan.title;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = plan.description || "";

    content.appendChild(title);
    content.appendChild(meta);

    a.appendChild(icon);
    a.appendChild(content);
    return a;
}

function renderPlans(list) {
    const grid = document.getElementById("plansGrid");
    grid.innerHTML = "";
    if (list.length === 0) {
        const p = document.createElement("p");
        p.textContent = "Noch keine Trainingspläne vorhanden.";
        grid.appendChild(p);
        return;
    }
    list.forEach(p => grid.appendChild(createPlanCard(p)));
}
renderPlans(plaene);

const rolle = localStorage.getItem('rolle') || 'schueler';
if (rolle === 'lehrer') {
    const container = document.querySelector('.search-container');
    if (container) {
        const btn = document.createElement('button');
        btn.id = 'managePlansBtn';
        btn.textContent = 'Trainingspläne verwalten';
        btn.addEventListener('click', () => {
            location.href = '../trainingsplaene_verwalten/index.html';
        });
        container.appendChild(btn);
    }
}

// Suche
const search = document.getElementById("searchPlans");
if (search) {
    search.addEventListener("input", (e) => {
        const q = e.target.value.trim().toLowerCase();
        const filtered = plaene.filter(p => p.title.toLowerCase().includes(q));
        renderPlans(filtered);
    });
}

function startPlan(id) {
    const plan = plaene.find(p => p.id === id);
    if (!plan) return;

    localStorage.setItem("currentPlanName", plan.title);
    localStorage.setItem("currentPlanExercises", JSON.stringify(plan.exercises.map(e => e.key)));
    localStorage.setItem("currentTrainingStart", String(Date.now()));

    const shared = {};
    for (const ex of plan.exercises) {
        const base = window.UEBUNGEN_DB?.[ex.key] || { key: ex.key, gif: "../../assets/platzhalter.gif", beschreibung: "", muskelgruppe: "", standort: "" };
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
    window.location.href = "uebung.html";
}
