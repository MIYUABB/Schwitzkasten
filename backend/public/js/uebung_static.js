import { UEBUNGEN } from "./uebung_data.js";

const $ = s => document.querySelector(s);

const KOERPERGEWICHT_KEYS = new Set([
    "backpull_trx","boxjump","boxtaps","dips_box","pullup","pushup_shoulder","pushup_trx"
]);

function qs(name){ const p = new URLSearchParams(location.search); return p.get(name) || ""; }

function mediaTag(url){
    if(!url) return "";
    const l = url.toLowerCase();
    if(l.endsWith(".mp4") || l.endsWith(".webm")) return `<video src="${url}" autoplay loop muted playsinline></video>`;
    return `<img src="${url}" alt="Übung">`;
}

/* -------- Abschnitts-Parser (fix) -------- */
const HEADER_LIST = [
    "Zweck","Startposition","Start","Ausführung","Atmung",
    "Tempo und Bewegungsradius","Tempo","Bewegungsradius",
    "Fehler","Häufige Fehler","Sicherheit","Varianten",
    "Gerät","Geräte","Zielmuskulatur","Beschreibung"
];
const HEADER_RE = new RegExp(`(?:^|\\s)(${HEADER_LIST.join("|")})\\s*:\\s*`,"gi");

function normalizeTitle(t){
    const x = t.trim();
    return x.toLowerCase()==="start" ? "Startposition" : x;
}

function parseSections(text){
    if(!text) return [{ title: "Beschreibung", body: "" }];

    const t = String(text).replace(/\r\n/g,"\n").trim();
    const parts = t.split(HEADER_RE);

    const sections = [];
    const pre = (parts[0] || "").trim();
    if(pre) sections.push({ title: "Beschreibung", body: pre });

    for(let i=1; i<parts.length; i+=2){
        const rawTitle = parts[i] || "Beschreibung";
        const body = (parts[i+1] || "").trim();
        sections.push({ title: normalizeTitle(rawTitle), body });
    }

    if(!sections.length) sections.push({ title: "Beschreibung", body: t });

    return sections.map(s=>{
        const bullets = s.body
          .split(/(?:\.\s+|;\s+|\n+|,\s+(?!\d))/g)
          .map(v=>v.trim())
          .filter(v=>v);
        return bullets.length > 1 ? { ...s, bullets } : s;
    });
}

function renderSections(sections){
    return sections.map(s=>{
        if(s.bullets && s.bullets.length > 1){
            return `<article class="u-item"><h3>${s.title}</h3><ul>${s.bullets.map(b=>`<li>${b}</li>`).join("")}</ul></article>`;
        }
        return `<article class="u-item"><h3>${s.title}</h3><p>${s.body}</p></article>`;
    }).join("");
}

/* -------- Init -------- */
(function init(){
    const key = qs("key");
    const data = UEBUNGEN[key];
    if(!data){ alert("Übung nicht gefunden"); return; }

    const nameEl = $("#u_name"); if(nameEl) nameEl.textContent = data.name || "";
    const muskelEl = $("#u_muskel"); if(muskelEl) muskelEl.textContent = data.muskel || "";

    const locWrap = document.getElementById("u_loc");
    const locSpan = document.getElementById("u_ort");
    const ortExplicit = (data.ort || "").trim();
    const ortAuto = KOERPERGEWICHT_KEYS.has(key) ? "Box" : "Gym";
    if(locSpan) locSpan.textContent = ortExplicit || ortAuto;
    if(locWrap && !(ortExplicit || ortAuto)) locWrap.style.display = "none";

    const mediaEl = $("#u_media");
    if(mediaEl) mediaEl.innerHTML = mediaTag(data.video || data.media);

    const sections = parseSections(data.text);
    const secEl = $("#u_sections");
    if(secEl) secEl.innerHTML = renderSections(sections);
})();
