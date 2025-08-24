function openmenu(){ const s=document.getElementById("sidemenu"); if(s){ s.style.right="0"; document.body.style.overflow="hidden"; } }
function closemenu(){ const s=document.getElementById("sidemenu"); if(s){ s.style.right="-240px"; document.body.style.overflow=""; } }

const agreeChk   = document.getElementById("agreeChk");
const saveBtn    = document.getElementById("saveBtn");
const statusChip = document.getElementById("statusChip");
const printBtn   = document.getElementById("printBtn");

document.addEventListener("DOMContentLoaded", () => {
    const accepted = localStorage.getItem("verhaltensvereinbarung");
    if (accepted === "true") {
        statusChip.hidden = false;
        if (agreeChk) agreeChk.checked = true;
        if (saveBtn) saveBtn.disabled = true;
    }
});

agreeChk?.addEventListener("change", () => {
    saveBtn.disabled = !agreeChk.checked;
});

saveBtn?.addEventListener("click", () => {
    if (!agreeChk.checked) return;
    localStorage.setItem("verhaltensvereinbarung", "true");
    statusChip.hidden = false;
    saveBtn.disabled = true;
    alert("Vielen Dank! Deine Zustimmung wurde gespeichert.");
});

