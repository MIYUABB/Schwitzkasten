const rolle = "lehrer"; // oder "schueler" → später dynamisch mit Supabase setzen

// ---------- Navigation ----------
let sidemenu = document.getElementById("sidemenu");
function openmenu() {
    sidemenu.style.right = "0";
}
function closemenu() {
    sidemenu.style.right = "-200px";
}

// ---------- Lehrer: Freigabe-Tabelle ----------
const freigabeBlock = document.getElementById("verhaltensfreigabe");
const userTable = document.getElementById("userTable");

if (rolle === "lehrer") {
    freigabeBlock.style.display = "block";

    let users = JSON.parse(localStorage.getItem("users") || "[]");

    function updateTable() {
        userTable.innerHTML = "";

        const pending = users.filter(u => u.confirmed && !u.approved);

        pending.forEach((user, index) => {
            const realIndex = users.findIndex(u => u.name === user.name);
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${user.name}</td>
        <td><i class="fa-solid fa-check"></i></td>
        <td><i class="fa-solid fa-xmark"></i></td>
        <td><button onclick="approve(${realIndex})">Freigeben</button></td>
      `;
            userTable.appendChild(row);
        });
    }

    window.approve = function(index) {
        users[index].approved = true;
        localStorage.setItem("users", JSON.stringify(users));
        updateTable();
    };

    updateTable();
} else {
    // Schüler sieht keine Freigabe-Tabelle
    if (freigabeBlock) {
        freigabeBlock.style.display = "none";
    }
}
