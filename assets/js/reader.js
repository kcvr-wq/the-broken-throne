import {
    CHAPTERS,
    chapterPath,
    getChapter,
    normalizeChapter
} from "./config.js";

import {
    KEYS,
    store
} from "./storage.js";


document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (
            document.body.dataset.page !==
            "reader"
        ) {
            return;
        }


        const content =
            document.getElementById(
                "chapterContent"
            );


        const progressBar =
            document.getElementById(
                "readingProgressBar"
            );


        const settingsButton =
            document.getElementById(
                "settingsButton"
            );


        const closeSettings =
            document.getElementById(
                "closeSettings"
            );


        const settingsOverlay =
            document.getElementById(
                "settingsOverlay"
            );


        const fullscreenButton =
            document.getElementById(
                "fullscreenButton"
            );


        const chapterListButton =
            document.getElementById(
                "chapterListButton"
            );


        if (
            !content ||
            !progressBar
        ) {
            return;
        }


        const chapterNumber =
            normalizeChapter(
                document.body.dataset.chapter ||
                "01"
            );


        let saveTimer =
            null;


        let saveFrame =
            null;


        let uiTimer =
            null;


        /* =================================================
           PROGRESS
        ================================================= */


        function maxScroll() {

            return Math.max(
                0,
                document.documentElement
                    .scrollHeight -
                window.innerHeight
            );

        }


        function getProgress() {

            const max =
                maxScroll();


            if (
                max <= 0
            ) {

                return 0;

            }


            return Math.min(
                100,
                Math.max(
                    0,
                    (
                        window.scrollY /
                        max
                    ) * 100
                )
            );

        }


        function updateProgress() {

            progressBar.style.width =
                `${getProgress()}%`;

        }


        function saveState() {

            const progress =
                getProgress();


            const completed =
                progress >= 98;


            const max =
                maxScroll();


            const positionRatio =
                max > 0
                    ? Math.min(
                        1,
                        Math.max(
                            0,
                            window.scrollY /
                            max
                        )
                    )
                    : 0;


            store.setChapter(
                chapterNumber,
                {

                    progress:
                        completed
                            ? 100
                            : progress,

                    completed,

                    positionRatio,

                    position:
                        window.scrollY

                }
            );


            updateProgress();

        }


        function scheduleSave() {

            if (
                !saveFrame
            ) {

                saveFrame =
                    window.requestAnimationFrame(
                        () => {

                            saveFrame =
                                null;

                            updateProgress();

                        }
                    );

            }


            window.clearTimeout(
                saveTimer
            );


            saveTimer =
                window.setTimeout(
                    saveState,
                    700
                );

        }


        /* =================================================
           RESTORE
        ================================================= */


        function restorePosition() {

            const state =
                store.getChapter(
                    chapterNumber
                );


            const max =
                maxScroll();


            if (
                max <= 0
            ) {

                updateProgress();

                return;

            }


            let target =
                null;


            if (
                state.positionRatio !==
                null
            ) {

                target =
                    state.positionRatio *
                    max;

            } else if (
                state.oldPosition !==
                null &&
                state.oldPosition > 20
            ) {

                target =
                    Math.min(
                        state.oldPosition,
                        max
                    );

            }


            if (
                target !== null &&
                target > 20
            ) {

                window.scrollTo({
                    top: target,
                    behavior: "auto"
                });

            }


            updateProgress();

        }


        /* =================================================
           SETTINGS PANEL
        ================================================= */


        function closePanel() {

            settingsOverlay?.classList.remove(
                "open"
            );

        }


        settingsButton?.addEventListener(
            "click",
            () => {

                if (
                    !settingsOverlay
                ) {
                    return;
                }


                settingsOverlay.classList.add(
                    "open"
                );


                document.body.classList.remove(
                    "reader-ui-hidden"
                );

            }
        );


        closeSettings?.addEventListener(
            "click",
            closePanel
        );


        settingsOverlay?.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    settingsOverlay
                ) {

                    closePanel();

                }

            }
        );


        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Escape"
                ) {

                    closePanel();

                }

            }
        );


        /* =================================================
           SETTINGS BINDER
        ================================================= */


        function bindReaderSetting({
            selector,
            dataset,
            key,
            apply
        }) {

            const options =
                document.querySelectorAll(
                    selector
                );


            if (
                !options.length
            ) {
                return;
            }


            options.forEach(
                option => {

                    option.addEventListener(
                        "click",
                        () => {

                            const value =
                                option.dataset[
                                    dataset
                                ];


                            apply(
                                value
                            );


                            options.forEach(
                                item => {

                                    item.classList.toggle(
                                        "active",
                                        item === option
                                    );

                                }
                            );


                            store.set(
                                key,
                                value
                            );


                            updateProgress();

                        }
                    );

                }
            );


            const saved =
                store.get(
                    key
                );


            if (
                saved !== null
            ) {

                apply(
                    saved
                );


                options.forEach(
                    option => {

                        option.classList.toggle(
                            "active",
                            option.dataset[
                                dataset
                            ] === saved
                        );

                    }
                );

            }

        }


        bindReaderSetting({

            selector:
                "[data-size]",

            dataset:
                "size",

            key:
                KEYS.readerSize,

            apply:
                value => {

                    document.documentElement
                        .style
                        .setProperty(
                            "--reader-size",
                            `${value}px`
                        );

                }

        });


        bindReaderSetting({

            selector:
                "[data-font]",

            dataset:
                "font",

            key:
                KEYS.readerFont,

            apply:
                value => {

                    document.body.classList.toggle(
                        "amiri-mode",
                        value === "amiri"
                    );

                }

        });


        bindReaderSetting({

            selector:
                "[data-width]",

            dataset:
                "width",

            key:
                KEYS.readerWidth,

            apply:
                value => {

                    document.documentElement
                        .style
                        .setProperty(
                            "--reader-width",
                            `${value}px`
                        );

                }

        });


        bindReaderSetting({

            selector:
                "[data-line]",

            dataset:
                "line",

            key:
                KEYS.readerLine,

            apply:
                value => {

                    document.documentElement
                        .style
                        .setProperty(
                            "--reader-line-height",
                            value
                        );

                }

        });


        bindReaderSetting({

            selector:
                "[data-paragraph]",

            dataset:
                "paragraph",

            key:
                KEYS.readerParagraph,

            apply:
                value => {

                    document.documentElement
                        .style
                        .setProperty(
                            "--reader-paragraph-space",
                            `${value}px`
                        );

                }

        });


        bindReaderSetting({

            selector:
                "[data-mode]",

            dataset:
                "mode",

            key:
                KEYS.readerMode,

            apply:
                value => {

                    document.body.classList.remove(
                        "oled-mode",
                        "sepia-mode"
                    );


                    if (
                        value === "oled"
                    ) {

                        document.body.classList.add(
                            "oled-mode"
                        );

                    }


                    if (
                        value === "sepia"
                    ) {

                        document.body.classList.add(
                            "sepia-mode"
                        );

                    }

                }

        });


        /* =================================================
           CHAPTER LIST
        ================================================= */


        chapterListButton?.addEventListener(
            "click",
            () => {

                saveState();

                window.location.href =
                    "../chapters/index.html";

            }
        );


        /* =================================================
           FULLSCREEN
        ================================================= */


        function updateFullscreenLabel() {

            if (
                !fullscreenButton
            ) {
                return;
            }


            fullscreenButton.textContent =
                document.fullscreenElement
                    ? "خروج"
                    : "ملء الشاشة";

        }


        fullscreenButton?.addEventListener(
            "click",
            async () => {

                try {

                    if (
                        !document.fullscreenElement
                    ) {

                        await document
                            .documentElement
                            .requestFullscreen();

                    } else {

                        await document
                            .exitFullscreen();

                    }

                } catch {

                    document.body.classList.toggle(
                        "reader-ui-hidden"
                    );

                }


                updateFullscreenLabel();

            }
        );


        document.addEventListener(
            "fullscreenchange",
            updateFullscreenLabel
        );


        /* =================================================
           AUTO HIDE
        ================================================= */


        function showReaderUI() {

            document.body.classList.remove(
                "reader-ui-hidden"
            );


            window.clearTimeout(
                uiTimer
            );


            uiTimer =
                window.setTimeout(
                    () => {

                        if (
                            !settingsOverlay ||
                            !settingsOverlay.classList.contains(
                                "open"
                            )
                        ) {

                            document.body.classList.add(
                                "reader-ui-hidden"
                            );

                        }

                    },
                    2600
                );

        }


        document.addEventListener(
            "mousemove",
            showReaderUI,
            {
                passive: true
            }
        );


        document.addEventListener(
            "touchstart",
            showReaderUI,
            {
                passive: true
            }
        );


        document.addEventListener(
            "click",
            showReaderUI
        );


        document.addEventListener(
            "keydown",
            showReaderUI
        );


        /* =================================================
           CHAPTER NAVIGATION
        ================================================= */


        const previousLink =
            document.querySelector(
                ".chapter-nav-button.previous"
            );


        const nextLink =
            document.querySelector(
                ".chapter-nav-button.next"
            );


        const currentIndex =
            CHAPTERS.findIndex(
                chapter =>
                    chapter.number ===
                    chapterNumber
            );


        const previousChapter =
            currentIndex > 0
                ? CHAPTERS[
                    currentIndex - 1
                ]
                : null;


        const nextChapter =
            currentIndex >= 0
                ? CHAPTERS[
                    currentIndex + 1
                ]
                : null;


        function setupNavigation(
            link,
            targetChapter
        ) {

            if (
                !link
            ) {
                return;
            }


            if (
                targetChapter &&
                targetChapter.available
            ) {

                link.href =
                    `../${chapterPath(
                        targetChapter.number
                    )}`;


                link.classList.remove(
                    "disabled"
                );


                link.removeAttribute(
                    "aria-disabled"
                );


                return;

            }


            link.removeAttribute(
                "href"
            );


            link.classList.add(
                "disabled"
            );


            link.setAttribute(
                "aria-disabled",
                "true"
            );


            link.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                }
            );

        }


        setupNavigation(
            previousLink,
            previousChapter
        );


        setupNavigation(
            nextLink,
            nextChapter
        );


        /* =================================================
           EVENTS
        ================================================= */


        window.addEventListener(
            "scroll",
            scheduleSave,
            {
                passive: true
            }
        );


        window.addEventListener(
            "resize",
            updateProgress,
            {
                passive: true
            }
        );


        window.addEventListener(
            "pagehide",
            saveState
        );


        window.addEventListener(
            "beforeunload",
            saveState
        );


        window.addEventListener(
            "load",
            restorePosition,
            {
                once: true
            }
        );


        /* =================================================
           INIT
        ================================================= */


        store.setLastChapter(
            chapterNumber
        );


        updateFullscreenLabel();
        updateProgress();


        window.setTimeout(
            restorePosition,
            180
        );


        showReaderUI();

    }
);
