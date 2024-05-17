document.addEventListener("DOMContentLoaded", () => {
    const profileButton = document.querySelector(".profile-button");
    const offCanvas = document.querySelector(".off-canvas");
    const offCanvasClose = document.querySelector(".off-canvas-close");
    const logoffButton = document.querySelector(".logoff-button");
    const drawButton = document.querySelector(".draw-button");

    profileButton.addEventListener("click", () => {
        offCanvas.classList.add("open");
    });

    offCanvasClose.addEventListener("click", () => {
        offCanvas.classList.remove("open");
    });




});
