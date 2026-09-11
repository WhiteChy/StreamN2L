// ============================================================
// StreamN2L Demo
// ============================================================


// ------------------------------------------------------------
// Examples shown on the webpage
// ------------------------------------------------------------

const examples = [
    "example1",
    "example2"
];


// ------------------------------------------------------------
// Audio files
//
// Change this list according to the methods you want to show.
// ------------------------------------------------------------

const methods = [
    {
        file: "normal.wav",
        name: "Normal Speech",
        category: "reference"
    },

    {
        file: "lombard.wav",
        name: "Lombard Speech",
        category: "reference"
    },

    {
        file: "cyclegan.wav",
        name: "CycleGAN",
        category: "baseline"
    },

    {
        file: "stargan.wav",
        name: "StarGAN",
        category: "baseline"
    },

    {
        file: "pgd_n2l.wav",
        name: "PGD-N2L",
        category: "baseline"
    },

    {
        file: "streamvc.wav",
        name: "StreamVC",
        category: "baseline"
    },

    {
        file: "meanvc.wav",
        name: "MeanVC",
        category: "baseline"
    },

    {
        file: "meanvc_p.wav",
        name: "MeanVC-P",
        category: "baseline"
    },

    {
        file: "meanvc2_p.wav",
        name: "MeanVC2-P",
        category: "baseline"
    },

    {
        file: "streamn2l.wav",
        name: "StreamN2L",
        category: "ours"
    }
];


// ------------------------------------------------------------
// SNR configuration
// ------------------------------------------------------------

const snrOptions = {
    clean: {
        label: "Clean / No Noise",
        folder: null
    },

    "-10": {
        label: "SNR = −10 dB",
        folder: "snr_-10dB"
    },

    "-7.5": {
        label: "SNR = −7.5 dB",
        folder: "snr_-7.5dB"
    },

    "-5": {
        label: "SNR = −5 dB",
        folder: "snr_-5dB"
    },

    "-2.5": {
        label: "SNR = −2.5 dB",
        folder: "snr_-2.5dB"
    },

    "0": {
        label: "SNR = 0 dB",
        folder: "snr_0dB"
    }
};


// ------------------------------------------------------------
// Current SNR
// ------------------------------------------------------------

let currentSNR = "clean";


// ------------------------------------------------------------
// Generate examples
// ------------------------------------------------------------

function renderExamples() {

    const container =
        document.getElementById(
            "examples-container"
        );

    container.innerHTML = "";

    examples.forEach(
        (example, index) => {

            const exampleCard =
                createExampleCard(
                    example,
                    index + 1
                );

            container.appendChild(
                exampleCard
            );
        }
    );

    checkMissingAudio();
}


// ------------------------------------------------------------
// Create one example card
// ------------------------------------------------------------

function createExampleCard(
    example,
    number
) {

    const card =
        document.createElement(
            "div"
        );

    card.className =
        "example-card";


    // --------------------------------------------------------
    // Header
    // --------------------------------------------------------

    const header =
        document.createElement(
            "div"
        );

    header.className =
        "example-header";


    const title =
        document.createElement(
            "div"
        );

    title.className =
        "example-title";

    title.innerHTML =
        `<span class="example-number">
            Example ${number}
         </span>`;


    const condition =
        document.createElement(
            "div"
        );

    condition.className =
        "example-condition";

    condition.textContent =
        snrOptions[currentSNR].label;


    header.appendChild(title);
    header.appendChild(condition);


    // --------------------------------------------------------
    // Audio list
    // --------------------------------------------------------

    const audioList =
        document.createElement(
            "div"
        );

    audioList.className =
        "audio-list";


    methods.forEach(
        method => {

            const item =
                createAudioItem(
                    example,
                    method
                );

            audioList.appendChild(
                item
            );
        }
    );


    card.appendChild(header);
    card.appendChild(audioList);

    return card;
}


// ------------------------------------------------------------
// Create audio item
// ------------------------------------------------------------

function createAudioItem(
    example,
    method
) {

    const item =
        document.createElement(
            "div"
        );

    item.className =
        `audio-item ${method.category}`;


    // --------------------------------------------------------
    // Method name
    // --------------------------------------------------------

    const info =
        document.createElement(
            "div"
        );

    info.className =
        "audio-info";


    const name =
        document.createElement(
            "div"
        );

    name.className =
        "audio-name";

    name.textContent =
        method.name;


    const category =
        document.createElement(
            "div"
        );

    category.className =
        "audio-category";

    if (method.category === "ours") {

        category.textContent =
            "Ours";

    } else if (
        method.category === "reference"
    ) {

        category.textContent =
            "Reference";

    } else {

        category.textContent =
            "Baseline";
    }


    info.appendChild(name);
    info.appendChild(category);


    // --------------------------------------------------------
    // Audio
    // --------------------------------------------------------

    const audio =
        document.createElement(
            "audio"
        );

    audio.controls = true;

    audio.preload = "none";

    audio.dataset.filename =
        method.file;

    audio.src =
        getAudioPath(
            example,
            method.file
        );


    // --------------------------------------------------------
    // Stop other audio when this one starts
    // --------------------------------------------------------

    audio.addEventListener(
        "play",
        () => {

            document
                .querySelectorAll(
                    "audio"
                )
                .forEach(
                    other => {

                        if (
                            other !== audio
                            && !other.paused
                        ) {
                            other.pause();
                        }

                    }
                );

        }
    );


    item.appendChild(info);
    item.appendChild(audio);

    return item;
}


// ------------------------------------------------------------
// Generate audio path
// ------------------------------------------------------------

function getAudioPath(
    example,
    filename
) {

    if (currentSNR === "clean") {

        return `audio/${example}/${filename}`;

    }

    const folder =
        snrOptions[currentSNR].folder;

    return `audio/${example}/${folder}/${filename}`;
}


// ------------------------------------------------------------
// Change SNR
// ------------------------------------------------------------

function changeSNR(
    snr
) {

    // --------------------------------------------------------
    // Stop all audio
    // --------------------------------------------------------

    document
        .querySelectorAll(
            "audio"
        )
        .forEach(
            audio => {

                audio.pause();
                audio.currentTime = 0;

            }
        );


    currentSNR = snr;


    // --------------------------------------------------------
    // Update current condition
    // --------------------------------------------------------

    document
        .getElementById(
            "current-snr"
        )
        .textContent =
        snrOptions[snr].label;


    // --------------------------------------------------------
    // Re-render examples
    // --------------------------------------------------------

    renderExamples();


    // --------------------------------------------------------
    // Update button states
    // --------------------------------------------------------

    document
        .querySelectorAll(
            ".snr-button"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.snr === snr
                );

            }
        );
}


// ------------------------------------------------------------
// Check missing audio
// ------------------------------------------------------------

function checkMissingAudio() {

    document
        .querySelectorAll(
            "audio"
        )
        .forEach(
            audio => {

                audio.addEventListener(
                    "error",
                    () => {

                        const item =
                            audio.closest(
                                ".audio-item"
                            );

                        if (item) {

                            item.classList.add(
                                "audio-missing"
                            );

                        }

                    }
                );

            }
        );
}


// ------------------------------------------------------------
// SNR button events
// ------------------------------------------------------------

document
    .querySelectorAll(
        ".snr-button"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    changeSNR(
                        button.dataset.snr
                    );

                }
            );

        }
    );


// ------------------------------------------------------------
// Initial render
// ------------------------------------------------------------

renderExamples();