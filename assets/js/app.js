import {
    SITE,
    chapterPath,
    getChapter,
    normalizeChapter
} from "./config.js";

import {
    KEYS,
    store
} from "./storage.js";


const body =
    document.body;

const page =
    body?.dataset.page || "";


/* =====================================================
   BRAND
===================================================== */

function initBrand() {

    document
        .querySelectorAll(
            "[data-site-name]"
        )
        .forEach(
            element => {

                element.textContent =
                    SITE.name;

            }
        );


    document
        .querySelectorAll(
            "[data-short-name]"
        )
        .forEach(
            element => {

                element.textContent =
                    SITE.shortName;

            }
        );

}


/* =====================================================
   INTRO
===================================================== */

function initIntro() {

    const intro =
        document.getElementById(
            "intro"
        );


    const site =
        document.getElementById(
            "site"
        );


    if (
        !intro ||
        !site
    ) {
        return;
    }


    const seen =
        store.sessionGet(
            KEYS.intro
        ) === "true";


    if (seen) {

        intro.style.display =
            "none";

        site.classList.add(
            "show"
        );

        return;

    }


    site.classList.remove(
        "show"
    );


    window.setTimeout(
        () => {

            intro.classList.add(
                "hide"
            );


            site.classList.add(
                "show"
            );


            store.sessionSet(
                KEYS.intro,
                "true"
            );

        },
        2800
    );

}


/* =====================================================
   THEME
===================================================== */

function initTheme() {

    const options =
        document.querySelectorAll(
            "[data-theme]"
        );


    if (!options.length) {
        return;
    }


    function applyTheme(
        theme
    ) {

        const value =
            theme === "light"
                ? "light"
                : "dark";


        body.classList.toggle(
            "light-mode",
            value === "light"
        );


        options.forEach(
            option => {

                option.classList.toggle(
                    "active",
                    option.dataset.theme === value
                );

            }
        );


        store.set(
            KEYS.siteTheme,
            value
        );

    }


    options.forEach(
        option => {

            option.addEventListener(
                "click",
                () => {

                    applyTheme(
                        option.dataset.theme
                    );

                }
            );

        }
    );


    applyTheme(
        store.get(
            KEYS.siteTheme,
            "dark"
        )
    );

}


/* =====================================================
   MOTION
===================================================== */

function initMotion() {

    const options =
        document.querySelectorAll(
            "[data-motion]"
        );


    if (!options.length) {
        return;
    }


    function applyMotion(
        motion
    ) {

        const value =
            motion === "off"
                ? "off"
                : "on";


        body.classList.toggle(
            "no-motion",
            value === "off"
        );


        options.forEach(
            option => {

                option.classList.toggle(
                    "active",
                    option.dataset.motion === value
                );

            }
        );


        store.set(
            KEYS.siteMotion,
            value
        );

    }


    options.forEach(
        option => {

            option.addEventListener(
                "click",
                () => {

                    applyMotion(
                        option.dataset.motion
                    );

                }
            );

        }
    );


    applyMotion(
        store.get(
            KEYS.siteMotion,
            "on"
        )
    );

}


/* =====================================================
   HOME NAVIGATION
===================================================== */

function activateSection(
    hash,
    updateUrl = false
) {

    const id =
        String(hash || "")
            .replace(/^#/, "")
            .trim();


    if (!id) {
        return false;
    }


    const target =
        document.getElementById(
            id
        );


    if (
        !target ||
        !target.classList.contains(
            "page-section"
        )
    ) {

        return false;

    }


    document
        .querySelectorAll(
            ".page-section"
        )
        .forEach(
            section => {

                section.classList.toggle(
                    "active-section",
                    section === target
                );

            }
        );


    document
        .querySelectorAll(
            ".nav-link[data-section]"
        )
        .forEach(
            link => {

                link.classList.toggle(
                    "active",
                    link.dataset.section === id
                );

            }
        );


    if (updateUrl) {

        window.history.replaceState(
            null,
            "",
            `#${id}`
        );

    }


    window.scrollTo({
        top: 0,
        behavior: "auto"
    });


    return true;

}


function initNavigation() {

    document
        .querySelectorAll(
            ".nav-link[data-section]"
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    event => {

                        const href =
                            link.getAttribute(
                                "href"
                            );


                        if (
                            !href ||
                            !href.startsWith("#") ||
                            page !== "home"
                        ) {

                            return;

                        }


                        event.preventDefault();


                        activateSection(
                            href,
                            true
                        );

                    }
                );

            }
        );


    if (
        page !== "home"
    ) {
        return;
    }


    activateSection(
        window.location.hash || "#home"
    );


    window.addEventListener(
        "hashchange",
        () => {

            activateSection(
                window.location.hash
            );

        }
    );

}


/* =====================================================
   HOME READING
===================================================== */

function initHomeReading() {

    if (
        page !== "home"
    ) {
        return;
    }


    const start =
        document.getElementById(
            "startReading"
        );


    const continueReading =
        document.getElementById(
            "continueReading"
        );


    const chapterCount =
        document.getElementById(
            "chapterCount"
        );


    const availableChapters =
        document.querySelectorAll(
            ".chapter-count"
        );


    void availableChapters;


    if (
        chapterCount
    ) {

        chapterCount.textContent =
            "01";

    }


    if (
        start
    ) {

        start.href =
            chapterPath("01");

    }


    if (
        continueReading
    ) {

        const lastChapter =
            normalizeChapter(
                store.getLastChapter()
            );


        const saved =
            store.getChapter(
                lastChapter
            );


        const metadata =
            getChapter(
                lastChapter
            );


        const targetChapter =
            metadata?.available
                ? lastChapter
                : "01";


        continueReading.href =
            chapterPath(
                targetChapter
            );


        continueReading.textContent =
            (
                saved.progress > 0 &&
                targetChapter === lastChapter
            )
                ? "تابع القراءة"
                : "ابدأ القراءة";

    }

}


/* =====================================================
   INIT
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initBrand();
        initIntro();
        initTheme();
        initMotion();
        initNavigation();
        initHomeReading();

    }
);
