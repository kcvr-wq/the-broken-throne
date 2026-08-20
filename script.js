document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       نظام المجلدات — فتح وإغلاق سلس
    ========================================= */

    function createVolumeFolders() {

        const folders =
            document.querySelectorAll(".volume-folder");

        if (!folders.length) {
            return;
        }

        folders.forEach((folder) => {

            const summary =
                folder.querySelector("summary");

            const content =
                folder.querySelector(".chapter-list");

            if (!summary || !content) {
                return;
            }


            /* -----------------------------------------
               منع السلوك الافتراضي لـ details
            ----------------------------------------- */

            folder.removeAttribute("open");

            content.style.overflow = "hidden";
            content.style.maxHeight = "0px";
            content.style.opacity = "0";
            content.style.transform = "translateY(-10px)";
            content.style.paddingTop = "0px";
            content.style.paddingBottom = "0px";

            content.style.transition =
                "max-height 0.5s cubic-bezier(0.22, 1, 0.36, 1), " +
                "opacity 0.35s ease, " +
                "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), " +
                "padding 0.5s ease";

            let closeTimer = null;
            let isAnimating = false;


            /* -----------------------------------------
               فتح المجلد
            ----------------------------------------- */

            function openFolder() {

                if (closeTimer) {
                    clearTimeout(closeTimer);
                    closeTimer = null;
                }

                isAnimating = true;

                folder.setAttribute("open", "");

                content.style.maxHeight = "0px";
                content.style.opacity = "0";
                content.style.transform = "translateY(-10px)";
                content.style.paddingTop = "0px";
                content.style.paddingBottom = "0px";

                requestAnimationFrame(() => {

                    requestAnimationFrame(() => {

                        content.style.maxHeight =
                            content.scrollHeight + "px";

                        content.style.opacity = "1";

                        content.style.transform =
                            "translateY(0)";

                        content.style.paddingTop = "18px";

                        content.style.paddingBottom = "18px";

                    });

                });

                setTimeout(() => {

                    if (folder.hasAttribute("open")) {

                        content.style.maxHeight = "none";

                    }

                    isAnimating = false;

                }, 520);

            }


            /* -----------------------------------------
               إغلاق المجلد
            ----------------------------------------- */

            function closeFolder() {

                if (closeTimer) {
                    clearTimeout(closeTimer);
                    closeTimer = null;
                }

                isAnimating = true;

                content.style.maxHeight =
                    content.scrollHeight + "px";

                content.style.opacity = "1";

                content.style.transform =
                    "translateY(0)";

                content.style.paddingTop = "18px";

                content.style.paddingBottom = "18px";

                requestAnimationFrame(() => {

                    requestAnimationFrame(() => {

                        content.style.maxHeight = "0px";

                        content.style.opacity = "0";

                        content.style.transform =
                            "translateY(-10px)";

                        content.style.paddingTop = "0px";

                        content.style.paddingBottom = "0px";

                    });

                });

                closeTimer = setTimeout(() => {

                    folder.removeAttribute("open");

                    isAnimating = false;

                }, 500);

            }


            /* -----------------------------------------
               الضغط على المجلد
            ----------------------------------------- */

            summary.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    if (isAnimating) {
                        return;
                    }

                    if (folder.hasAttribute("open")) {

                        closeFolder();

                    } else {

                        openFolder();

                    }

                }
            );


            /* -----------------------------------------
               تحديث الارتفاع عند تغيير حجم الشاشة
            ----------------------------------------- */

            window.addEventListener(
                "resize",
                () => {

                    if (
                        folder.hasAttribute("open") &&
                        !isAnimating
                    ) {

                        content.style.maxHeight =
                            content.scrollHeight + "px";

                    }

                }
            );

        });

    }


    /* =========================================
       نظام الحرق
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

            let container =
                characterCard || spoilerSection;

            if (!container) return;

            const spoilerInfo =
                container.querySelector(".spoiler-info");

            if (!spoilerInfo) return;

            spoilerInfo.classList.toggle("show");

            if (spoilerInfo.classList.contains("show")) {

                button.textContent =
                    "إخفاء الحرق";

            } else {

                button.textContent =
                    "حرق";

            }

        });

    });


    /* =========================================
       تحميل الخطوط
    ========================================= */

    if (!document.querySelector("#broken-throne-fonts")) {

        const fontLink =
            document.createElement("link");

        fontLink.id =
            "broken-throne-fonts";

        fontLink.rel =
            "stylesheet";

        fontLink.href =
            "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;600;700;800&family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Tajawal:wght@400;500;700;800&display=swap";

        document.head.appendChild(fontLink);

    }


    /* =========================================
       مفاتيح التخزين
    ========================================= */

    const SITE_SETTINGS_KEY =
        "brokenThroneSiteSettings";

    const READER_SETTINGS_KEY =
        "brokenThroneReaderSettings";

    const LAST_CHAPTER_KEY =
        "brokenThroneLastChapter";


    /* =========================================
       الإعدادات الافتراضية للموقع
    ========================================= */

    const defaultSiteSettings = {

        theme: "dark",

        font: "naskh",

        size: "medium",

        spacing: "medium"

    };


    /* =========================================
       الإعدادات الافتراضية للفصل
    ========================================= */

    const defaultReaderSettings = {

        font: "naskh",

        size: "medium",

        spacing: "medium",

        width: "medium",

        paragraph: "medium",

        align: "right"

    };


    /* =========================================
       تحميل الإعدادات
    ========================================= */

    function loadSettings(key, defaults) {

        try {

            const saved =
                localStorage.getItem(key);

            if (!saved) {

                return {
                    ...defaults
                };

            }

            return {

                ...defaults,

                ...JSON.parse(saved)

            };

        } catch (error) {

            return {
                ...defaults
            };

        }

    }


    let siteSettings =
        loadSettings(
            SITE_SETTINGS_KEY,
            defaultSiteSettings
        );


    let readerSettings =
        loadSettings(
            READER_SETTINGS_KEY,
            defaultReaderSettings
        );


    /* =========================================
       حفظ إعدادات الموقع
    ========================================= */

    function saveSiteSettings() {

        localStorage.setItem(
            SITE_SETTINGS_KEY,
            JSON.stringify(siteSettings)
        );

    }


    /* =========================================
       حفظ إعدادات الفصل
    ========================================= */

    function saveReaderSettings() {

        localStorage.setItem(
            READER_SETTINGS_KEY,
            JSON.stringify(readerSettings)
        );

    }


    /* =========================================
       نظام تابع القراءة
    ========================================= */

    function getCurrentChapterData() {

        const chapterReader =
            document.querySelector(".chapter-reader");

        if (!chapterReader) {
            return null;
        }


        const path =
            window.location.pathname;


        const chapterMatch =
            path.match(/\/chapter-(\d+)\.html$/i);

        if (!chapterMatch) {
            return null;
        }


        const chapterNumber =
            Number(chapterMatch[1]);


        const titleElement =
            document.querySelector(".hero h1");


        const chapterTitle =
            titleElement
                ? titleElement.textContent.trim()
                : `الفصل ${chapterNumber}`;


        return {

            number:
                chapterNumber,

            title:
                chapterTitle,

            url:
                window.location.pathname,

            updatedAt:
                Date.now()

        };

    }


    function saveLastChapter() {

        const chapterData =
            getCurrentChapterData();

        if (!chapterData) {
            return;
        }


        try {

            localStorage.setItem(
                LAST_CHAPTER_KEY,
                JSON.stringify(chapterData)
            );

        } catch (error) {

            console.warn(
                "تعذر حفظ آخر فصل.",
                error
            );

        }

    }


    function loadLastChapter() {

        try {

            const saved =
                localStorage.getItem(
                    LAST_CHAPTER_KEY
                );

            if (!saved) {
                return null;
            }


            const data =
                JSON.parse(saved);


            if (
                !data ||
                !data.url ||
                !data.number
            ) {
                return null;
            }


            return data;

        } catch (error) {

            return null;

        }

    }


    function isHomePage() {

        const path =
            window.location.pathname;


        const normalizedPath =
            path.replace(/\/+$/, "");


        return (
            normalizedPath === "" ||
            normalizedPath === "/the-broken-throne" ||
            normalizedPath === "/the-broken-throne/index.html"
        );

    }


    function createContinueReading() {

        if (!isHomePage()) {
            return;
        }


        if (
            document.querySelector(
                ".continue-reading-card"
            )
        ) {
            return;
        }


        const navigation =
            document.querySelector(".navigation");

        if (!navigation) {
            return;
        }


        const savedChapter =
            loadLastChapter();


        const card =
            document.createElement("a");

        card.className =
            "continue-reading-card";


        /* -----------------------------------------
           إذا كان هناك فصل محفوظ
        ----------------------------------------- */

        if (
            savedChapter &&
            savedChapter.url
        ) {

            card.href =
                savedChapter.url;


            card.innerHTML = `

                <span class="continue-reading-label">
                    تابع القراءة
                </span>

                <span class="continue-reading-title">
                    ${escapeHTML(
                        savedChapter.title
                    )}
                </span>

                <span class="continue-reading-number">
                    الفصل ${String(
                        savedChapter.number
                    ).padStart(2, "0")}
                </span>

                <span class="continue-reading-arrow">
                    ←
                </span>

            `;

        }

        /* -----------------------------------------
           إذا لم يوجد فصل محفوظ
        ----------------------------------------- */

        else {

            card.href =
                "chapters/chapter-01.html";


            card.innerHTML = `

                <span class="continue-reading-label">
                    ابدأ القراءة
                </span>

                <span class="continue-reading-title">
                    الفصل الأول: الطفل الذي لم يخطئ
                </span>

                <span class="continue-reading-number">
                    الفصل 01
                </span>

                <span class="continue-reading-arrow">
                    ←
                </span>

            `;

        }


        navigation.parentNode.insertBefore(
            card,
            navigation
        );

    }


    /* =========================================
       حماية النص الذي يظهر داخل HTML
    ========================================= */

    function escapeHTML(text) {

        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =========================================
       إنشاء إعدادات الموقع
    ========================================= */

    function createSiteSettings() {

        if (
            document.querySelector(
                ".site-settings-wrapper"
            )
        ) {
            return;
        }


        const wrapper =
            document.createElement("div");

        wrapper.className =
            "site-settings-wrapper";


        wrapper.innerHTML = `

            <button
                type="button"
                class="site-settings-button"
                aria-label="الإعدادات"
                aria-expanded="false"
            >
                ⚙
            </button>


            <div
                class="site-settings-panel"
                aria-hidden="true"
            >

                <div class="settings-panel-header">

                    <h2>إعدادات الموقع</h2>

                    <button
                        type="button"
                        class="settings-panel-close"
                        aria-label="إغلاق"
                    >
                        ×
                    </button>

                </div>


                <div class="settings-group">

                    <h3>المظهر</h3>

                    <div class="settings-options">

                        <button
                            type="button"
                            class="settings-option"
                            data-site-setting="theme"
                            data-value="dark"
                        >
                            داكن
                        </button>

                        <button
                            type="button"
                            class="settings-option"
                            data-site-setting="theme"
                            data-value="light"
                        >
                            فاتح
                        </button>

                    </div>

                </div>


                <div class="settings-group">

                    <h3>نوع الخط</h3>

                    <div class="settings-options">

                        <button
                            type="button"
                            class="settings-option"
                            data-site-setting="font"
                            data-value="naskh"
                        >
                            Noto Naskh
                        </button>

                        <button
                            type="button"
                            class="settings-option"
                            data-site-setting="font"
                            data-value="cairo"
                        >
                            Cairo
                        </button>

                        <button
                            type="button"
                            class="settings-option"
                            data-site-setting="font"
                            data-value="tajawal"
                        >
                            Tajawal
                        </button>

                        <button
                            type="button"
                            class="settings-option"
                            data-site-setting="font"
                            data-value="amiri"
                        >
                            Amiri
                        </button>

                    </div>

                </div>


                <div class="settings-group">

                    <h3>حجم النص</h3>

                    <div class="settings-options">

                        <button
                            type="button"
                            class="settings-option"
                            data-site-setting="size"
                            data-value="small"
                        >
                            صغير
                        </button>

                        <button
                            type="button"
                            class="settings-option"
                            data-site-setting="size"
                            data-value="medium"
                        >
                            متوسط
                        </button>

                        <button
                            type="button"
                            class="settings-option"
                            data-site-setting="size"
                            data-value="large"
                        >
                            كبير
                        </button>

                        <button
                            type="button"
                            class="settings-option"
                            data-site-setting="size"
                            data-value="xlarge"
                        >
                            كبير جدًا
                        </button>

                    </div>

                </div>


                <div class="settings-group">

                    <h3>تباعد السطور</h3>

                    <div class="settings-options">

                        <button
                            type="button"
                            class="settings-option"
                            data-site-setting="spacing"
                            data-value="tight"
                        >
                            ضيق
                        </button>

                        <button
                            type="button"
                            class="settings-option"
                            data-site-setting="spacing"
                            data-value="medium"
                        >
                            متوسط
                        </button>

                        <button
                            type="button"
                            class="settings-option"
                            data-site-setting="spacing"
                            data-value="wide"
                        >
                            واسع
                        </button>

                    </div>

                </div>


                <button
                    type="button"
                    class="settings-reset"
                    data-reset-site
                >
                    إعادة إعدادات الموقع
                </button>

            </div>
        `;


        document.body.appendChild(wrapper);


        const openButton =
            wrapper.querySelector(
                ".site-settings-button"
            );

        const panel =
            wrapper.querySelector(
                ".site-settings-panel"
            );

        const closeButton =
            wrapper.querySelector(
                ".settings-panel-close"
            );

        const resetButton =
            wrapper.querySelector(
                "[data-reset-site]"
            );


        function closePanel() {

            panel.classList.remove("show");

            panel.setAttribute(
                "aria-hidden",
                "true"
            );

            openButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }


        openButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                const isOpen =
                    panel.classList.toggle("show");

                panel.setAttribute(
                    "aria-hidden",
                    String(!isOpen)
                );

                openButton.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );

            }
        );


        closeButton.addEventListener(
            "click",
            closePanel
        );


        document.addEventListener(
            "click",
            (event) => {

                if (!wrapper.contains(event.target)) {
                    closePanel();
                }

            }
        );


        wrapper
            .querySelectorAll(
                "[data-site-setting]"
            )
            .forEach((button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const setting =
                            button.dataset.siteSetting;

                        const value =
                            button.dataset.value;

                        siteSettings[setting] =
                            value;

                        saveSiteSettings();

                        applySiteSettings();

                    }
                );

            });


        resetButton.addEventListener(
            "click",
            () => {

                siteSettings = {
                    ...defaultSiteSettings
                };

                saveSiteSettings();

                applySiteSettings();

            }
        );

    }


    /* =========================================
       تطبيق إعدادات الموقع
    ========================================= */

    function applySiteSettings() {

        const root =
            document.documentElement;

        const body =
            document.body;


        const fonts = {

            naskh:
                '"Noto Naskh Arabic", "Segoe UI", Tahoma, sans-serif',

            cairo:
                '"Cairo", "Segoe UI", Tahoma, sans-serif',

            tajawal:
                '"Tajawal", "Segoe UI", Tahoma, sans-serif',

            amiri:
                '"Amiri", "Noto Naskh Arabic", serif'

        };


        const sizes = {

            small: "0.92",

            medium: "1",

            large: "1.10",

            xlarge: "1.20"

        };


        const spacings = {

            tight: "1.75",

            medium: "1.90",

            wide: "2.15"

        };


        root.style.setProperty(
            "--site-font",
            fonts[siteSettings.font]
        );


        root.style.setProperty(
            "--site-text-scale",
            sizes[siteSettings.size]
        );


        root.style.setProperty(
            "--site-line-height",
            spacings[siteSettings.spacing]
        );


        body.classList.toggle(
            "light-theme",
            siteSettings.theme === "light"
        );


        body.classList.toggle(
            "dark-theme",
            siteSettings.theme === "dark"
        );


        document
            .querySelectorAll(
                "[data-site-setting]"
            )
            .forEach((button) => {

                const setting =
                    button.dataset.siteSetting;

                const value =
                    button.dataset.value;

                button.classList.toggle(
                    "active",
                    siteSettings[setting] === value
                );

            });

    }


    /* =========================================
       إنشاء إعدادات الفصل
       تظهر فقط في صفحات الفصول
    ========================================= */

    function createReaderSettings() {

        const reader =
            document.querySelector(
                ".chapter-reader"
            );

        if (!reader) {
            return;
        }


        if (
            document.querySelector(
                ".reader-settings-wrapper"
            )
        ) {
            return;
        }


        const wrapper =
            document.createElement("div");

        wrapper.className =
            "reader-settings-wrapper";


        wrapper.innerHTML = `

            <button
                type="button"
                class="reader-settings-button"
                aria-label="إعدادات الفصل"
                aria-expanded="false"
            >
                Aa
            </button>


            <div
                class="reader-settings-panel"
                aria-hidden="true"
            >

                <div class="settings-panel-header">

                    <h2>إعدادات الفصل</h2>

                    <button
                        type="button"
                        class="reader-settings-close"
                        aria-label="إغلاق"
                    >
                        ×
                    </button>

                </div>


                <div class="settings-group">

                    <h3>نوع الخط</h3>

                    <div class="settings-options">

                        <button
                            type="button"
                            class="reader-option"
                            data-reader-setting="font"
                            data-value="naskh"
                        >
                            Noto Naskh
                        </button>

                        <button
                            type="button"
                            class="reader-option"
                            data-reader-setting="font"
                            data-value="cairo"
                        >
                            Cairo
                        </button>

                        <button
                            type="button"
                            class="reader-option"
                            data-reader-setting="font"
                            data-value="tajawal"
                        >
                            Tajawal
                        </button>

                        <button
                            type="button"
                            class="reader-option"
                            data-reader-setting="font"
                            data-value="amiri"
                        >
                            Amiri
                        </button>

                    </div>

                </div>


                <div class="settings-group">

                    <h3>حجم النص</h3>

                    <div class="settings-options">

                        <button
                            type="button"
                            class="reader-option"
                            data-reader-setting="size"
                            data-value="small"
                        >
                            صغير
                        </button>

                        <button
                            type="button"
                            class="reader-option"
                            data-reader-setting="size"
                            data-value="medium"
                        >
                            متوسط
                        </button>

                        <button
                            type="button"
                            class="reader-option"
                            data-reader-setting="size"
                            data-value="large"
                        >
                            كبير
                        </button>

                        <button
                            type="button"
                            class="reader-option"
                            data-reader-setting="size"
                            data-value="xlarge"
                        >
                            كبير جدًا
                        </button>

                    </div>

                </div>


                <div class="settings-group">

                    <h3>تباعد السطور</h3>

                    <div class="settings-options">

                        <button
                            type="button"
                            class="reader-option"
                            data-reader-setting="spacing"
                            data-value="tight"
                        >
                            ضيق
                        </button>

                        <button
                            type="button"
                            class="reader-option"
                            data-reader-setting="spacing"
                            data-value="medium"
                        >
                            متوسط
                        </button>

                        <button
                            type="button"
                            class="reader-option"
                            data-reader-setting="spacing"
                            data-value="wide"
                        >
                            واسع
                        </button>

                    </div>

                </div>


                <div class="settings-group">

                    <h3>عرض القراءة</h3>

                    <div class="settings-options">

                        <button
                            type="button"
                            class="reader-option"
                            data-reader-setting="width"
                            data-value="narrow"
                        >
                            ضيق
                        </button>

                        <button
                            type="button"
                            class="reader-option"
                            data-reader-setting="width"
                            data-value="medium"
                        >
                            متوسط
                        </button>

                        <button
                            type="button"
                            class="reader-option"
                            data-reader-setting="width"
                            data-value="wide"
                        >
                            واسع
                        </button>

                    </div>

                </div>


                <div class="settings-group">

                    <h3>مسافة الفقرات</h3>

                    <div class="settings-options">

                        <button
                            type="button"
                            class="reader-option"
                            data-reader-setting="paragraph"
                            data-value="small"
                        >
                            صغيرة
                        </button>

                        <button
                            type="button"
                            class="reader-option"
                            data-reader-setting="paragraph"
                            data-value="medium"
                        >
                            متوسطة
                        </button>

                        <button
                            type="button"
                            class="reader-option"
                            data-reader-setting="paragraph"
                            data-value="large"
                        >
                            كبيرة
                        </button>

                    </div>

                </div>


                <div class="settings-group">

                    <h3>محاذاة النص</h3>

                    <div class="settings-options">

                        <button
                            type="button"
                            class="reader-option"
                            data-reader-setting="align"
                            data-value="right"
                        >
                            يمين
                        </button>

                        <button
                            type="button"
                            class="reader-option"
                            data-reader-setting="align"
                            data-value="center"
                        >
                            وسط
                        </button>

                        <button
                            type="button"
                            class="reader-option"
                            data-reader-setting="align"
                            data-value="justify"
                        >
                            ضبط
                        </button>

                    </div>

                </div>


                <button
                    type="button"
                    class="settings-reset"
                    data-reset-reader
                >
                    إعادة إعدادات الفصل
                </button>

            </div>
        `;


        document.body.appendChild(wrapper);


        const openButton =
            wrapper.querySelector(
                ".reader-settings-button"
            );

        const panel =
            wrapper.querySelector(
                ".reader-settings-panel"
            );

        const closeButton =
            wrapper.querySelector(
                ".reader-settings-close"
            );

        const resetButton =
            wrapper.querySelector(
                "[data-reset-reader]"
            );


        function closePanel() {

            panel.classList.remove("show");

            panel.setAttribute(
                "aria-hidden",
                "true"
            );

            openButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }


        openButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                const isOpen =
                    panel.classList.toggle("show");

                panel.setAttribute(
                    "aria-hidden",
                    String(!isOpen)
                );

                openButton.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );

            }
        );


        closeButton.addEventListener(
            "click",
            closePanel
        );


        document.addEventListener(
            "click",
            (event) => {

                if (!wrapper.contains(event.target)) {
                    closePanel();
                }

            }
        );


        wrapper
            .querySelectorAll(
                "[data-reader-setting]"
            )
            .forEach((button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const setting =
                            button.dataset.readerSetting;

                        const value =
                            button.dataset.value;

                        readerSettings[setting] =
                            value;

                        saveReaderSettings();

                        applyReaderSettings();

                    }
                );

            });


        resetButton.addEventListener(
            "click",
            () => {

                readerSettings = {
                    ...defaultReaderSettings
                };

                saveReaderSettings();

                applyReaderSettings();

            }
        );

    }


    /* =========================================
       تطبيق إعدادات الفصل
    ========================================= */

    function applyReaderSettings() {

        const reader =
            document.querySelector(
                ".chapter-reader"
            );

        if (!reader) {
            return;
        }


        const fonts = {

            naskh:
                '"Noto Naskh Arabic", "Segoe UI", Tahoma, sans-serif',

            cairo:
                '"Cairo", "Segoe UI", Tahoma, sans-serif',

            tajawal:
                '"Tajawal", "Segoe UI", Tahoma, sans-serif',

            amiri:
                '"Amiri", "Noto Naskh Arabic", serif'

        };


        const sizes = {

            small: "16px",

            medium: "18px",

            large: "20px",

            xlarge: "22px"

        };


        const spacings = {

            tight: "1.75",

            medium: "2",

            wide: "2.25"

        };


        const widths = {

            narrow: "680px",

            medium: "760px",

            wide: "900px"

        };


        const paragraphSpacing = {

            small: "12px",

            medium: "18px",

            large: "26px"

        };


        const alignments = {

            right: "right",

            center: "center",

            justify: "justify"

        };


        reader.style.setProperty(
            "--reader-font",
            fonts[readerSettings.font]
        );


        reader.style.setProperty(
            "--reader-text-size",
            sizes[readerSettings.size]
        );


        reader.style.setProperty(
            "--reader-line-height",
            spacings[readerSettings.spacing]
        );


        reader.style.setProperty(
            "--reader-width",
            widths[readerSettings.width]
        );


        reader.style.setProperty(
            "--reader-paragraph-spacing",
            paragraphSpacing[
                readerSettings.paragraph
            ]
        );


        reader.style.setProperty(
            "--reader-text-align",
            alignments[
                readerSettings.align
            ]
        );


        document
            .querySelectorAll(
                "[data-reader-setting]"
            )
            .forEach((button) => {

                const setting =
                    button.dataset.readerSetting;

                const value =
                    button.dataset.value;

                button.classList.toggle(
                    "active",
                    readerSettings[setting] === value
                );

            });

    }


    /* =========================================
       تشغيل الأنظمة
    ========================================= */

    createVolumeFolders();

    createSiteSettings();

    createReaderSettings();

    applySiteSettings();

    applyReaderSettings();

    saveLastChapter();

    createContinueReading();
   /* =========================================
   شريط تقدم القراءة
========================================= */

function createReadingProgress() {

    const reader =
        document.querySelector(".chapter-reader");

    if (!reader) {
        return;
    }

    if (
        document.querySelector(
            ".reading-progress-wrapper"
        )
    ) {
        return;
    }


    const wrapper =
        document.createElement("div");

    wrapper.className =
        "reading-progress-wrapper";


    wrapper.innerHTML = `

        <div class="reading-progress-bar">

            <div class="reading-progress-fill"></div>

        </div>

        <div class="reading-progress-info">

            <span class="reading-progress-label">
                تقدم القراءة
            </span>

            <span class="reading-progress-percent">
                0%
            </span>

        </div>

    `;


    document.body.appendChild(wrapper);


    const fill =
        wrapper.querySelector(
            ".reading-progress-fill"
        );

    const percent =
        wrapper.querySelector(
            ".reading-progress-percent"
        );


    function updateReadingProgress() {

        const documentHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        if (documentHeight <= 0) {

            fill.style.width = "100%";

            percent.textContent = "100%";

            return;

        }


        const scrollTop =
            window.scrollY;


        const progress =
            Math.min(
                Math.max(
                    (scrollTop / documentHeight) * 100,
                    0
                ),
                100
            );


        const roundedProgress =
            Math.round(progress);


        fill.style.width =
            roundedProgress + "%";


        percent.textContent =
            roundedProgress + "%";

    }


    window.addEventListener(
        "scroll",
        updateReadingProgress,
        { passive: true }
    );


    window.addEventListener(
        "resize",
        updateReadingProgress
    );


    updateReadingProgress();

}


/* تشغيل شريط القراءة */

createReadingProgress();
    /* =========================================
   حفظ موضع القراءة داخل الفصل
========================================= */

const READING_POSITION_KEY =
    "brokenThroneReadingPositions";


function getCurrentChapterPath() {

    const reader =
        document.querySelector(".chapter-reader");

    if (!reader) {
        return null;
    }

    const path =
        window.location.pathname;

    const match =
        path.match(/\/chapter-(\d+)\.html$/i);

    if (!match) {
        return null;
    }

    return path;

}


function loadReadingPositions() {

    try {

        const saved =
            localStorage.getItem(
                READING_POSITION_KEY
            );

        if (!saved) {
            return {};
        }

        const data =
            JSON.parse(saved);

        if (
            !data ||
            typeof data !== "object"
        ) {
            return {};
        }

        return data;

    } catch (error) {

        return {};

    }

}


function saveReadingPosition() {

    const chapterPath =
        getCurrentChapterPath();

    if (!chapterPath) {
        return;
    }


    const documentHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;


    if (documentHeight <= 0) {
        return;
    }


    const scrollTop =
        window.scrollY;


    const progress =
        Math.min(
            Math.max(
                scrollTop / documentHeight,
                0
            ),
            1
        );


    const positions =
        loadReadingPositions();


    positions[chapterPath] = {

        progress:
            progress,

        savedAt:
            Date.now()

    };


    try {

        localStorage.setItem(
            READING_POSITION_KEY,
            JSON.stringify(positions)
        );

    } catch (error) {

        console.warn(
            "تعذر حفظ موضع القراءة.",
            error
        );

    }

}


function restoreReadingPosition() {

    const chapterPath =
        getCurrentChapterPath();

    if (!chapterPath) {
        return;
    }


    const positions =
        loadReadingPositions();


    const saved =
        positions[chapterPath];


    if (
        !saved ||
        typeof saved.progress !== "number"
    ) {
        return;
    }


    const restore =
        () => {

            const documentHeight =
                document.documentElement.scrollHeight -
                window.innerHeight;


            if (documentHeight <= 0) {
                return;
            }


            const target =
                saved.progress *
                documentHeight;


            window.scrollTo({
                top: target,
                behavior: "auto"
            });

        };


    /*
       ننتظر قليلًا حتى يكتمل تحميل
       النص والخطوط وحساب ارتفاع الصفحة.
    */

    requestAnimationFrame(() => {

        requestAnimationFrame(() => {

            setTimeout(
                restore,
                100
            );

        });

    });

}


/* -----------------------------------------
   حفظ الموضع عند التمرير
----------------------------------------- */

let readingSaveTimer = null;


window.addEventListener(
    "scroll",
    () => {

        if (readingSaveTimer) {
            return;
        }


        readingSaveTimer =
            setTimeout(() => {

                saveReadingPosition();

                readingSaveTimer = null;

            }, 250);

    },
    {
        passive: true
    }
);


/* -----------------------------------------
   حفظ الموضع عند مغادرة الصفحة
----------------------------------------- */

window.addEventListener(
    "beforeunload",
    () => {

        saveReadingPosition();

    }
);


/* -----------------------------------------
   استعادة الموضع عند فتح الفصل
----------------------------------------- */

restoreReadingPosition();
   /* =========================================
   نظام البحث الشامل
========================================= */

const SEARCH_MIN_LENGTH = 1;

let siteSearchIndex = [];
let siteSearchReady = false;
let siteSearchBuilding = false;


/* -----------------------------------------
   تطبيع النص العربي للبحث
----------------------------------------- */

function normalizeSearchText(text) {

    return String(text || "")
        .toLowerCase()
        .replace(/[\u064B-\u065F\u0670]/g, "")
        .replace(/[أإآ]/g, "ا")
        .replace(/ؤ/g, "و")
        .replace(/ئ/g, "ي")
        .replace(/ـ/g, "")
        .replace(/\s+/g, " ")
        .trim();

}


/* -----------------------------------------
   تنظيف HTML
----------------------------------------- */

function escapeSearchHTML(text) {

    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* -----------------------------------------
   تحديد جذر الموقع
----------------------------------------- */

function getSiteBasePath() {

    const parts =
        window.location.pathname
            .split("/")
            .filter(Boolean);

    if (!parts.length) {
        return "/";
    }

    return "/" + parts[0] + "/";

}


/* -----------------------------------------
   السماح فقط بصفحات HTML الخاصة بالموقع
----------------------------------------- */

function isSearchablePage(url) {

    try {

        const parsed =
            new URL(
                url,
                window.location.origin
            );

        if (
            parsed.origin !==
            window.location.origin
        ) {
            return false;
        }


        const pathname =
            parsed.pathname;


        const base =
            getSiteBasePath();


        if (
            !pathname.startsWith(base)
        ) {
            return false;
        }


        if (
            pathname.includes("/assets/") ||
            pathname.endsWith(".css") ||
            pathname.endsWith(".js") ||
            pathname.endsWith(".jpg") ||
            pathname.endsWith(".jpeg") ||
            pathname.endsWith(".png") ||
            pathname.endsWith(".webp") ||
            pathname.endsWith(".gif") ||
            pathname.endsWith(".svg")
        ) {
            return false;
        }


        return (
            pathname.endsWith(".html") ||
            pathname.endsWith("/")
        );

    } catch (error) {

        return false;

    }

}


/* -----------------------------------------
   الحصول على روابط الصفحة
----------------------------------------- */

async function fetchSearchPage(url) {

    try {

        const response =
            await fetch(
                url,
                {
                    cache: "no-store"
                }
            );

        if (!response.ok) {
            return null;
        }


        const html =
            await response.text();


        const parser =
            new DOMParser();


        const documentPage =
            parser.parseFromString(
                html,
                "text/html"
            );


        return documentPage;

    } catch (error) {

        return null;

    }

}


/* -----------------------------------------
   إضافة صفحة إلى الفهرس
----------------------------------------- */

function addPageToSearchIndex(
    url,
    documentPage
) {

    if (!documentPage) {
        return;
    }


    const titleElement =
        documentPage.querySelector("title");


    const headingElement =
        documentPage.querySelector(
            "h1"
        );


    const title =
        (
            headingElement?.textContent ||
            titleElement?.textContent ||
            "صفحة"
        ).trim();


    const body =
        documentPage.body;


    if (!body) {
        return;
    }


    const text =
        body.textContent
            .replace(/\s+/g, " ")
            .trim();


    const cleanText =
        text.slice(0, 5000);


    siteSearchIndex.push({

        url:

            new URL(
                url,
                window.location.origin
            ).pathname,

        title,

        text:

            cleanText,

        normalizedTitle:

            normalizeSearchText(
                title
            ),

        normalizedText:

            normalizeSearchText(
                cleanText
            )

    });

}


/* -----------------------------------------
   بناء فهرس الموقع
----------------------------------------- */

async function buildSiteSearchIndex() {

    if (
        siteSearchReady ||
        siteSearchBuilding
    ) {
        return;
    }


    siteSearchBuilding = true;


    const base =
        getSiteBasePath();


    const startingPaths = [

        base,

        `${base}index.html`,

        `${base}chapters/index.html`,

        `${base}characters/index.html`,

        `${base}world/index.html`,

        `${base}techniques/index.html`

    ];


    const queue = [];


    const visited =
        new Set();


    startingPaths.forEach((path) => {

        queue.push(
            new URL(
                path,
                window.location.origin
            ).href
        );

    });


    const maxPages = 120;


    while (
        queue.length &&
        visited.size < maxPages
    ) {

        const url =
            queue.shift();


        if (visited.has(url)) {
            continue;
        }


        visited.add(url);


        const documentPage =
            await fetchSearchPage(url);


        if (!documentPage) {
            continue;
        }


        addPageToSearchIndex(
            url,
            documentPage
        );


        const links =
            documentPage.querySelectorAll(
                "a[href]"
            );


        links.forEach((link) => {

            try {

                const absoluteURL =
                    new URL(
                        link.getAttribute("href"),
                        url
                    );


                absoluteURL.hash = "";
                absoluteURL.search = "";


                if (
                    isSearchablePage(
                        absoluteURL.href
                    ) &&
                    !visited.has(
                        absoluteURL.href
                    )
                ) {

                    queue.push(
                        absoluteURL.href
                    );

                }

            } catch (error) {

                /* تجاهل الروابط غير الصالحة */

            }

        });

    }


    /*
       منع التكرار
    */

    const uniquePages =
        new Map();


    siteSearchIndex.forEach((page) => {

        uniquePages.set(
            page.url,
            page
        );

    });


    siteSearchIndex =
        Array.from(
            uniquePages.values()
        );


    siteSearchReady = true;
    siteSearchBuilding = false;


    const status =
        document.querySelector(
            ".site-search-status"
        );


    if (status) {

        status.textContent =
            `${siteSearchIndex.length} صفحة مفهرسة`;

    }

}


/* -----------------------------------------
   حساب نتيجة البحث
----------------------------------------- */

function scoreSearchResult(
    page,
    query
) {

    const normalizedQuery =
        normalizeSearchText(query);


    if (!normalizedQuery) {
        return 0;
    }


    let score = 0;


    if (
        page.normalizedTitle ===
        normalizedQuery
    ) {

        score += 100;

    }


    if (
        page.normalizedTitle
            .includes(normalizedQuery)
    ) {

        score += 60;

    }


    if (
        page.normalizedText
            .includes(normalizedQuery)
    ) {

        score += 30;

    }


    const words =
        normalizedQuery.split(" ");


    words.forEach((word) => {

        if (!word) {
            return;
        }


        if (
            page.normalizedTitle
                .includes(word)
        ) {

            score += 15;

        }


        if (
            page.normalizedText
                .includes(word)
        ) {

            score += 5;

        }

    });


    return score;

}


/* -----------------------------------------
   استخراج مقتطف مناسب
----------------------------------------- */

function createSearchSnippet(
    page,
    query
) {

    const originalText =
        page.text;


    const normalizedText =
        page.normalizedText;


    const normalizedQuery =
        normalizeSearchText(query);


    const position =
        normalizedText.indexOf(
            normalizedQuery
        );


    if (position === -1) {

        return (
            originalText.slice(0, 150) +
            (
                originalText.length > 150
                    ? "..."
                    : ""
            )
        );

    }


    const start =
        Math.max(
            position - 55,
            0
        );


    const end =
        Math.min(
            position +
            normalizedQuery.length +
            95,
            originalText.length
        );


    let snippet =
        originalText.slice(
            start,
            end
        );


    if (start > 0) {
        snippet = "..." + snippet;
    }


    if (
        end <
        originalText.length
    ) {

        snippet += "...";

    }


    return snippet;

}


/* -----------------------------------------
   عرض النتائج
----------------------------------------- */

function renderSearchResults(
    query
) {

    const resultsContainer =
        document.querySelector(
            ".site-search-results"
        );


    if (!resultsContainer) {
        return;
    }


    const cleanQuery =
        query.trim();


    if (
        cleanQuery.length <
        SEARCH_MIN_LENGTH
    ) {

        resultsContainer.innerHTML = `
            <div class="site-search-empty">
                اكتب ما تريد البحث عنه.
            </div>
        `;

        return;

    }


    if (!siteSearchReady) {

        resultsContainer.innerHTML = `
            <div class="site-search-empty">
                جاري تجهيز فهرس الموقع...
            </div>
        `;

        return;

    }


    const rankedResults =
        siteSearchIndex
            .map((page) => ({

                page,

                score:
                    scoreSearchResult(
                        page,
                        cleanQuery
                    )

            }))
            .filter(
                (result) =>
                    result.score > 0
            )
            .sort(
                (a, b) =>
                    b.score - a.score
            )
            .slice(0, 12);


    if (!rankedResults.length) {

        resultsContainer.innerHTML = `
            <div class="site-search-empty">
                لم يتم العثور على نتائج.
            </div>
        `;

        return;

    }


    resultsContainer.innerHTML =
        rankedResults
            .map(
                ({
                    page
                }) => {

                    const snippet =
                        createSearchSnippet(
                            page,
                            cleanQuery
                        );


                    return `

                        <a
                            href="${escapeSearchHTML(page.url)}"
                            class="site-search-result"
                        >

                            <span class="site-search-result-title">
                                ${escapeSearchHTML(
                                    page.title
                                )}
                            </span>

                            <span class="site-search-result-path">
                                ${escapeSearchHTML(
                                    page.url
                                )}
                            </span>

                            <span class="site-search-result-snippet">
                                ${escapeSearchHTML(
                                    snippet
                                )}
                            </span>

                        </a>

                    `;

                }
            )
            .join("");

}


/* -----------------------------------------
   إنشاء واجهة البحث
----------------------------------------- */

function createSiteSearch() {

    if (
        document.querySelector(
            ".site-search-wrapper"
        )
    ) {
        return;
    }


    const wrapper =
        document.createElement("div");


    wrapper.className =
        "site-search-wrapper";


    wrapper.innerHTML = `

        <button
            type="button"
            class="site-search-button"
            aria-label="البحث"
            aria-expanded="false"
        >
            بحث
        </button>


        <div
            class="site-search-panel"
            aria-hidden="true"
        >

            <div class="site-search-header">

                <div>

                    <h2>
                        بحث الموقع
                    </h2>

                    <span class="site-search-status">
                        جاري تجهيز البحث...
                    </span>

                </div>


                <button
                    type="button"
                    class="site-search-close"
                    aria-label="إغلاق"
                >
                    ×
                </button>

            </div>


            <div class="site-search-input-wrapper">

                <input
                    type="search"
                    class="site-search-input"
                    placeholder="ابحث عن فصل، شخصية، طائفة، تقنية..."
                    autocomplete="off"
                >

            </div>


            <div class="site-search-results">

                <div class="site-search-empty">
                    اكتب ما تريد البحث عنه.
                </div>

            </div>

        </div>

    `;


    document.body.appendChild(wrapper);


    const button =
        wrapper.querySelector(
            ".site-search-button"
        );


    const panel =
        wrapper.querySelector(
            ".site-search-panel"
        );


    const close =
        wrapper.querySelector(
            ".site-search-close"
        );


    const input =
        wrapper.querySelector(
            ".site-search-input"
        );


    function closeSearch() {

        panel.classList.remove(
            "show"
        );

        panel.setAttribute(
            "aria-hidden",
            "true"
        );

        button.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    function openSearch() {

        panel.classList.add(
            "show"
        );

        panel.setAttribute(
            "aria-hidden",
            "false"
        );

        button.setAttribute(
            "aria-expanded",
            "true"
        );


        setTimeout(() => {

            input.focus();

        }, 80);


        if (
            !siteSearchReady &&
            !siteSearchBuilding
        ) {

            buildSiteSearchIndex();

        }

    }


    button.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();


            if (
                panel.classList.contains(
                    "show"
                )
            ) {

                closeSearch();

            } else {

                openSearch();

            }

        }
    );


    close.addEventListener(
        "click",
        closeSearch
    );


    document.addEventListener(
        "click",
        (event) => {

            if (
                !wrapper.contains(
                    event.target
                )
            ) {

                closeSearch();

            }

        }
    );


    input.addEventListener(
        "input",
        () => {

            renderSearchResults(
                input.value
            );

        }
    );


    input.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key ===
                "Escape"
            ) {

                closeSearch();

            }

        }
    );

}


/* تشغيل البحث */

createSiteSearch();

buildSiteSearchIndex(); 

});
