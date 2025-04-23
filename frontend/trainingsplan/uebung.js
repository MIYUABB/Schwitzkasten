const uebungen = [
    {
        nummer: "Übung 1",
        titel: "Kniebeuge",
        beschreibung: "Diese Übung trainiert primär die Beine und fördert zusätzlich die Rumpfstabilität.",
        ort: "Crossfit Box",
        sets: "4",
        pause: "60s",
        wiederholungen: "12"
    },
    {
        nummer: "Übung 2",
        titel: "Bankdrücken",
        beschreibung: "Kräftigt Brust, Trizeps und vordere Schulter. Achte auf die Ellenbogenführung.",
        ort: "Kraftraum",
        sets: "3",
        pause: "90s",
        wiederholungen: "10"
    }
];

let index = 0;
let eintraege = [];

function zeigeUebung() {
    const u = uebungen[index];
    document.querySelector(".title").innerText = u.nummer;
    document.querySelector(".right-box h2").innerText = u.titel;
    document.querySelector(".right-box p").innerText = u.beschreibung;
    document.querySelector(".location").innerHTML = `<i class="fa-solid fa-location-dot"></i> ${u.ort}`;

    const row = document.querySelector(".table-container tbody tr");
    row.children[0].innerText = u.sets;
    row.children[1].innerText = u.pause;
    row.children[2].innerText = u.wiederholungen;

    document.getElementById("sets").value = "";
    document.getElementById("wdh").value = "";
    document.getElementById("gewicht").value = "";
    document.getElementById("notizen").value = "";

    const button = document.querySelector(".weiter-button");
    button.innerText = index === uebungen.length - 1 ? "Ende" : "Weiter";
}

function weiterKlicken() {
    const sets = document.getElementById("sets").value.trim();
    const wdh = document.getElementById("wdh").value.trim();
    const gewicht = document.getElementById("gewicht").value.trim();
    const notizen = document.getElementById("notizen").value.trim();

    if (!sets || !wdh || !gewicht) {
        alert("Nicht alle nötigen Felder wurden ausgefüllt.");
        return;
    }

    // Tagebuch-Eintrag speichern
    eintraege.push({
        uebung: uebungen[index].titel,
        sets,
        wdh,
        gewicht,
        notizen
    });

    if (index < uebungen.length - 1) {
        index++;
        zeigeUebung();
    } else {
        // Am Ende: alles in localStorage speichern
        localStorage.setItem("tagebuchEintraege", JSON.stringify(eintraege));
        alert("Alle Einträge wurden gespeichert.");
        window.location.href = "../tagebuch/index.html";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    zeigeUebung();
    document.querySelector(".weiter-button").addEventListener("click", weiterKlicken);
});
