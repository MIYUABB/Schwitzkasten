const table = document.getElementById("userTable");
let users = JSON.parse(localStorage.getItem("users") || "[]");

function updateTable() {
    table.innerHTML = "";
    users.forEach((user, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.confirmed ? "✅" : "❌"}</td>
      <td>${user.approved ? "✅" : "❌"}</td>
      <td>
        ${!user.approved ? `<button onclick="approve(${index})">Freigeben</button>` : ""}
      </td>
    `;
        table.appendChild(row);
    });
}

function approve(index) {
    users[index].approved = true;
    localStorage.setItem("users", JSON.stringify(users));
    updateTable();
}

updateTable();
