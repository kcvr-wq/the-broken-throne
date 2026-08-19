document.addEventListener("DOMContentLoaded", () => {

    const spoilerButtons = document.querySelectorAll(".spoiler-button");

    spoilerButtons.forEach((button) => {

        button.addEventListener("click", (event) => {

            event.preventDefault();
            event.stopPropagation();

            const characterCard = button.closest(".character-card");
            const spoilerSection = button.closest(".character-spoiler-section");

            let container = characterCard || spoilerSection;

            if (!container) return;

            const spoilerInfo = container.querySelector(".spoiler-info");

            if (!spoilerInfo) return;

            spoilerInfo.classList.toggle("show");

            if (spoilerInfo.classList.contains("show")) {
                button.textContent = "إخفاء الحرق";
            } else {
                button.textContent = "حرق";
            }

        });

    });

});
