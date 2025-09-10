function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (email && password) {
        const role = /lehrer|teacher/i.test(email) ? "lehrer" : "schueler";
        try {
            localStorage.setItem("rolle", role);
        } catch {}
        window.location.href = "../homepage/index.html"; // Zielseite anpassen
    } else {
        alert("Bitte gültige Zugangsdaten eingeben.");
    }
    return false;
}

function handleRegister(event) {
    event.preventDefault();
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("registerPasswordConfirm").value;

    if (password !== confirmPassword) {
        alert("Die Passwörter stimmen nicht überein.");
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
