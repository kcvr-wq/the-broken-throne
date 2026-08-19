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
/* =========================================
   معلومات الحرق
========================================= */

.spoiler-info {
    display: none;
    margin-top: 12px;
    padding: 12px;
    background: #111115;
    border: 1px solid #3b3429;
    border-radius: 6px;
    color: #cfcfcf;
    font-size: 14px;
    line-height: 1.8;
}

.spoiler-info.show {
    display: block;
}
