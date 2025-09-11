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
        localStorage.setItem("rolle", role);
    } catch {}

    window.location.href = "../homepage/index.html";
    return false;
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
