const EXAMPLE_COUNT = 12;


/*
 * File name -> Display name
 */
const METHODS = [
    {
        file: "normal.wav",
        name: "Normal Speech",
        type: "input",
        tag: "Input"
    },

    {
        file: "lombard.wav",
        name: "Lombard Speech",
        type: "target",
        tag: "Reference"
    },

    {
        file: "cyclegan.wav",
        name: "CycleGAN",
        type: "baseline",
        tag: "Baseline"
    },

    {
        file: "stargan.wav",
        name: "StarGAN",
        type: "baseline",
        tag: "Baseline"
    },

    {
        file: "pgd_n2l.wav",
        name: "PGD-N2L",
        type: "baseline",
        tag: "Baseline"
    },

    {
        file: "meanvc.wav",
        name: "MeanVC",
        type: "baseline",
        tag: "Baseline"
    },

    {
        file: "meanvc_p.wav",
        name: "MeanVC-P",
        type: "baseline",
        tag: "Baseline"
    },

    {
        file: "meanvc2_p.wav",
        name: "MeanVC2-P",
        type: "baseline",
        tag: "Baseline"
    },

    {
        file: "streamvc.wav",
        name: "StreamVC",
        type: "baseline",
        tag: "Baseline"
    },

    {
        file: "streamn2l.wav",
        name: "StreamN2L",
        type: "ours",
        tag: "Ours"
    }
];


const examplesContainer =
    document.getElementById("examples");


/*
 * Create all examples
 */
for (
    let i = 1;
    i <= EXAMPLE_COUNT;
    i++
) {

    createExample(i);

}


/*
 * Create one example card
 */
function createExample(exampleNumber) {

    const card =
        document.createElement("article");

    card.className = "example-card";


    /*
     * Header
     */
    const header =
        document.createElement("div");

    header.className =
        "example-header";


    const title =
        document.createElement("h3");

    title.className =
        "example-title";

    title.textContent =
        `Example ${exampleNumber}`;


    const number =
        document.createElement("span");

    number.className =
        "example-number";

    number.textContent =
        `Example ${String(exampleNumber).padStart(2, "0")}`;


    header.appendChild(title);

    header.appendChild(number);


    /*
     * Audio grid
     */
    const grid =
        document.createElement("div");

    grid.className =
        "audio-grid";


    /*
     * Add methods
     */
    METHODS.forEach(method => {

        const item =
            createAudioItem(
                exampleNumber,
                method
            );

        grid.appendChild(item);

    });


    card.appendChild(header);

    card.appendChild(grid);

    examplesContainer.appendChild(card);

}


/*
 * Create audio item
 */
function createAudioItem(
    exampleNumber,
    method
) {

    const item =
        document.createElement("div");

    item.className =
        "audio-item";


    if (method.type === "ours") {

        item.classList.add("ours");

    }


    if (method.type === "target") {

        item.classList.add("target");

    }


    /*
     * Label
     */
    const label =
        document.createElement("div");

    label.className =
        "audio-label";


    const name =
        document.createElement("div");

    name.className =
        "audio-name";

    name.textContent =
        method.name;


    const tag =
        document.createElement("span");

    tag.className =
        `audio-tag ${method.type}`;

    tag.textContent =
        method.tag;


    label.appendChild(name);

    label.appendChild(tag);


    /*
     * Audio element
     */
    const audio =
        document.createElement("audio");

    audio.className =
        "audio-player";

    audio.controls = true;

    audio.preload = "none";


    const src =
        `audio/example${exampleNumber}/${method.file}`;

    audio.src = src;


    /*
     * If a file does not exist,
     * hide this method automatically.
     */
    audio.addEventListener(
        "error",
        () => {

            item.remove();

        }
    );


    /*
     * Stop other audio when
     * this one starts playing.
     */
    audio.addEventListener(
        "play",
        () => {

            document
                .querySelectorAll(
                    ".audio-player"
                )
                .forEach(other => {

                    if (other !== audio) {

                        other.pause();

                    }

                });

        }
    );


    item.appendChild(label);

    item.appendChild(audio);


    return item;

}