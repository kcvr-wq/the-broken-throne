export const SITE = Object.freeze({
    name: "THE BROKEN THRONE",
    shortName: "TBT",
    volumeName: "PATH OF THE VOID",
    version: "1.1"
});


export const CHAPTERS = Object.freeze([
    {
        number: "01",
        title: "حين بدأت السماء بالصمت",
        available: true
    },

    {
        number: "02",
        title: "قريبًا",
        available: false
    },

    {
        number: "03",
        title: "قريبًا",
        available: false
    }
]);


export function normalizeChapter(value) {

    const number =
        Number.parseInt(
            String(value)
                .replace(/^chapter-/i, ""),
            10
        );


    if (
        !Number.isFinite(number) ||
        number <= 0
    ) {
        return "01";
    }


    return String(number).padStart(
        2,
        "0"
    );
}


export function chapterPath(number) {

    const chapter =
        normalizeChapter(number);


    return (
        `PATH%20OF%20THE%20VOID/` +
        `chapter-${chapter}.html`
    );

}


export function getChapter(number) {

    const normalized =
        normalizeChapter(number);


    return (
        CHAPTERS.find(
            chapter =>
                chapter.number === normalized
        ) || null
    );

}
