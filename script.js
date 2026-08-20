document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       مفاتيح التخزين
    ========================================= */

    const SITE_SETTINGS_KEY =
        "brokenThroneSiteSettings";

    const READER_SETTINGS_KEY =
        "brokenThroneReaderSettings";

    const LAST_CHAPTER_KEY =
        "brokenThroneLastChapter";

    const READING_PROGRESS_KEY =
        "brokenThroneChapterProgress";

    const COMPLETED_CHAPTERS_KEY =
        "brokenThroneCompletedChapters";


    /* =========================================
       أدوات مساعدة
    ========================================= */

    function escapeHTML(text) {

        return String(text || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function safeGet(key) {

        try {

            return localStorage.getItem(key);

        } catch (error) {

            return null;

        }

    }


    function safeSet(key, value) {

        try {

            localStorage.setItem(
                key,
                value
            );

        } catch (error) {

            console.warn(
                "تعذر حفظ البيانات.",
                error
            );

        }

    }


    function isChapterPage() {

        return Boolean(
            document.querySelector(
                ".chapter-reader"
            )
        );

    }


    function getCurrentChapterTitle() {

        const heading =
            document.querySelector(
                ".chapter-reader h1"
            );


        if (
            heading &&
            heading.textContent.trim()
        ) {

            return heading.textContent
                .replace(/\s+/g, " ")
                .trim();

        }


        const title =
            document.title
                .replace(
                    /—\s*العرش المكسور/gi,
                    ""
                )
                .replace(
                    /-\s*العرش المكسور/gi,
                    ""
                )
                .trim();


        return title || "الفصل";

    }


    function getCurrentChapterURL() {

        return window.location.pathname;

    }


    /* =========================================
       تحميل الخطوط
    ========================================= */

    function loadFonts() {

        if (
            document.querySelector(
                "#broken-throne-fonts"
            )
        ) {
            return;
        }


        const fontLink =
            document.createElement(
                "link"
            );


        fontLink.id =
            "broken-throne-fonts";


        fontLink.rel =
            "stylesheet";


        fontLink.href =
            "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;600;700;800&family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Tajawal:wght@400;500;700;800&display=swap";


        document.head.appendChild(
            fontLink
        );

    }


    /* =========================================
       نظام المجلدات
    ========================================= */

    function createVolumeFolders() {

        const folders =
            document.querySelectorAll(
                ".volume-folder"
            );


        if (!folders.length) {
            return;
        }


        folders.forEach((folder) => {

            const summary =
                folder.querySelector(
                    "summary"
                );


            const content =
                folder.querySelector(
                    ".chapter-list"
                );


            if (!summary || !content) {
                return;
            }


            folder.removeAttribute(
                "open"
            );


            content.style.overflow =
                "hidden";

            content.style.maxHeight =
                "0px";

            content.style.opacity =
                "0";

            content.style.transform =
                "translateY(-10px)";

            content.style.paddingTop =
                "0px";

            content.style.paddingBottom =
                "0px";


            content.style.transition =
                "max-height 0.5s cubic-bezier(0.22, 1, 0.36, 1), " +
                "opacity 0.35s ease, " +
                "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), " +
                "padding 0.5s ease";


            let closeTimer = null;

            let isAnimating = false;


            function openFolder() {

                if (closeTimer) {

                    clearTimeout(
                        closeTimer
                    );

                }


                isAnimating = true;


                folder.setAttribute(
                    "open",
                    ""
                );


                content.style.maxHeight =
                    "0px";

                content.style.opacity =
                    "0";

                content.style.transform =
                    "translateY(-10px)";

                content.style.paddingTop =
                    "0px";

                content.style.paddingBottom =
                    "0px";


                requestAnimationFrame(() => {

                    requestAnimationFrame(() => {

                        content.style.maxHeight =
                            content.scrollHeight + "px";

                        content.style.opacity =
                            "1";

                        content.style.transform =
                            "translateY(0)";

                        content.style.paddingTop =
                            "18px";

                        content.style.paddingBottom =
                            "18px";

                    });

                });


                setTimeout(() => {

                    if (
                        folder.hasAttribute(
                            "open"
                        )
                    ) {

                        content.style.maxHeight =
                            "none";

                    }

                    isAnimating = false;

                }, 520);

            }


            function closeFolder() {

                if (closeTimer) {

                    clearTimeout(
                        closeTimer
                    );

                }


                isAnimating = true;


                content.style.maxHeight =
                    content.scrollHeight + "px";

                content.style.opacity =
                    "1";

                content.style.transform =
                    "translateY(0)";

                content.style.paddingTop =
                    "18px";

                content.style.paddingBottom =
                    "18px";


                requestAnimationFrame(() => {

                    requestAnimationFrame(() => {

                        content.style.maxHeight =
                            "0px";

                        content.style.opacity =
                            "0";

                        content.style.transform =
                            "translateY(-10px)";

                        content.style.paddingTop =
                            "0px";

                        content.style.paddingBottom =
                            "0px";

                    });

                });


                closeTimer =
                    setTimeout(() => {

                        folder.removeAttribute(
                            "open"
                        );

                        isAnimating = false;

                    }, 500);

            }


            summary.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();


                    if (isAnimating) {
                        return;
                    }


                    if (
                        folder.hasAttribute(
                            "open"
                        )
                    ) {

                        closeFolder();

                    } else {

                        openFolder();

                    }

                }
            );


            window.addEventListener(
                "resize",
                () => {

                    if (
                        folder.hasAttribute(
                            "open"
                        ) &&
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

    function createSpoilerSystem() {

        const spoilerButtons =
            document.querySelectorAll(
                ".spoiler-button"
            );


        spoilerButtons.forEach((button) => {

            button.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    event.stopPropagation();


                    const characterCard =
                        button.closest(
                            ".character-card"
                        );


                    const spoilerSection =
                        button.closest(
                            ".character-spoiler-section"
                        );


                    const container =
                        characterCard ||
                        spoilerSection;


                    if (!container) {
                        return;
                    }


                    const spoilerInfo =
                        container.querySelector(
                            ".spoiler-info"
                        );


                    if (!spoilerInfo) {
                        return;
                    }


                    spoilerInfo.classList.toggle(
                        "show"
                    );


                    button.textContent =
                        spoilerInfo.classList.contains(
                            "show"
                        )
                            ? "إخفاء الحرق"
                            : "حرق";

                }
            );

        });

    }


    /* =========================================
       إعدادات الموقع
    ========================================= */

    const defaultSiteSettings = {

        theme: "dark",

        font: "naskh",

        size: "medium",

        spacing: "medium"

    };


    const defaultReaderSettings = {

        font: "naskh",

        size: "medium",

        spacing: "medium",

        width: "medium",

        paragraph: "medium",

        align: "right"

    };


    function loadSettings(
        key,
        defaults
    ) {

        try {

            const saved =
                safeGet(key);


            if (!saved) {

                return {
                    ...defaults
                };

            }


            const parsed =
                JSON.parse(saved);


            return {

                ...defaults,

                ...(parsed &&
                typeof parsed === "object"
                    ? parsed
                    : {})

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


    function saveSiteSettings() {

        safeSet(
            SITE_SETTINGS_KEY,
            JSON.stringify(
                siteSettings
            )
        );

    }


    function saveReaderSettings() {

        safeSet(
            READER_SETTINGS_KEY,
            JSON.stringify(
                readerSettings
            )
        );

    }


    /* =========================================
       إعدادات الموقع
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
            document.createElement(
                "div"
            );


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

                <div
                    class="settings-panel-header"
                >

                    <h2>
                        إعدادات الموقع
                    </h2>


                    <button
                        type="button"
                        class="settings-panel-close"
                        aria-label="إغلاق"
                    >
                        ×
                    </button>

                </div>


                <div class="settings-group">

                    <h3>
                        المظهر
                    </h3>


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

                    <h3>
                        نوع الخط
                    </h3>


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

                    <h3>
                        حجم النص
                    </h3>


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

                    <h3>
                        تباعد السطور
                    </h3>


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


        document.body.appendChild(
            wrapper
        );


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

            panel.classList.remove(
                "show"
            );


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
                    panel.classList.toggle(
                        "show"
                    );


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

                if (
                    !wrapper.contains(
                        event.target
                    )
                ) {

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
                            button.dataset
                                .siteSetting;


                        siteSettings[
                            setting
                        ] =
                            button.dataset.value;


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
            fonts[
                siteSettings.font
            ] || fonts.naskh
        );


        root.style.setProperty(
            "--site-text-scale",
            sizes[
                siteSettings.size
            ] || sizes.medium
        );


        root.style.setProperty(
            "--site-line-height",
            spacings[
                siteSettings.spacing
            ] || spacings.medium
        );


        body.classList.toggle(
            "light-theme",
            siteSettings.theme === "light"
        );


        body.classList.toggle(
            "dark-theme",
            siteSettings.theme !== "light"
        );


        document
            .querySelectorAll(
                "[data-site-setting]"
            )
            .forEach((button) => {

                const setting =
                    button.dataset
                        .siteSetting;


                button.classList.toggle(
                    "active",
                    siteSettings[
                        setting
                    ] === button.dataset.value
                );

            });

    }


    /* =========================================
       إعدادات القراءة
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
            document.createElement(
                "div"
            );


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

                <div
                    class="settings-panel-header"
                >

                    <h2>
                        إعدادات الفصل
                    </h2>


                    <button
                        type="button"
                        class="reader-settings-close"
                        aria-label="إغلاق"
                    >
                        ×
                    </button>

                </div>


                <div class="settings-group">

                    <h3>
                        نوع الخط
                    </h3>


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

                    <h3>
                        حجم النص
                    </h3>


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

                    <h3>
                        تباعد السطور
                    </h3>


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

                    <h3>
                        عرض القراءة
                    </h3>


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

                    <h3>
                        مسافة الفقرات
                    </h3>


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

                    <h3>
                        محاذاة النص
                    </h3>


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


        document.body.appendChild(
            wrapper
        );


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

            panel.classList.remove(
                "show"
            );


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
                    panel.classList.toggle(
                        "show"
                    );


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

                if (
                    !wrapper.contains(
                        event.target
                    )
                ) {

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

                        readerSettings[
                            button.dataset
                                .readerSetting
                        ] =
                            button.dataset.value;


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
            fonts[
                readerSettings.font
            ] || fonts.naskh
        );


        reader.style.setProperty(
            "--reader-text-size",
            sizes[
                readerSettings.size
            ] || sizes.medium
        );


        reader.style.setProperty(
            "--reader-line-height",
            spacings[
                readerSettings.spacing
            ] || spacings.medium
        );


        reader.style.setProperty(
            "--reader-width",
            widths[
                readerSettings.width
            ] || widths.medium
        );


        reader.style.setProperty(
            "--reader-paragraph-spacing",
            paragraphSpacing[
                readerSettings.paragraph
            ] || paragraphSpacing.medium
        );


        reader.style.setProperty(
            "--reader-text-align",
            alignments[
                readerSettings.align
            ] || alignments.right
        );


        document
            .querySelectorAll(
                "[data-reader-setting]"
            )
            .forEach((button) => {

                const setting =
                    button.dataset
                        .readerSetting;


                button.classList.toggle(
                    "active",
                    readerSettings[
                        setting
                    ] === button.dataset.value
                );

            });

    }


    /* =========================================
       تابع القراءة
    ========================================= */

    function loadLastChapter() {

        try {

            const saved =
                safeGet(
                    LAST_CHAPTER_KEY
                );


            if (!saved) {
                return null;
            }


            const parsed =
                JSON.parse(saved);


            if (
                !parsed ||
                !parsed.url
            ) {
                return null;
            }


            return parsed;

        } catch (error) {

            return null;

        }

    }


    function saveLastChapter() {

        if (!isChapterPage()) {
            return;
        }


        safeSet(

            LAST_CHAPTER_KEY,

            JSON.stringify({

                title:
                    getCurrentChapterTitle(),

                url:
                    getCurrentChapterURL(),

                updatedAt:
                    Date.now()

            })

        );

    }


    function createContinueReading() {

        const homeSections =
            document.querySelector(
                ".home-sections"
            );


        if (!homeSections) {
            return;
        }


        const saved =
            loadLastChapter();


        if (
            !saved ||
            !saved.url
        ) {
            return;
        }


        let card =
            homeSections.querySelector(
                ".continue-reading-card"
            );


        if (!card) {

            card =
                document.createElement(
                    "a"
                );


            card.className =
                "continue-reading-card";


            const navigation =
                homeSections.querySelector(
                    ".home-navigation"
                );


            if (navigation) {

                homeSections.insertBefore(
                    card,
                    navigation
                );

            } else {

                homeSections.prepend(
                    card
                );

            }

        }


        card.href =
            saved.url;


        card.innerHTML = `

            <span
                class="continue-reading-label"
            >
                تابع القراءة
            </span>


            <span
                class="continue-reading-title"
            >
                ${escapeHTML(
                    saved.title
                )}
            </span>


            <span
                class="continue-reading-number"
            >
                آخر فصل فتحته
            </span>


            <span
                class="continue-reading-arrow"
            >
                ←
            </span>

        `;

    }


    /* =========================================
       حفظ مكان القراءة
    ========================================= */

    let progressSaveTimer = null;

    let progressSavePending = false;


    function getReadingProgressData() {

        const total =
            document.documentElement.scrollHeight -
            window.innerHeight;


        if (total <= 0) {

            return {

                top: 0,

                percent: 0

            };

        }


        const top =
            Math.max(
                0,
                window.scrollY || 0
            );


        const percent =
            Math.max(
                0,
                Math.min(
                    100,
                    (top / total) * 100
                )
            );


        return {

            top: top,

            percent: percent

        };

    }


    function loadChapterProgress() {

        try {

            const saved =
                safeGet(
                    READING_PROGRESS_KEY
                );


            if (!saved) {
                return {};
            }


            const parsed =
                JSON.parse(saved);


            return (
                parsed &&
                typeof parsed === "object"
            )
                ? parsed
                : {};

        } catch (error) {

            return {};

        }

    }


    function saveChapterProgress() {

        if (!isChapterPage()) {
            return;
        }


        const data =
            loadChapterProgress();


        const url =
            getCurrentChapterURL();


        const progress =
            getReadingProgressData();


        data[url] = {

            top:
                Math.round(
                    progress.top
                ),

            percent:
                Number(
                    progress.percent.toFixed(
                        2
                    )
                ),

            updatedAt:
                Date.now()

        };


        safeSet(

            READING_PROGRESS_KEY,

            JSON.stringify(data)

        );

    }


    function saveChapterProgressThrottled() {

        if (!isChapterPage()) {
            return;
        }


        progressSavePending = true;


        if (progressSaveTimer) {
            return;
        }


        progressSaveTimer =
            setTimeout(() => {

                if (
                    progressSavePending
                ) {

                    saveChapterProgress();

                }


                progressSavePending =
                    false;


                progressSaveTimer =
                    null;

            }, 250);

    }


    function restoreChapterProgress() {

        if (!isChapterPage()) {
            return;
        }


        const data =
            loadChapterProgress();


        const current =
            data[
                getCurrentChapterURL()
            ];


        if (
            !current ||
            typeof current.top !== "number" ||
            current.top <= 5
        ) {
            return;
        }


        /*
           ننتظر حتى يكتمل تحميل محتوى الفصل.
        */

        const restore =
            () => {

                const maxScroll =
                    Math.max(
                        0,
                        document.documentElement
                            .scrollHeight -
                        window.innerHeight
                    );


                const target =
                    Math.min(
                        current.top,
                        maxScroll
                    );


                window.scrollTo(
                    0,
                    target
                );

            };


        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                restore();

            });

        });


        window.addEventListener(
            "load",
            restore,
            {
                once: true
            }
        );

    }


    /* =========================================
       تحديد الفصل كمقروء
    ========================================= */

    function loadCompletedChapters() {

        try {

            const saved =
                safeGet(
                    COMPLETED_CHAPTERS_KEY
                );


            if (!saved) {
                return [];
            }


            const parsed =
                JSON.parse(saved);


            if (!Array.isArray(parsed)) {
                return [];
            }


            return parsed;

        } catch (error) {

            return [];

        }

    }


    function saveCompletedChapters(
        chapters
    ) {

        safeSet(

            COMPLETED_CHAPTERS_KEY,

            JSON.stringify(
                chapters
            )

        );

    }


    function markCurrentChapterCompleted() {

        if (!isChapterPage()) {
            return;
        }


        const url =
            getCurrentChapterURL();


        let completed =
            loadCompletedChapters();


        if (
            completed.includes(url)
        ) {
            return;
        }


        completed.push(url);


        saveCompletedChapters(
            completed
        );

    }


    function checkChapterCompletion() {

        if (!isChapterPage()) {
            return;
        }


        const progress =
            getReadingProgressData();


        /*
           نعتبر الفصل مكتملًا عند
           الوصول إلى 97% من القراءة.
        */

        if (
            progress.percent >= 97
        ) {

            markCurrentChapterCompleted();

        }

    }


    /* =========================================
       علامات الفصول المقروءة
    ========================================= */

    function updateCompletedChapterMarks() {

        const completed =
            loadCompletedChapters();


        const chapterCards =
            document.querySelectorAll(
                ".chapter-card"
            );


        if (!chapterCards.length) {
            return;
        }


        chapterCards.forEach((card) => {

            const href =
                card.getAttribute(
                    "href"
                );


            if (!href) {
                return;
            }


            let path;


            try {

                path =
                    new URL(
                        href,
                        window.location.href
                    ).pathname;

            } catch (error) {

                path =
                    href;

            }


            const isCompleted =
                completed.includes(
                    path
                );


            let check =
                card.querySelector(
                    ".chapter-read-check"
                );


            if (
                isCompleted &&
                !check
            ) {

                check =
                    document.createElement(
                        "span"
                    );


                check.className =
                    "chapter-read-check";


                check.setAttribute(
                    "aria-label",
                    "تمت القراءة"
                );


                check.textContent =
                    "✓";


                card.appendChild(
                    check
                );

            }


            if (
                !isCompleted &&
                check
            ) {

                check.remove();

            }

        });

    }


    /* =========================================
       شريط تقدم القراءة
    ========================================= */

    let progressFrame = null;


    function createReadingProgress() {

        if (!isChapterPage()) {
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
            document.createElement(
                "div"
            );


        wrapper.className =
            "reading-progress-wrapper";


        wrapper.innerHTML = `

            <div
                class="reading-progress-bar"
            >

                <div
                    class="reading-progress-fill"
                ></div>

            </div>


            <div
                class="reading-progress-info"
            >

                <span>
                    تقدم القراءة
                </span>


                <span
                    class="reading-progress-percent"
                >
                    0%
                </span>

            </div>

        `;


        document.body.appendChild(
            wrapper
        );


        const fill =
            wrapper.querySelector(
                ".reading-progress-fill"
            );


        const percent =
            wrapper.querySelector(
                ".reading-progress-percent"
            );


        function updateProgress() {

            progressFrame = null;


            const progress =
                getReadingProgressData();


            fill.style.width =
                progress.percent + "%";


            percent.textContent =
                Math.round(
                    progress.percent
                ) + "%";

        }


        function onScroll() {

            if (!progressFrame) {

                progressFrame =
                    requestAnimationFrame(
                        updateProgress
                    );

            }


            saveChapterProgressThrottled();

            checkChapterCompletion();

        }


        window.addEventListener(
            "scroll",
            onScroll,
            {
                passive: true
            }
        );


        window.addEventListener(
            "resize",
            updateProgress
        );


        updateProgress();

    }


    /* =========================================
       البحث الشامل
    ========================================= */

    function createSiteSearch() {

        if (
            document.querySelector(
                ".site-search-wrapper"
            )
        ) {
            return;
        }


        const wrapper =
            document.createElement(
                "div"
            );


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

                <div
                    class="site-search-header"
                >

                    <div>

                        <h2>
                            البحث
                        </h2>


                        <span
                            class="site-search-status"
                        >
                            ابحث داخل الموقع
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


                <div
                    class="site-search-input-wrapper"
                >

                    <input
                        type="search"
                        class="site-search-input"
                        placeholder="ابحث عن فصل أو شخصية أو طائفة..."
                        autocomplete="off"
                    >

                </div>


                <div
                    class="site-search-results"
                ></div>

            </div>

        `;


        document.body.appendChild(
            wrapper
        );


        const openButton =
            wrapper.querySelector(
                ".site-search-button"
            );


        const panel =
            wrapper.querySelector(
                ".site-search-panel"
            );


        const closeButton =
            wrapper.querySelector(
                ".site-search-close"
            );


        const input =
            wrapper.querySelector(
                ".site-search-input"
            );


        const results =
            wrapper.querySelector(
                ".site-search-results"
            );


        function closeSearch() {

            panel.classList.remove(
                "show"
            );


            panel.setAttribute(
                "aria-hidden",
                "true"
            );


            openButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }


        function collectSearchItems() {

            const items = [];


            document
                .querySelectorAll(
                    "a[href]"
                )
                .forEach((link) => {

                    if (
                        wrapper.contains(
                            link
                        )
                    ) {
                        return;
                    }


                    const href =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !href ||
                        href.startsWith(
                            "#"
                        ) ||
                        href.startsWith(
                            "javascript:"
                        ) ||
                        href.startsWith(
                            "mailto:"
                        )
                    ) {
                        return;
                    }


                    const titleElement =
                        link.querySelector(
                            ".chapter-title, " +
                            ".home-menu-title, " +
                            ".world-main-card-title, " +
                            ".techniques-category-title, " +
                            ".continue-reading-title, " +
                            ".character-info h3, " +
                            ".world-region-header h3, " +
                            ".chapter-number"
                        );


                    const title =
                        (
                            titleElement ||
                            link
                        )
                            .textContent
                            .replace(
                                /\s+/g,
                                " "
                            )
                            .trim();


                    if (!title) {
                        return;
                    }


                    const snippet =
                        link.textContent
                            .replace(
                                /\s+/g,
                                " "
                            )
                            .trim();


                    items.push({

                        title:
                            title,

                        href:
                            href,

                        snippet:
                            snippet

                    });

                });


            return items;

        }


        function renderResults(
            query = ""
        ) {

            const items =
                collectSearchItems();


            const normalized =
                query
                    .trim()
                    .toLowerCase();


            const filtered =
                (
                    normalized
                        ? items.filter(
                            (item) =>
                                (
                                    item.title +
                                    " " +
                                    item.snippet
                                )
                                    .toLowerCase()
                                    .includes(
                                        normalized
                                    )
                        )
                        : items
                )
                .slice(
                    0,
                    20
                );


            if (!filtered.length) {

                results.innerHTML = `

                    <div
                        class="site-search-empty"
                    >
                        لا توجد نتائج.
                    </div>

                `;


                return;

            }


            results.innerHTML =
                filtered
                    .map(
                        (item) => `

                            <a
                                href="${escapeHTML(
                                    item.href
                                )}"
                                class="site-search-result"
                            >

                                <span
                                    class="site-search-result-title"
                                >
                                    ${escapeHTML(
                                        item.title
                                    )}
                                </span>


                                <span
                                    class="site-search-result-path"
                                >
                                    ${escapeHTML(
                                        item.href
                                    )}
                                </span>


                                <span
                                    class="site-search-result-snippet"
                                >
                                    ${escapeHTML(
                                        item.snippet
                                    )}
                                </span>

                            </a>

                        `
                    )
                    .join("");

        }


        openButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();


                const isOpen =
                    panel.classList.toggle(
                        "show"
                    );


                panel.setAttribute(
                    "aria-hidden",
                    String(!isOpen)
                );


                openButton.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );


                if (isOpen) {

                    renderResults(
                        input.value
                    );


                    setTimeout(
                        () => input.focus(),
                        30
                    );

                }

            }
        );


        closeButton.addEventListener(
            "click",
            closeSearch
        );


        input.addEventListener(
            "input",
            () => {

                renderResults(
                    input.value
                );

            }
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


        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Escape"
                ) {

                    closeSearch();

                }

            }
        );

    }


    /* =========================================
       التشغيل
    ========================================= */

    loadFonts();


    saveLastChapter();


    createVolumeFolders();


    createSpoilerSystem();


    createSiteSettings();


    createReaderSettings();


    createSiteSearch();


    applySiteSettings();


    applyReaderSettings();


    createReadingProgress();


    updateCompletedChapterMarks();


    createContinueReading();


    if (isChapterPage()) {

        restoreChapterProgress();

    }

});
