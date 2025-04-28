function showForm() {
    document.getElementById("entryForm").style.display = "flex";
}

function addEntry() {
    const tableBody = document.getElementById("tableBody");
    const values = [
        document.getElementById("datum").value,
        document.getElementById("dauer").value,
        document.getElementById("übung").value,
        document.getElementById("sets").value,
        document.getElementById("gewicht").value,
        document.getElementById("wh").value,
        document.getElementById("notizen").value
    ];

    const newRow = document.createElement("tr");
    values.forEach(value => {
        const td = document.createElement("td");
        td.textContent = value;
        newRow.appendChild(td);
    });

    const actionTd = document.createElement("td");
    actionTd.innerHTML = `
    <button class="edit" onclick="editRow(this)">Bearbeiten</button>
    <button class="delete" onclick="deleteRow(this)">Löschen</button>
  `;
    newRow.appendChild(actionTd);

    tableBody.insertBefore(newRow, tableBody.firstChild);

    document.getElementById("entryForm").style.display = "none";
    document.querySelectorAll("#entryForm input").forEach(input => input.value = "");
}

function deleteRow(button) {
    const row = button.closest("tr");
    row.remove();
}

function editRow(button) {
    const row = button.closest("tr");
    const cells = row.querySelectorAll("td");

    for (let i = 0; i < cells.length - 1; i++) {
        const text = cells[i].textContent;
        cells[i].innerHTML = `<input type="text" value="${text}">`;
    }

    const actionTd = cells[cells.length - 1];
    actionTd.innerHTML = `
    <button class="save" onclick="saveRow(this)">Speichern</button>
    <button class="delete" onclick="deleteRow(this)">Löschen</button>
  `;
}

function saveRow(button) {
    const row = button.closest("tr");
    const cells = row.querySelectorAll("td");

    for (let i = 0; i < cells.length - 1; i++) {
        const input = cells[i].querySelector("input");
        if (input) cells[i].textContent = input.value;
    }

    const actionTd = cells[cells.length - 1];
    actionTd.innerHTML = `
    <button class="edit" onclick="editRow(this)">Bearbeiten</button>
    <button class="delete" onclick="deleteRow(this)">Löschen</button>
  `;
}

function searchTable() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const rows = document.querySelectorAll("#trainingTable tbody tr");

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(input) ? "" : "none";
    });
}

function filterByDate() {
    const filterDate = document.getElementById("dateFilter").value;
    const rows = document.querySelectorAll("#trainingTable tbody tr");

    rows.forEach(row => {
        const dateCell = row.cells[0].textContent;
        row.style.display = dateCell.includes(filterDate) ? "" : "none";
    });
}
