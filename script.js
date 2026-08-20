document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       مفاتيح التخزين
    ========================================= */

    const SITE_SETTINGS_KEY =
        "brokenThroneSiteSettings";

    const READER_SETTINGS_KEY =
        "brokenThroneReaderSettings";

    const RECENT_CHAPTERS_KEY =
        "brokenThroneRecentChapters";

    const RECENT_CHAPTERS_LIMIT = 5;


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


            folder.removeAttribute("open");

            content.style.overflow = "hidden";
            content.style.maxHeight = "0px";
            content.style.opacity = "0";
            content.style.transform =
                "translateY(-10px)";
            content.style.paddingTop = "0px";
            content.style.paddingBottom = "0px";

            content.style.transition =
                "max-height 0.5s cubic-bezier(0.22, 1, 0.36, 1), " +
                "opacity 0.35s ease, " +
                "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), " +
                "padding 0.5s ease";

            let closeTimer = null;
            let isAnimating = false;


            function openFolder() {

                if (closeTimer) {
                    clearTimeout(closeTimer);
                    closeTimer = null;
                }

                isAnimating = true;

                folder.setAttribute(
                    "open",
                    ""
                );

                content.style.maxHeight = "0px";
                content.style.opacity = "0";
                content.style.transform =
                    "translateY(-10px)";
                content.style.paddingTop = "0px";
                content.style.paddingBottom = "0px";

                requestAnimationFrame(() => {

                    requestAnimationFrame(() => {

                        content.style.maxHeight =
                            content.scrollHeight + "px";

                        content.style.opacity = "1";

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
                        folder.hasAttribute("open")
                    ) {

                        content.style.maxHeight =
                            "none";

                    }

                    isAnimating = false;

                }, 520);

            }


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

                content.style.paddingTop =
                    "18px";

                content.style.paddingBottom =
                    "18px";

                requestAnimationFrame(() => {

                    requestAnimationFrame(() => {

                        content.style.maxHeight =
                            "0px";

                        content.style.opacity = "0";

                        content.style.transform =
                            "translateY(-10px)";

                        content.style.paddingTop =
                            "0px";

                        content.style.paddingBottom =
                            "0px";

                    });

                });

                closeTimer = setTimeout(() => {

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
                        folder.hasAttribute("open")
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


                if (
                    spoilerInfo.classList.contains(
                        "show"
                    )
                ) {

                    button.textContent =
                        "إخفاء الحرق";

                } else {

                    button.textContent =
                        "حرق";

                }

            }
        );

    });


    /* =========================================
       تحميل الخطوط
    ========================================= */

    if (
        !document.querySelector(
            "#broken-throne-fonts"
        )
    ) {

        const fontLink =
            document.createElement("link");

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

    function loadSettings(
        key,
        defaults
    ) {

        try {

            const saved =
                localStorage.getItem(
                    key
                );

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

        try {

            localStorage.setItem(
                SITE_SETTINGS_KEY,
                JSON.stringify(
                    siteSettings
                )
            );

        } catch (error) {

            console.warn(
                "تعذر حفظ إعدادات الموقع.",
                error
            );

        }

    }


    /* =========================================
       حفظ إعدادات الفصل
    ========================================= */

    function saveReaderSettings() {

        try {

            localStorage.setItem(
                READER_SETTINGS_KEY,
                JSON.stringify(
                    readerSettings
                )
            );

        } catch (error) {

            console.warn(
                "تعذر حفظ إعدادات الفصل.",
                error
            );

        }

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

                        const value =
                            button.dataset.value;

                        siteSettings[
                            setting
                        ] = value;

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
            fonts[
                siteSettings.font
            ] ||
            fonts.naskh
        );


        root.style.setProperty(
            "--site-text-scale",
            sizes[
                siteSettings.size
            ] ||
            sizes.medium
        );


        root.style.setProperty(
            "--site-line-height",
            spacings[
                siteSettings.spacing
            ] ||
            spacings.medium
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

                const value =
                    button.dataset.value;

                button.classList.toggle(
                    "active",
                    siteSettings[
                        setting
                    ] === value
                );

            });

    }


    /* =========================================
       إنشاء إعدادات الفصل
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

                        const setting =
                            button.dataset
                                .readerSetting;

                        const value =
                            button.dataset.value;

                        readerSettings[
                            setting
                        ] = value;

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
            fonts[
                readerSettings.font
            ] ||
            fonts.naskh
        );


        reader.style.setProperty(
            "--reader-text-size",
            sizes[
                readerSettings.size
            ] ||
            sizes.medium
        );


        reader.style.setProperty(
            "--reader-line-height",
            spacings[
                readerSettings.spacing
            ] ||
            spacings.medium
        );


        reader.style.setProperty(
            "--reader-width",
            widths[
                readerSettings.width
            ] ||
            widths.medium
        );


        reader.style.setProperty(
            "--reader-paragraph-spacing",
            paragraphSpacing[
                readerSettings.paragraph
            ] ||
            paragraphSpacing.medium
        );


        reader.style.setProperty(
            "--reader-text-align",
            alignments[
                readerSettings.align
            ] ||
            alignments.right
        );


        document
            .querySelectorAll(
                "[data-reader-setting]"
            )
            .forEach((button) => {

                const setting =
                    button.dataset
                        .readerSetting;

                const value =
                    button.dataset.value;

                button.classList.toggle(
                    "active",
                    readerSettings[
                        setting
                    ] === value
                );

            });

    }


    /* =========================================
       نظام تابع القراءة
    ========================================= */

    function isChapterPage() {

        return Boolean(
            document.querySelector(
                ".chapter-reader"
            )
        );

    }


    function loadContinueReading() {

        try {

            const saved =
                localStorage.getItem(
                    "brokenThroneLastChapter"
                );

            if (!saved) {
                return null;
            }

            return JSON.parse(saved);

        } catch (error) {

            return null;

        }

    }


    function saveContinueReading(
        title,
        url
    ) {

        try {

            localStorage.setItem(
                "brokenThroneLastChapter",
                JSON.stringify({
                    title,
                    url,
                    updatedAt:
                        Date.now()
                })
            );

        } catch (error) {

            console.warn(
                "تعذر حفظ آخر فصل.",
                error
            );

        }

    }


    function getChapterTitle() {

        const heading =
            document.querySelector(
                ".chapter-reader h1"
            );

        if (
            heading &&
            heading.textContent.trim()
        ) {

            return heading.textContent
                .replace(
                    /\s+/g,
                    " "
                )
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


    function saveCurrentChapter() {

        if (!isChapterPage()) {
            return;
        }


        saveContinueReading(
            getChapterTitle(),
            window.location.pathname
        );

    }


    /* =========================================
       سجل آخر الفصول
    ========================================= */

    function loadRecentChapters() {

        try {

            const saved =
                localStorage.getItem(
                    RECENT_CHAPTERS_KEY
                );

            if (!saved) {
                return [];
            }

            const data =
                JSON.parse(saved);

            if (!Array.isArray(data)) {
                return [];
            }

            return data;

        } catch (error) {

            return [];

        }

    }


    function saveRecentChapters(
        chapters
    ) {

        try {

            localStorage.setItem(
                RECENT_CHAPTERS_KEY,
                JSON.stringify(
                    chapters
                )
            );

        } catch (error) {

            console.warn(
                "تعذر حفظ سجل الفصول.",
                error
            );

        }

    }


    function escapeHTML(
        text
    ) {

        return String(
            text || ""
        )
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }


    function addCurrentChapterToRecent() {

        if (!isChapterPage()) {
            return;
        }


        const url =
            window.location.pathname;


        const title =
            getChapterTitle();


        let chapters =
            loadRecentChapters();


        chapters =
            chapters.filter(
                (chapter) =>
                    chapter &&
                    chapter.url !== url
            );


        chapters.unshift({

            url: url,

            title: title,

            visitedAt:
                Date.now()

        });


        chapters =
            chapters.slice(
                0,
                RECENT_CHAPTERS_LIMIT
            );


        saveRecentChapters(
            chapters
        );

    }


    function createRecentChapters() {

        const homeSections =
            document.querySelector(
                ".home-sections"
            );

        if (!homeSections) {
            return;
        }


        const existing =
            document.querySelector(
                ".recent-chapters-section"
            );

        if (existing) {
            existing.remove();
        }


        const chapters =
            loadRecentChapters();


        if (!chapters.length) {
            return;
        }


        const section =
            document.createElement(
                "section"
            );


        section.className =
            "recent-chapters-section";


        section.innerHTML = `

            <div class="recent-chapters-heading">

                <span>
                    سجل القراءة
                </span>

                <h2>
                    آخر الفصول
                </h2>

            </div>


            <div class="recent-chapters-list">

                ${chapters
                    .map(
                        (
                            chapter,
                            index
                        ) => {

                            if (
                                !chapter ||
                                !chapter.url
                            ) {
                                return "";
                            }


                            return `

                                <a
                                    href="${escapeHTML(
                                        chapter.url
                                    )}"
                                    class="recent-chapter-card"
                                >

                                    <span
                                        class="recent-chapter-number"
                                    >
                                        ${String(
                                            index + 1
                                        ).padStart(
                                            2,
                                            "0"
                                        )}
                                    </span>


                                    <span
                                        class="recent-chapter-content"
                                    >

                                        <span
                                            class="recent-chapter-title"
                                        >
                                            ${escapeHTML(
                                                chapter.title
                                            )}
                                        </span>

                                        <span
                                            class="recent-chapter-path"
                                        >
                                            ${escapeHTML(
                                                chapter.url
                                            )}
                                        </span>

                                    </span>


                                    <span
                                        class="recent-chapter-arrow"
                                    >
                                        ←
                                    </span>

                                </a>

                            `;

                        }
                    )
                    .join("")}

            </div>

        `;


        /*
           يظهر السجل في بداية قسم
           المحتوى الرئيسي.
        */

        homeSections.prepend(
            section
        );

    }


    /* =========================================
       تشغيل
    ========================================= */

    saveCurrentChapter();

    addCurrentChapterToRecent();

    createVolumeFolders();

    createSiteSettings();

    createReaderSettings();

    applySiteSettings();

    applyReaderSettings();

    createRecentChapters();

});
