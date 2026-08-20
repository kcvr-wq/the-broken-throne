document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       نظام إعدادات موقع العرش المكسور
    ========================================= */

    const SETTINGS_KEY = "brokenThroneSettings";

    const defaultSettings = {
        theme: "dark",
        language: "ar",
        font: "naskh",
        size: "medium",
        spacing: "medium"
    };

    const fontOptions = {
        naskh: '"Noto Naskh Arabic", serif',
        cairo: '"Cairo", sans-serif',
        tajawal: '"Tajawal", sans-serif',
        amiri: '"Amiri", serif'
    };

    const sizeOptions = {
        small: "0.92",
        medium: "1",
        large: "1.10",
        xlarge: "1.20"
    };

    const spacingOptions = {
        tight: "1.75",
        medium: "1.95",
        wide: "2.20"
    };

    const translations = {
        ar: {
            settings: "الإعدادات",
            appearance: "المظهر",
            dark: "داكن",
            light: "فاتح",
            language: "اللغة",
            arabic: "العربية",
            english: "English",
            font: "نوع الخط",
            naskh: "نسخ",
            cairo: "كايرو",
            tajawal: "تجوال",
            amiri: "أميري",
            textSize: "حجم النص",
            small: "صغير",
            medium: "متوسط",
            large: "كبير",
            xlarge: "كبير جدًا",
            lineSpacing: "تباعد السطور",
            tight: "ضيق",
            wide: "واسع",
            close: "إغلاق",

            chapters: "الفصول",
            characters: "الشخصيات",
            world: "عالم الرواية",
            techniques: "التقنيات",
            about: "عن الرواية",
            previous: "السابق",
            next: "التالي",
            back: "العودة",
            spoiler: "حرق",
            hideSpoiler: "إخفاء الحرق"
        },

        en: {
            settings: "Settings",
            appearance: "Appearance",
            dark: "Dark",
            light: "Light",
            language: "Language",
            arabic: "العربية",
            english: "English",
            font: "Font",
            naskh: "Naskh",
            cairo: "Cairo",
            tajawal: "Tajawal",
            amiri: "Amiri",
            textSize: "Text Size",
            small: "Small",
            medium: "Medium",
            large: "Large",
            xlarge: "Extra Large",
            lineSpacing: "Line Spacing",
            tight: "Tight",
            wide: "Wide",
            close: "Close",

            chapters: "Chapters",
            characters: "Characters",
            world: "World",
            techniques: "Techniques",
            about: "About the Novel",
            previous: "Previous",
            next: "Next",
            back: "Back",
            spoiler: "Spoiler",
            hideSpoiler: "Hide Spoiler"
        }
    };

    function loadSettings() {
        try {
            const saved = localStorage.getItem(SETTINGS_KEY);

            if (!saved) {
                return { ...defaultSettings };
            }

            return {
                ...defaultSettings,
                ...JSON.parse(saved)
            };
        } catch (error) {
            return { ...defaultSettings };
        }
    }

    let settings = loadSettings();

    function saveSettings() {
        localStorage.setItem(
            SETTINGS_KEY,
            JSON.stringify(settings)
        );
    }

    /* =========================================
       إنشاء لوحة الإعدادات تلقائيًا
    ========================================= */

    function createSettingsPanel() {

        if (document.querySelector(".site-settings-wrapper")) {
            return;
        }

        const wrapper = document.createElement("div");
        wrapper.className = "site-settings-wrapper";

        wrapper.innerHTML = `
            <button
                type="button"
                class="settings-toggle"
                aria-label="الإعدادات"
                aria-expanded="false"
            >
                <span>⚙</span>
            </button>

            <div class="settings-panel" aria-hidden="true">

                <div class="settings-header">
                    <h2 data-setting-text="settings">الإعدادات</h2>

                    <button
                        type="button"
                        class="settings-close"
                        aria-label="إغلاق"
                    >
                        ×
                    </button>
                </div>

                <div class="settings-content">

                    <div class="settings-group">

                        <h3 data-setting-text="appearance">
                            المظهر
                        </h3>

                        <div class="settings-options">

                            <button
                                type="button"
                                class="setting-option"
                                data-setting="theme"
                                data-value="dark"
                                data-setting-text="dark"
                            >
                                داكن
                            </button>

                            <button
                                type="button"
                                class="setting-option"
                                data-setting="theme"
                                data-value="light"
                                data-setting-text="light"
                            >
                                فاتح
                            </button>

                        </div>

                    </div>

                    <div class="settings-group">

                        <h3 data-setting-text="language">
                            اللغة
                        </h3>

                        <div class="settings-options">

                            <button
                                type="button"
                                class="setting-option"
                                data-setting="language"
                                data-value="ar"
                                data-setting-text="arabic"
                            >
                                العربية
                            </button>

                            <button
                                type="button"
                                class="setting-option"
                                data-setting="language"
                                data-value="en"
                                data-setting-text="english"
                            >
                                English
                            </button>

                        </div>

                    </div>

                    <div class="settings-group">

                        <h3 data-setting-text="font">
                            نوع الخط
                        </h3>

                        <div class="settings-options settings-font-options">

                            <button
                                type="button"
                                class="setting-option"
                                data-setting="font"
                                data-value="naskh"
                                data-setting-text="naskh"
                            >
                                نسخ
                            </button>

                            <button
                                type="button"
                                class="setting-option"
                                data-setting="font"
                                data-value="cairo"
                                data-setting-text="cairo"
                            >
                                كايرو
                            </button>

                            <button
                                type="button"
                                class="setting-option"
                                data-setting="font"
                                data-value="tajawal"
                                data-setting-text="tajawal"
                            >
                                تجوال
                            </button>

                            <button
                                type="button"
                                class="setting-option"
                                data-setting="font"
                                data-value="amiri"
                                data-setting-text="amiri"
                            >
                                أميري
                            </button>

                        </div>

                    </div>

                    <div class="settings-group">

                        <h3 data-setting-text="textSize">
                            حجم النص
                        </h3>

                        <div class="settings-options">

                            <button
                                type="button"
                                class="setting-option"
                                data-setting="size"
                                data-value="small"
                                data-setting-text="small"
                            >
                                صغير
                            </button>

                            <button
                                type="button"
                                class="setting-option"
                                data-setting="size"
                                data-value="medium"
                                data-setting-text="medium"
                            >
                                متوسط
                            </button>

                            <button
                                type="button"
                                class="setting-option"
                                data-setting="size"
                                data-value="large"
                                data-setting-text="large"
                            >
                                كبير
                            </button>

                            <button
                                type="button"
                                class="setting-option"
                                data-setting="size"
                                data-value="xlarge"
                                data-setting-text="xlarge"
                            >
                                كبير جدًا
                            </button>

                        </div>

                    </div>

                    <div class="settings-group">

                        <h3 data-setting-text="lineSpacing">
                            تباعد السطور
                        </h3>

                        <div class="settings-options">

                            <button
                                type="button"
                                class="setting-option"
                                data-setting="spacing"
                                data-value="tight"
                                data-setting-text="tight"
                            >
                                ضيق
                            </button>

                            <button
                                type="button"
                                class="setting-option"
                                data-setting="spacing"
                                data-value="medium"
                                data-setting-text="medium"
                            >
                                متوسط
                            </button>

                            <button
                                type="button"
                                class="setting-option"
                                data-setting="spacing"
                                data-value="wide"
                                data-setting-text="wide"
                            >
                                واسع
                            </button>

                        </div>

                    </div>

                </div>

                <button
                    type="button"
                    class="settings-close-bottom"
                    data-setting-text="close"
                >
                    إغلاق
                </button>

            </div>
        `;

        document.body.appendChild(wrapper);

        const toggle = wrapper.querySelector(".settings-toggle");
        const panel = wrapper.querySelector(".settings-panel");
        const closeButtons = wrapper.querySelectorAll(
            ".settings-close, .settings-close-bottom"
        );

        toggle.addEventListener("click", () => {

            const isOpen = panel.classList.toggle("show");

            panel.setAttribute(
                "aria-hidden",
                String(!isOpen)
            );

            toggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });

        closeButtons.forEach((button) => {

            button.addEventListener("click", () => {

                panel.classList.remove("show");

                panel.setAttribute(
                    "aria-hidden",
                    "true"
                );

                toggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            });

        });

        document.addEventListener("click", (event) => {

            if (
                !wrapper.contains(event.target)
            ) {
                panel.classList.remove("show");

                panel.setAttribute(
                    "aria-hidden",
                    "true"
                );

                toggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }

        });

        wrapper
            .querySelectorAll(".setting-option")
            .forEach((button) => {

                button.addEventListener("click", () => {

                    const settingName =
                        button.dataset.setting;

                    const value =
                        button.dataset.value;

                    settings[settingName] = value;

                    saveSettings();

                    applySettings();
                });

            });
    }

    /* =========================================
       تطبيق الإعدادات
    ========================================= */

    function applySettings() {

        const root = document.documentElement;
        const body = document.body;

        /* المظهر */

        body.classList.toggle(
            "light-theme",
            settings.theme === "light"
        );

        body.classList.toggle(
            "dark-theme",
            settings.theme === "dark"
        );

        /* الخط */

        root.style.setProperty(
            "--reader-font",
            fontOptions[settings.font]
        );

        root.style.setProperty(
            "--reader-size",
            sizeOptions[settings.size]
        );

        root.style.setProperty(
            "--reader-spacing",
            spacingOptions[settings.spacing]
        );

        /* اللغة */

        root.lang = settings.language;

        root.dir = settings.language === "ar"
            ? "rtl"
            : "ltr";

        updateTranslations();

        updateActiveButtons();
    }

    /* =========================================
       ترجمة عناصر الواجهة
    ========================================= */

    function updateTranslations() {

        const currentLanguage =
            translations[settings.language];

        document
            .querySelectorAll("[data-setting-text]")
            .forEach((element) => {

                const key =
                    element.dataset.settingText;

                if (
                    currentLanguage &&
                    currentLanguage[key]
                ) {
                    element.textContent =
                        currentLanguage[key];
                }

            });

        /*
         * ترجمة النصوص المشتركة الموجودة
         * في الصفحات الأخرى بدون الحاجة
         * لتعديل كل صفحة الآن.
         */

        const textMap = {
            ar: translations.ar,
            en: translations.en
        };

        const currentMap =
            textMap[settings.language];

        const replacements = {
            "الفصول": currentMap.chapters,
            "الشخصيات": currentMap.characters,
            "عالم الرواية": currentMap.world,
            "التقنيات": currentMap.techniques,
            "عن الرواية": currentMap.about,
            "السابق": currentMap.previous,
            "التالي": currentMap.next,
            "العودة": currentMap.back,
            "حرق": currentMap.spoiler,
            "إخفاء الحرق": currentMap.hideSpoiler
        };

        document
            .querySelectorAll(
                "a, button, h1, h2, h3, h4, span"
            )
            .forEach((element) => {

                if (
                    element.closest(".settings-panel")
                ) {
                    return;
                }

                const text =
                    element.textContent.trim();

                if (replacements[text]) {

                    element.textContent =
                        replacements[text];
                }
            });

        /*
         * النص الأصلي في الصفحة الرئيسية.
         */

        const subtitle =
            document.querySelector(".subtitle");

        if (subtitle) {

            subtitle.textContent =
                settings.language === "ar"
                    ? "حكاية في عالمٍ تحكمه القوة"
                    : "A tale in a world ruled by power";
        }

        const aboutParagraphs =
            document.querySelectorAll(".about p");

        if (
            settings.language === "en" &&
            aboutParagraphs.length >= 5
        ) {

            const englishAbout = [
                "In a world ruled by power, there is no place for the weak… and no mercy for those who fall.",
                "Rin, a young child, finds himself alone in a harsh world, trying to forge his own path through life and the conflicts around him.",
                "As he grows, he begins to understand the world through what he sees and experiences, one step at a time.",
                "But the past leaves no one behind, and some doors that were closed years ago may open once again.",
                "In a world where the balance of power shifts, the path to the top may be longer and harsher than Rin ever imagined.",
                "And this… is the story of The Broken Throne."
            ];

            aboutParagraphs.forEach((paragraph, index) => {

                if (englishAbout[index]) {
                    paragraph.textContent =
                        englishAbout[index];
                }

            });

        }

        if (
            settings.language === "ar" &&
            aboutParagraphs.length >= 5
        ) {

            const arabicAbout = [
                "في عالمٍ تحكمه القوة، لا مكان للضعفاء… ولا رحمة لمن يسقط.",
                "رين، طفل صغير يجد نفسه وحيدًا في عالمٍ قاسٍ، يحاول أن يشق طريقه بنفسه وسط الحياة والصراعات من حوله. وبينما يكبر، يبدأ في فهم العالم من خلال ما يراه ويعيشه، خطوةً بعد أخرى.",
                "لكن الماضي لا يترك أحدًا خلفه، وبعض الأبواب التي أُغلقت منذ سنوات قد تُفتح من جديد.",
                "ففي عالمٍ تتغير فيه موازين القوة، قد يكون الطريق نحو القمة أطول وأقسى مما يتخيل رين.",
                "وهذه… حكاية العرش المكسور."
            ];

            aboutParagraphs.forEach((paragraph, index) => {

                if (arabicAbout[index]) {
                    paragraph.textContent =
                        arabicAbout[index];
                }

            });
        }

        const title =
            document.querySelector(".hero h1");

        if (title) {

            title.textContent =
                settings.language === "ar"
                    ? "العرش المكسور"
                    : "The Broken Throne";
        }

        document.title =
            settings.language === "ar"
                ? "العرش المكسور"
                : "The Broken Throne";
    }

    /* =========================================
       تحديد الخيار الحالي
    ========================================= */

    function updateActiveButtons() {

        document
            .querySelectorAll(".setting-option")
            .forEach((button) => {

                const settingName =
                    button.dataset.setting;

                const value =
                    button.dataset.value;

                button.classList.toggle(
                    "active",
                    settings[settingName] === value
                );

            });
    }

    /* =========================================
       زر الحرق — النظام القديم
    ========================================= */

    const spoilerButtons =
        document.querySelectorAll(".spoiler-button");

    spoilerButtons.forEach((button) => {

        button.addEventListener("click", (event) => {

            event.preventDefault();
            event.stopPropagation();

            const characterCard =
                button.closest(".character-card");

            const spoilerSection =
                button.closest(".character-spoiler-section");

            const container =
                characterCard || spoilerSection;

            if (!container) {
                return;
            }

            const spoilerInfo =
                container.querySelector(".spoiler-info");

            if (!spoilerInfo) {
                return;
            }

            spoilerInfo.classList.toggle("show");

            if (spoilerInfo.classList.contains("show")) {

                button.textContent =
                    settings.language === "ar"
                        ? "إخفاء الحرق"
                        : "Hide Spoiler";

            } else {

                button.textContent =
                    settings.language === "ar"
                        ? "حرق"
                        : "Spoiler";
            }

        });

    });

    /* =========================================
       بدء النظام
    ========================================= */

    createSettingsPanel();

    applySettings();

});
