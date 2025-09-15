
(function () {
    const sidemenu = document.getElementById("sidemenu");
    if (!sidemenu) return;

    function openmenu() {
        sidemenu.style.right = "0";
        document.body.style.overflow = "hidden";
    }
    function closemenu() {
        sidemenu.style.right = "-240px";
        document.body.style.overflow = "";
    }

    window.openmenu = openmenu;
    window.closemenu = closemenu;

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closemenu();
    });
    sidemenu.addEventListener("click", (e) => {
        if (e.target.closest("a")) closemenu();
    });

    const mq = window.matchMedia("(min-width: 768px)");
    function handleMQ(ev) {
        if (ev.matches) {
            sidemenu.style.right = "auto";
            document.body.style.overflow = "";
        } else {
            sidemenu.style.right = "-240px";
        }
    }
    handleMQ(mq);
    mq.addEventListener("change", handleMQ);
})();
