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
        const token = localStorage.getItem('token') || '';
        const res = await fetch(`${API_BASE}/tagebuch`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if(!res.ok) throw new Error();
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    }catch{
        return [];
    }
}
async function createEntry(payload){
    const token = localStorage.getItem('token') || '';
    const res = await fetch(`${API_BASE}/tagebuch`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token?{Authorization:`Bearer ${token}`}:{})
        },
        body: JSON.stringify(payload)
    });
    if(!res.ok) throw new Error('Speichern fehlgeschlagen');
    return await res.json();
}
async function deleteEntry(id){
    const token = localStorage.getItem('token') || '';
    const res = await fetch(`${API_BASE}/tagebuch?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: token?{Authorization:`Bearer ${token}`}:{}}
    );
    if(!res.ok) throw new Error('Löschen fehlgeschlagen');
}

function formatDate(d){ // yyyy-mm-dd -> dd.mm.yyyy
    if (!d || d.length<10) return d || "";
    const [y,m,day] = d.split("-");
    return `${day}.${m}.${y}`;
}
function unique(arr){ return [...new Set(arr)]; }

const bodyEl = document.getElementById("diaryBody");
const emptyEl = document.getElementById("emptyState");
const dateFrom = document.getElementById("dateFrom");
const dateTo   = document.getElementById("dateTo");
const planSelect   = document.getElementById("planSelect");
const muscleSelect = document.getElementById("muscleSelect");
const resetBtn = document.getElementById("resetBtn");
const addBtn = document.getElementById("addBtn");

let allEntries = [];

function populateFilters(){
    planSelect.length = 1; // keep "Alle"
    muscleSelect.length = 1;
    const plans = unique(allEntries.map(e => e.plan).filter(Boolean)).sort((a,b)=>a.localeCompare(b));
    for (const p of plans){
        const opt = document.createElement("option");
        opt.value = p; opt.textContent = p;
        planSelect.appendChild(opt);
    }
    const muscles = unique(allEntries.flatMap(e => e.muscles || [])).sort((a,b)=>a.localeCompare(b));
    for (const m of muscles){
        const opt = document.createElement("option");
        opt.value = m; opt.textContent = m;
        muscleSelect.appendChild(opt);
    }
}
function passFilters(e){
    if (dateFrom.value && e.date < dateFrom.value) return false;
    if (dateTo.value && e.date > dateTo.value) return false;
    if (planSelect.value && e.plan !== planSelect.value) return false;
    if (muscleSelect.value && !(e.muscles || []).includes(muscleSelect.value)) return false;
    return true;
}

function render(){
    bodyEl.innerHTML = "";
    const list = allEntries.filter(passFilters).sort((a,b)=> b.date.localeCompare(a.date));

    emptyEl.style.display = list.length ? "none" : "block";
    for (const e of list){
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${e.plan || "—"}</td>
      <td>${formatDate(e.date)}</td>
      <td>${e.durationMin ? `${e.durationMin} min` : "—"}</td>
      <td>${(e.muscles || []).join(", ") || "—"}</td>
      <td>${e.note || ""}</td>
      <td><button class="del-btn">Löschen</button></td>
    `;
        tr.querySelector('.del-btn')?.addEventListener('click', async ev => {
            ev.stopPropagation();
            if(!confirm('Eintrag löschen?')) return;
            try{
                await deleteEntry(e.id);
                allEntries = allEntries.filter(x=>x.id!==e.id);
                render();
            }catch(err){ alert(err.message||err); }
        });
        tr.addEventListener("click", () => {
            window.location.href = `detail.html?id=${encodeURIComponent(e.id)}`;
        });
        bodyEl.appendChild(tr);
    }
}

[dateFrom, dateTo, planSelect, muscleSelect].forEach(el => {
    el.addEventListener("input", render);
    el.addEventListener("change", render);
});
resetBtn.addEventListener("click", () => {
    dateFrom.value = ""; dateTo.value = ""; planSelect.value = ""; muscleSelect.value = "";
    render();
});

addBtn?.addEventListener('click', async () => {
    const plan = prompt('Trainingsplan?') || '';
    const date = prompt('Datum (YYYY-MM-DD)?');
    if(!date) return;
    const note = prompt('Notiz?') || '';
    try{
        const newEntry = await createEntry({ plan, date, note });
        allEntries.unshift(newEntry);
        populateFilters();
        render();
    }catch(err){ alert(err.message||err); }
});

async function init(){
    allEntries = await fetchEntries();
    populateFilters();
    render();
}
init();
