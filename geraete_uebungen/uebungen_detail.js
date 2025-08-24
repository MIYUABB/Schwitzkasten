function openmenu() {
    document.getElementById("sidemenu").style.right = "0";
}

function closemenu() {
    document.getElementById("sidemenu").style.right = "-200px";
}

const uebungen = {
    "Bauchpresse": {
        gif: "../../assets/gifs/bauchpresse.gif",
        bild: "../../assets/maschinen/bauchpresse.jpg",
        beschreibung:
            "Trainiert gezielt die gerade und schräge Bauchmuskulatur. Achte auf eine kontrollierte Bewegung und eine neutrale Kopfposition.",
        muskelgruppe: "Bauch",
        standort: "Kraftraum"
    },
    "Beinpresse": {
        gif: "../../assets/gifs/beinpresse.gif",
        bild: "../../assets/maschinen/beinpresse.jpg",
        beschreibung:
            "Kräftigt Quadrizeps, Beinbeuger und Gesäß. Fersen bleiben fest auf der Platte, Rücken liegt vollständig an.",
        muskelgruppe: "Beine",
        standort: "Kraftraum"
    },
    "Bankdrücken": {
        gif: "../../assets/gifs/bankdruecken.gif",
        bild: "../../assets/maschinen/bankdruecken.jpg",
        beschreibung:
            "Für starke Brust, Schultern und Trizeps. Schulterblätter zusammenziehen, stabile Fußposition, kontrolliertes Absenken.",
        muskelgruppe: "Brust, Trizeps",
        standort: "Kraftraum"
    },
    "Klimmzüge": {
        gif: "../../assets/gifs/klimmzuege.gif",
        bild: "../../assets/maschinen/klimmzugstange.jpg",
        beschreibung:
            "Ideal für Rücken und Bizeps. Volle Streckung unten, ziehe die Brust Richtung Stange, vermeide Schwung.",
        muskelgruppe: "Rücken",
        standort: "Crossfitbox"
    },
    "Plank": {
        gif: "../../assets/gifs/plank.gif",
        bild: "../../assets/maschinen/plank_matte.jpg",
        beschreibung:
            "Verbessert die Core-Stabilität. Halte Hüfte und Schultern in einer Linie, atme ruhig weiter.",
        muskelgruppe: "Core",
        standort: "Crossfitbox"
    }
};

function getParameterByName(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

const uebungName = getParameterByName("name");

function setSrcOrFallback(imgEl, src, fallback) {
    imgEl.src = src;
    imgEl.onerror = () => (imgEl.src = fallback);
}

if (uebungName && uebungen[uebungName]) {
    const daten = uebungen[uebungName];

    document.getElementById("uebungsName").innerText = uebungName;
    document.getElementById("uebungTitel").innerText = uebungName;
    document.getElementById("uebungBeschreibung").innerText = daten.beschreibung;
    document.getElementById("uebungStandort").innerText = daten.standort;
    document.getElementById("muskelgruppeText").innerText = daten.muskelgruppe;

    const gifEl = document.getElementById("uebungGif");
    const bildEl = document.getElementById("geraetBild");

    setSrcOrFallback(gifEl, daten.gif, "../../assets/platzhalter.gif");
    setSrcOrFallback(bildEl, daten.bild || "", "../../assets/platzhalter_bild.png");
} else {
    document.getElementById("uebungsName").innerText = "Übung nicht gefunden";
    document.getElementById("uebungTitel").innerText = "Unbekannte Übung";
    document.getElementById("uebungBeschreibung").innerText =
        "Die angeforderte Übung konnte nicht gefunden werden.";
    document.getElementById("uebungStandort").innerText = "-";
    document.getElementById("muskelgruppeText").innerText = "-";
    document.getElementById("uebungGif").src = "../../assets/platzhalter.gif";
    document.getElementById("geraetBild").src = "../../assets/platzhalter_bild.png";
}

function goBack() {
    window.location.href = "index.html";
}
