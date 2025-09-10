
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

const defaultPlaene = [
    { title: "Ganzkörper – Anfänger", meta: "3 Tage | 45–60 min", href: "detail.html" },
    { title: "Push/Pull/Legs",        meta: "6 Tage | 60–75 min", href: "detail.html" },
    { title: "Ober-/Unterkörper",     meta: "4 Tage | 50–70 min", href: "detail.html" },
    { title: "Hypertrophie Split",    meta: "5 Tage | 60–80 min", href: "detail.html" },
    { title: "Kraft 5x5",             meta: "3 Tage | 45–70 min", href: "detail.html" },
];

function loadPlaene(){
    try{
        const stored = JSON.parse(localStorage.getItem('lehrerPlans')||'[]');
        return stored.length ? stored : defaultPlaene;
    }catch{
        return defaultPlaene;
    }
}

let plaene = loadPlaene();

function createPlanCard(plan) {
    const a = document.createElement("a");
    a.className = "plan-card";
    a.href = plan.href;

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
    meta.textContent = plan.meta;

    content.appendChild(title);
    content.appendChild(meta);

    a.appendChild(icon);
    a.appendChild(content);
    return a;
}

function renderPlans(list) {
    const grid = document.getElementById("plansGrid");
    grid.innerHTML = "";
    list.forEach(p => grid.appendChild(createPlanCard(p)));
}
renderPlans(plaene);

const rolle = localStorage.getItem('rolle') || 'schueler';
if(rolle === 'lehrer'){
    const container = document.querySelector('.search-container');
    if(container){
        const btn = document.createElement('button');
        btn.id = 'createPlanBtn';
        btn.textContent = 'Trainingsplan erstellen';
        btn.addEventListener('click', ()=>{
            location.href = '../trainingsplaene_verwalten/erstellen.html';
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
