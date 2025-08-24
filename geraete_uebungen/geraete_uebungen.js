
function openmenu() {
    document.getElementById("sidemenu").style.right = "0";
}
function closemenu() {
    document.getElementById("sidemenu").style.right = "-240px";
}

const uebungen = [
    { name: "Bauchpresse", image: "../../assets/images/bauchpresse.png" },
    { name: "Beinpresse",  image: "../../assets/images/beinpresse.png"  },
    { name: "Bankdrücken", image: "../../assets/images/bankdruecken.png" },
    { name: "Klimmzüge",   image: "../../assets/images/klimmzuege.png"  },
    { name: "Plank",       image: "../../assets/images/plank.png"       },
];

const FALLBACK_IMG = "../../assets/platzhalter_bild.png";

function createCard(uebung) {
    const card = document.createElement("a");
    card.className = "card";
    card.href = `./uebungen_detail.html?name=${encodeURIComponent(uebung.name)}`;
    card.setAttribute("aria-label", uebung.name);

    const thumb = document.createElement("div");
    thumb.className = "thumb";
    const img = document.createElement("img");
    img.src = uebung.image || FALLBACK_IMG;
    img.alt = uebung.name;
    img.onerror = () => { img.src = FALLBACK_IMG; };
    thumb.appendChild(img);

    const content = document.createElement("div");
    content.className = "content";
    const title = document.createElement("div");
    title.className = "title";
    title.textContent = uebung.name;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = uebung.name;

    content.appendChild(title);
    content.appendChild(meta);

    card.appendChild(thumb);
    card.appendChild(content);

    return card;
}

function renderList(list) {
    const container = document.getElementById("cardsContainer");
    container.innerHTML = "";
    list.forEach(u => container.appendChild(createCard(u)));
}

// Suche
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    const filtered = uebungen.filter(u => u.name.toLowerCase().includes(q));
    renderList(filtered);
});

renderList(uebungen);
