function handleSignup(event) {
    event.preventDefault();
    const email = document.getElementById("signupEmail").value.trim().toLowerCase();
    const password = document.getElementById("signupPassword").value;

    const [localPart, domain] = email.split("@");
    const nameParts = localPart.split(".");
    if (!localPart || nameParts.length !== 2) {
        alert("E-Mail muss das Format vorname.nachname@ksh.ch besitzen.");
        return false;
    }

    let rolle;
    if (domain === "ksh.ch") {
        rolle = "lehrer";
    } else if (domain === "student.ksh.ch") {
        rolle = "schueler";
    } else {
        alert("Unbekannte E-Mail-Domain.");
        return false;
    }

    const vorname = capitalize(nameParts[0]);
    const nachname = capitalize(nameParts[1]);

    const accounts = JSON.parse(localStorage.getItem("accounts") || "{}");
    if (accounts[email]) {
        alert("Benutzer existiert bereits.");
        return false;
    }
    accounts[email] = { password, rolle, vorname, nachname };
    try {
        localStorage.setItem("accounts", JSON.stringify(accounts));
    } catch {}

    alert("Registrierung erfolgreich! Bitte melde dich an.");
    window.location.href = "../login/index.html";
    return false;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
