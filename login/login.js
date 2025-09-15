function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const email = document.getElementById("loginEmail").value.toLowerCase();
    const password = document.getElementById("loginPassword").value;

    if (!(email && password)) {
        alert("Bitte gültige Zugangsdaten eingeben.");
        return false;
    }

    const [localPart, domain] = email.split("@");
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
    try {
        localStorage.setItem("rolle", account.rolle);
        localStorage.setItem("vorname", account.vorname);
        localStorage.setItem("nachname", account.nachname);
    } catch {}

    window.location.href = "../homepage/index.html";
    return false;
}
<script>
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        alert("Bitte gültige Zugangsdaten eingeben.");
        return false;
    }

    let role;
    const domain = email.split("@")[1]?.toLowerCase() || "";

    // 1. Domainbasiert
    if (domain === "ksh.ch") {
        role = "lehrer";
    } else if (domain === "student.ksh.ch") {
        role = "schueler";
    }

    // 2. Fallback per Stichwort im lokalen Teil
    if (!role) {
        const localPart = email.split("@")[0];
        if (/lehrer|teacher/i.test(localPart)) {
            role = "lehrer";
        } else if (/schueler|student/i.test(localPart)) {
            role = "schueler";
        }
    }

    if (!role) {
        alert("Unbekannte E Mail Domain oder Rolle konnte nicht ermittelt werden.");
        return false;
    }

    try {
        localStorage.setItem("rolle", account.rolle);
        localStorage.setItem("vorname", account.vorname);
        localStorage.setItem("nachname", account.nachname);
        localStorage.setItem("rolle", role);
    } catch {}

    window.location.href = "../homepage/index.html";
    return false;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function handleRegister(event) {
    event.preventDefault();

    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("registerPasswordConfirm").value;

    if (password !== confirmPassword) {
        alert("Die Passwoerter stimmen nicht überein.");
        return false;
    }

    if (email && password) {
        alert("Registrierung erfolgreich!");
        showLogin();
    } else {
        alert("Bitte alle Felder ausfüllen.");
    }
    return false;
}

function showRegister() {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    loginForm.classList.add("hidden");
    setTimeout(() => {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
        setTimeout(() => registerForm.classList.remove("hidden"), 50);
    }, 500);
}

function showLogin() {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    registerForm.classList.add("hidden");
    setTimeout(() => {
        registerForm.style.display = "none";
        loginForm.style.display = "block";
        setTimeout(() => loginForm.classList.remove("hidden"), 50);
    }, 500);
}
</script>
