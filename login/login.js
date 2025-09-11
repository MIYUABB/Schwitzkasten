function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value.toLowerCase();
    const password = document.getElementById("loginPassword").value;

    if (!(email && password)) {
        alert("Bitte gültige Zugangsdaten eingeben.");
        return false;
    }

    const accounts = JSON.parse(localStorage.getItem("accounts") || "{}");
    const account = accounts[email];
    if (!account || account.password !== password) {
        alert("Ungültige Zugangsdaten oder Benutzer nicht registriert.");
        return false;
    }

    const domain = email.split("@")[1]?.toLowerCase();
    if (domain !== "ksh.ch" && domain !== "student.ksh.ch") {
        alert("Unbekannte E-Mail-Domain.");
        return false;
    }

    try {
        localStorage.setItem("rolle", account.rolle);
        localStorage.setItem("vorname", account.vorname);
        localStorage.setItem("nachname", account.nachname);
    } catch {}

    window.location.href = "../homepage/index.html";
    return false;
}
