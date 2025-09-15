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

const API_BASE = "/api";
async function fetchEntries(){
    try{
        const token = localStorage.getItem('token')||'';
        const res = await fetch(`${API_BASE}/tagebuch`, { headers: token?{Authorization:`Bearer ${token}`}:{}});
        if(!res.ok) throw new Error();
        const data = await res.json();
        return Array.isArray(data)?data:[];
    }catch{
        return [];
    }
}
function getParam(name){
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}
function formatDate(d){
    if (!d || d.length<10) return d || "";
    const [y,m,day] = d.split("-");
    return `${day}.${m}.${y}`;
}

const entryId = getParam("id");

const metaRoot = document.getElementById("metaCards");
const tbody = document.getElementById("detailBody");
const emptyEl = document.getElementById("emptyState");

function addMeta(label, value){
    const div = document.createElement("div");
    div.className = "meta-card";
    div.innerHTML = `<span class="label">${label}</span><span class="value">${value || "—"}</span>`;
    metaRoot.appendChild(div);
}
async function init(){
    const entries = await fetchEntries();
    const entry = entries.find(e => e.id === entryId);
    if (!entry){
        document.querySelector(".page-title").textContent = "Eintrag nicht gefunden";
        emptyEl.style.display = "block";
        return;
    }
    document.querySelector(".page-title").textContent = `Tagebuch – ${entry.plan}`;
    addMeta("Trainingsplan", entry.plan);
    addMeta("Datum", formatDate(entry.date));
    addMeta("Dauer", entry.durationMin ? `${entry.durationMin} min` : "—");
    addMeta("Muskelgruppen", (entry.muscles || []).join(", "));
    if (entry.note) addMeta("Notiz", entry.note);

    const rows = [];
    (entry.exercises || []).forEach(ex => {
        if (ex.sets && ex.sets.length > 0){
            ex.sets.forEach(s => {
                rows.push({
                    name: ex.name || "—",
                    weight: s.weight || "—",
                    reps: s.reps || "—",
                    note: s.note || ""
                });
            });
        } else {
            rows.push({ name: ex.name || "—", weight:"—", reps:"—", note:"" });
        }
    });

    if (rows.length === 0){
        emptyEl.style.display = "block";
    } else {
        emptyEl.style.display = "none";
        rows.forEach(r => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${r.name}</td>
        <td>${r.weight}</td>
        <td>${r.reps}</td>
        <td>${r.note}</td>
      `;
            tbody.appendChild(tr);
        });
    }
}
init();
