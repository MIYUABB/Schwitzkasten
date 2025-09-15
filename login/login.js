function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    if (!(email && password)) {
        alert("Bitte gültige Zugangsdaten eingeben.");
        return false;
    }

    const [localPart, domain] = email.split("@");
    if (domain !== "ksh.ch" && domain !== "student.ksh.ch") {
        alert("Unbekannte E-Mail-Domain.");
        return false;
    }

    const accounts = JSON.parse(localStorage.getItem("accounts") || "{}");
    let account = accounts[email];

    if (!account) {
        const nameParts = localPart.split(".");
        if (nameParts.length !== 2) {
            alert("E-Mail muss das Format vorname.nachname@ksh.ch besitzen.");
            return false;
        }
        const rolle = domain === "ksh.ch" ? "lehrer" : "schueler";
        account = {
            password,
            rolle,
            vorname: capitalize(nameParts[0]),
            nachname: capitalize(nameParts[1]),
        };
        accounts[email] = account;
        try {
            localStorage.setItem("accounts", JSON.stringify(accounts));
        } catch {}
    } else if (account.password !== password) {
        alert("Ungültige Zugangsdaten oder Benutzer nicht registriert.");
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

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
