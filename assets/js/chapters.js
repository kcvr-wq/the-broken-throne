import {
    CHAPTERS,
    chapterPath,
    normalizeChapter
} from "./config.js";

import {
    store
} from "./storage.js";


document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (
            document.body.dataset.page !==
            "chapters"
        ) {
            return;
        }


        const search =
            document.getElementById(
                "chapterSearch"
            );


        const sort =
            document.getElementById(
                "chapterSort"
            );


        const reset =
            document.getElementById(
                "resetFilters"
            );


        const chapterList =
            document.getElementById(
                "chapterList"
            );


        const empty =
            document.getElementById(
                "emptyState"
            );


        const volumeStatus =
            document.getElementById(
                "volumeStatus"
            );


        const summaryTitle =
            document.getElementById(
                "summaryTitle"
            );


        const summaryText =
            document.getElementById(
                "summaryText"
            );


        const summaryButton =
            document.getElementById(
                "summaryButton"
            );


        const summaryProgress =
            document.getElementById(
                "summaryProgressBar"
            );


        if (
            !search ||
            !sort ||
            !reset ||
            !chapterList ||
            !empty ||
            !summaryButton ||
            !summaryProgress
        ) {
            return;
        }


        function getProgress(
            number
        ) {

            return store.getChapter(
                number
            ).progress;

        }


        function getChapterData(
            number
        ) {

            const normalized =
                normalizeChapter(
                    number
                );


            return (
                CHAPTERS.find(
                    chapter =>
                        chapter.number === normalized
                ) || null
            );

        }


        function createChapterElement(
            chapter
        ) {

            const state =
                store.getChapter(
                    chapter.number
                );


            const element =
                document.createElement(
                    chapter.available
                        ? "a"
                        : "article"
                );


            element.className =
                `chapter${
                    chapter.available
                        ? ""
                        : " disabled"
                }`;


            element.dataset.number =
                String(
                    Number(
                        chapter.number
                    )
                );


            element.dataset.title =
                chapter.title;


            element.dataset.chapter =
                chapter.number;


            if (
                chapter.available
            ) {

                element.href =
                    `../${chapterPath(
                        chapter.number
                    )}`;

            } else {

                element.setAttribute(
                    "aria-disabled",
                    "true"
                );

            }


            const status =
                chapter.available
                    ? (
                        state.progress >= 100
                            ? "مكتمل"
                            : state.progress > 0
                                ? "قيد القراءة"
                                : "لم تبدأ القراءة"
                    )
                    : "غير متاح";


            element.innerHTML = `

                <span class="chapter-number">
                    ${chapter.number}
                </span>

                <span class="chapter-info">

                    <span class="chapter-label">
                        الفصل ${Number(chapter.number)}
                    </span>

                    <span class="chapter-title">
                        ${chapter.title}
                    </span>

                    <span class="chapter-meta">

                        <span class="chapter-status">
                            ${status}
                        </span>

                        ${
                            chapter.available
                                ? `
                                    <span class="chapter-progress-text">
                                        ${Math.round(state.progress)}%
                                    </span>
                                `
                                : ""
                        }

                    </span>

                </span>


                <span class="chapter-right">

                    <span class="chapter-progress-track">

                        <span
                            class="chapter-progress-bar"
                            style="width:${state.progress}%"
                        ></span>

                    </span>

                    <span class="chapter-open">
                        ${chapter.available ? "←" : "—"}
                    </span>

                </span>

            `;


            return element;

        }


        function renderList() {

            chapterList.innerHTML =
                "";


            CHAPTERS.forEach(
                chapter => {

                    chapterList.appendChild(
                        createChapterElement(
                            chapter
                        )
                    );

                }
            );

        }


        function updateSummary() {

            const lastChapter =
                normalizeChapter(
                    store.getLastChapter()
                );


            const metadata =
                getChapterData(
                    lastChapter
                ) ||
                CHAPTERS[0];


            const state =
                store.getChapter(
                    metadata.number
                );


            const target =
                metadata.available
                    ? metadata
                    : CHAPTERS[0];


            if (
                state.progress > 0 &&
                metadata.available
            ) {

                summaryTitle.textContent =
                    `الفصل ${metadata.number} — ${metadata.title}`;


                summaryText.textContent =
                    state.completed
                        ? "الفصل مكتمل."
                        : `آخر تقدم: ${Math.round(
                            state.progress
                        )}%`;


                summaryButton.textContent =
                    state.completed
                        ? "إعادة القراءة"
                        : "تابع القراءة";


                summaryProgress.style.width =
                    `${state.progress}%`;

            } else {

                summaryTitle.textContent =
                    "لم تبدأ القراءة بعد";


                summaryText.textContent =
                    "ابدأ الفصل الأول للبدء.";


                summaryButton.textContent =
                    "ابدأ القراءة";


                summaryProgress.style.width =
                    "0%";

            }


            summaryButton.href =
                `../${chapterPath(
                    target.number
                )}`;

        }


        function updateVolumeStatus() {

            const available =
                CHAPTERS.filter(
                    chapter =>
                        chapter.available
                );


            const completed =
                available.filter(
                    chapter =>
                        getProgress(
                            chapter.number
                        ) >= 100
                ).length;


            const active =
                available.some(
                    chapter => {

                        const progress =
                            getProgress(
                                chapter.number
                            );


                        return (
                            progress > 0 &&
                            progress < 100
                        );

                    }
                );


            if (
                !volumeStatus
            ) {
                return;
            }


            let text =
                `${available.length} فصل متاح`;


            if (
                completed
            ) {

                text +=
                    ` · ${completed} مكتمل`;

            } else if (
                active
            ) {

                text +=
                    " · قيد القراءة";

            }


            volumeStatus.textContent =
                text;

        }


        function renderFilter() {

            const query =
                search.value
                    .trim()
                    .toLowerCase();


            const mode =
                sort.value;


            const items =
                Array.from(
                    chapterList.querySelectorAll(
                        ".chapter"
                    )
                );


            items.sort(
                (
                    a,
                    b
                ) => {

                    const numberA =
                        Number(
                            a.dataset.number
                        );


                    const numberB =
                        Number(
                            b.dataset.number
                        );


                    const progressA =
                        getProgress(
                            a.dataset.chapter
                        );


                    const progressB =
                        getProgress(
                            b.dataset.chapter
                        );


                    if (
                        mode ===
                        "number-desc"
                    ) {

                        return (
                            numberB -
                            numberA
                        );

                    }


                    if (
                        mode ===
                        "progress-desc"
                    ) {

                        return (
                            progressB -
                            progressA ||
                            numberA -
                            numberB
                        );

                    }


                    if (
                        mode ===
                        "progress-asc"
                    ) {

                        return (
                            progressA -
                            progressB ||
                            numberA -
                            numberB
                        );

                    }


                    return (
                        numberA -
                        numberB
                    );

                }
            );


            let visible =
                0;


            items.forEach(
                item => {

                    const title =
                        (
                            item.dataset.title ||
                            ""
                        ).toLowerCase();


                    const number =
                        (
                            item.dataset.number ||
                            ""
                        ).toLowerCase();


                    const label =
                        (
                            item.querySelector(
                                ".chapter-label"
                            )?.textContent ||
                            ""
                        ).toLowerCase();


                    const matches =
                        !query ||
                        title.includes(query) ||
                        number.includes(query) ||
                        label.includes(query);


                    item.classList.toggle(
                        "hidden",
                        !matches
                    );


                    if (
                        matches
                    ) {

                        visible++;

                    }


                    chapterList.appendChild(
                        item
                    );

                }
            );


            empty.classList.toggle(
                "show",
                visible === 0
            );

        }


        function updateAll() {

            renderList();
            updateSummary();
            updateVolumeStatus();
            renderFilter();

        }


        document
            .querySelectorAll(
                ".volume-header"
            )
            .forEach(
                header => {

                    header.addEventListener(
                        "click",
                        () => {

                            const volume =
                                header.closest(
                                    ".volume-item"
                                );


                            if (
                                !volume
                            ) {
                                return;
                            }


                            const isOpen =
                                volume.classList.contains(
                                    "open"
                                );


                            document
                                .querySelectorAll(
                                    ".volume-item"
                                )
                                .forEach(
                                    item => {

                                        item.classList.remove(
                                            "open"
                                        );


                                        item
                                            .querySelector(
                                                ".volume-header"
                                            )
                                            ?.setAttribute(
                                                "aria-expanded",
                                                "false"
                                            );

                                    }
                                );


                            if (
                                !isOpen
                            ) {

                                volume.classList.add(
                                    "open"
                                );


                                header.setAttribute(
                                    "aria-expanded",
                                    "true"
                                );

                            }

                        }
                    );

                }
            );


        search.addEventListener(
            "input",
            renderFilter
        );


        sort.addEventListener(
            "change",
            renderFilter
        );


        reset.addEventListener(
            "click",
            () => {

                search.value =
                    "";


                sort.value =
                    "number-asc";


                renderFilter();

            }
        );


        window.addEventListener(
            "pageshow",
            updateAll
        );


        window.addEventListener(
            "storage",
            updateAll
        );


        updateAll();

    }
);
