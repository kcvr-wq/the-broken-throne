import {
    normalizeChapter
} from "./config.js";


export const KEYS = Object.freeze({

    intro:
        "sov_intro_seen",

    lastChapter:
        "sov_last_chapter",

    siteTheme:
        "sov_site_theme",

    siteMotion:
        "sov_site_motion",

    readerSize:
        "sov_reader_size",

    readerFont:
        "sov_reader_font",

    readerWidth:
        "sov_reader_width",

    readerLine:
        "sov_reader_line",

    readerParagraph:
        "sov_reader_paragraph",

    readerMode:
        "sov_reader_mode"

});


function safeGet(
    storage,
    key
) {

    try {

        return storage.getItem(
            key
        );

    } catch {

        return null;

    }

}


function safeSet(
    storage,
    key,
    value
) {

    try {

        storage.setItem(
            key,
            String(value)
        );

        return true;

    } catch {

        return false;

    }

}


export const store = {

    get(
        key,
        fallback = null
    ) {

        return (
            safeGet(
                window.localStorage,
                key
            ) ?? fallback
        );

    },


    set(
        key,
        value
    ) {

        return safeSet(
            window.localStorage,
            key,
            value
        );

    },


    sessionGet(
        key,
        fallback = null
    ) {

        return (
            safeGet(
                window.sessionStorage,
                key
            ) ?? fallback
        );

    },


    sessionSet(
        key,
        value
    ) {

        return safeSet(
            window.sessionStorage,
            key,
            value
        );

    },


    remove(
        key
    ) {

        try {

            window.localStorage
                .removeItem(key);

        } catch {}

    },


    getLastChapter() {

        return normalizeChapter(
            this.get(
                KEYS.lastChapter,
                "01"
            )
        );

    },


    setLastChapter(
        number
    ) {

        return this.set(
            KEYS.lastChapter,
            normalizeChapter(number)
        );

    },


    getChapter(
        number
    ) {

        const chapter =
            normalizeChapter(number);


        const prefix =
            `sov_chapter_${chapter}`;


        const progress =
            Number.parseFloat(
                this.get(
                    `${prefix}_progress`,
                    "0"
                )
            );


        const completed =
            this.get(
                `${prefix}_completed`,
                "false"
            ) === "true";


        const positionRatio =
            Number.parseFloat(
                this.get(
                    `${prefix}_position_ratio`,
                    "NaN"
                )
            );


        const oldPosition =
            Number.parseFloat(
                this.get(
                    `${prefix}_position`,
                    "NaN"
                )
            );


        return {

            number: chapter,

            progress:
                completed
                    ? 100
                    : (
                        Number.isFinite(progress)
                            ? Math.min(
                                100,
                                Math.max(
                                    0,
                                    progress
                                )
                            )
                            : 0
                    ),

            completed,

            positionRatio:
                Number.isFinite(
                    positionRatio
                )
                    ? Math.min(
                        1,
                        Math.max(
                            0,
                            positionRatio
                        )
                    )
                    : null,

            oldPosition:
                Number.isFinite(
                    oldPosition
                )
                    ? Math.max(
                        0,
                        oldPosition
                    )
                    : null

        };

    },


    setChapter(
        number,
        state
    ) {

        const chapter =
            normalizeChapter(number);


        const prefix =
            `sov_chapter_${chapter}`;


        this.set(
            `${prefix}_progress`,
            state.progress
        );


        this.set(
            `${prefix}_completed`,
            state.completed
                ? "true"
                : "false"
        );


        if (
            Number.isFinite(
                state.positionRatio
            )
        ) {

            this.set(
                `${prefix}_position_ratio`,
                state.positionRatio
            );

        }


        if (
            Number.isFinite(
                state.position
            )
        ) {

            this.set(
                `${prefix}_position`,
                state.position
            );

        }


        this.setLastChapter(
            chapter
        );

    }

};
