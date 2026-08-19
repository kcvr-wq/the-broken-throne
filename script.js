// =========================================
// نظام إظهار وإخفاء الحرق
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    const spoilerButtons = document.querySelectorAll(".spoiler-button");

    spoilerButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            const characterCard = button.closest(".character-card");

            if (!characterCard) return;

            const spoilerInfo = characterCard.querySelector(".spoiler-info");

            if (!spoilerInfo) return;

            spoilerInfo.classList.toggle("show");

            button.textContent = spoilerInfo.classList.contains("show")
                ? "إخفاء الحرق"
                : "حرق";
        });
    });
});
