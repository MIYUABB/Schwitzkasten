// --- index.html ---
const plansList = document.getElementById('plansList');
if (plansList) {
    const plans = JSON.parse(localStorage.getItem("lehrerPlans") || "[]");
    plans.forEach((plan, index) => {
        const div = document.createElement("div");
        div.textContent = plan.title || `Trainingsplan ${index + 1}`;
        div.onclick = () => {
            localStorage.setItem("editPlanIndex", index);
            window.location.href = "erstellen.html";
        };
        plansList.appendChild(div);
    });
}

// --- erstellen.html ---
function loadPlan() {
    const index = localStorage.getItem("editPlanIndex");
    if (index !== null) {
        const plans = JSON.parse(localStorage.getItem("lehrerPlans") || "[]");
        const plan = plans[index];
        document.getElementById("muskelgruppe").value = plan.title;
        const tbody = document.querySelector("tbody");
        plan.exercises.forEach(row => {
            const tr = document.createElement("tr");
            for (const cell of row) {
                const td = document.createElement("td");
                td.innerHTML = `<input type="text" value="${cell}">`;
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        });
    }
}
if (document.getElementById("planTable")) loadPlan();

function addRow() {
    const tbody = document.querySelector("tbody");
    const tr = document.createElement("tr");
    for (let i = 0; i < 6; i++) {
        const td = document.createElement("td");
        td.innerHTML = `<input type="text" />`;
        tr.appendChild(td);
    }
    tbody.appendChild(tr);
}

function savePlan() {
    const title = document.getElementById("muskelgruppe").value;
    const rows = document.querySelectorAll("tbody tr");
    const exercises = [];
    rows.forEach(tr => {
        const values = Array.from(tr.querySelectorAll("input")).map(input => input.value);
        exercises.push(values);
    });

    let plans = JSON.parse(localStorage.getItem("lehrerPlans") || "[]");
    const index = localStorage.getItem("editPlanIndex");

    const newPlan = { title, exercises };
    if (index !== null) {
        plans[index] = newPlan;
    } else {
        plans.push(newPlan);
    }

    localStorage.setItem("lehrerPlans", JSON.stringify(plans));
    localStorage.removeItem("editPlanIndex");
    alert("Plan gespeichert");
    window.location.href = "index.html";
}

function cancelChanges() {
    alert("Änderungen gespeichert");
    window.location.href = "index.html";
}

function deletePlan() {
    if (confirm("Möchtest du den Plan wirklich löschen?")) {
        let plans = JSON.parse(localStorage.getItem("lehrerPlans") || "[]");
        const index = localStorage.getItem("editPlanIndex");
        if (index !== null) {
            plans.splice(index, 1);
            localStorage.setItem("lehrerPlans", JSON.stringify(plans));
        }
        localStorage.removeItem("editPlanIndex");
        window.location.href = "index.html";
    }
}

// Buttons dynamisch verbinden (nach Laden des DOMs)
document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addRowBtn");
    const saveBtn = document.getElementById("saveBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    if (addBtn) addBtn.addEventListener("click", addRow);
    if (saveBtn) saveBtn.addEventListener("click", savePlan);
    if (cancelBtn) cancelBtn.addEventListener("click", cancelChanges);
});
