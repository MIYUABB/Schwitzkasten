const checkbox = document.getElementById("confirm");
const button = document.getElementById("submitBtn");
const username = document.getElementById("username");

function updateButtonState() {
    button.disabled = !(checkbox.checked && username.value.trim().length > 0);
}

checkbox.addEventListener("change", updateButtonState);
username.addEventListener("input", updateButtonState);

button.addEventListener("click", () => {
    const name = username.value.trim();
    if (!name) return;

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const already = users.find(u => u.name === name);

    if (already) {
        alert("Du hast bereits bestätigt.");
        return;
    }

    users.push({ name, confirmed: true, approved: false });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Bestätigt. Bitte warte auf Freigabe durch die Lehrperson.");
    checkbox.checked = false;
    username.value = "";
    updateButtonState();
});
