/* ============================================================
   StreamN2L Demo
   ============================================================ */


/* ============================================================
   Main Demo
   ============================================================ */

const snrOptions = {

    clean: {
        label: "Clean / No Noise",
        folder: null
    },

    "-10": {
        label: "SNR = −10 dB",
        folder: "snr_-10dB"
    }

};


/*
 * Main demo methods
 */

const methods = [

    {
        file: "normal.wav",
        name: "Normal Speech",
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
        name: "MeanVC-Pretrained",
        category: "baseline"
    },

    {
        file: "meanvc2_p.wav",
        name: "MeanVC2-Pretrained",
        category: "baseline"
    },
    {
        file: "streamn2l.wav",
        name: "StreamN2L",
        category: "ours"
    },
    {
        file: "pgd_n2l.wav",
        name: "PGD-N2L",
        category: "baseline"
    },
    {
        file: "lombard.wav",
        name: "Lombard Speech",
        category: "reference"
    }
];


/*
 * Current main-demo SNR
 *
 * Important:
 * -10 dB is the default condition.
 */

window.currentSNR = "-10";


/* ============================================================
   Main Demo Audio Path
   ============================================================ */

function getAudioPath(example, filename) {

    const option =
        snrOptions[window.currentSNR];

    /*
     * Clean audio
     */
    if (
        window.currentSNR === "clean"
        || option.folder === null
    ) {

        return (
            `audio/${example}/${filename}`
        );

    }


    /*
     * Noisy audio
     *
     * Example:
     *
     * audio/example2/snr_-10dB/streamn2l.wav
     */

    return (
        `audio/${example}/` +
        `${option.folder}/${filename}`
    );

}


/* ============================================================
   Render Main Demo
   ============================================================ */

function renderExamples() {

    const container =
        document.getElementById(
            "examples-container"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";


    /*
     * Only two examples
     */

    for (
        let exampleIndex = 1;
        exampleIndex <= 2;
        exampleIndex++
    ) {

        const exampleCard =
            document.createElement(
                "div"
            );

        exampleCard.className =
            "example-card";


        exampleCard.innerHTML = `

    <div class="example-header">

        <div class="example-number">
            Example ${exampleIndex}
        </div>

    </div>

    <div class="audio-list"></div>

    ${
        window.currentSNR === "clean"
        ? `
            <div class="example-transcript">

                <div class="transcript-chinese">
                    ${
                        exampleIndex === 1
                            ? "对应文本: 中国人非常友善和热情"
                            : "对应文本: 中国银行卡产业近年来发展迅速。"
                    }
                </div>

                <div class="transcript-english">
                    ${
                        exampleIndex === 1
                            ? "Corresponding text: Chinese people are very friendly and warm-hearted."
                            : "Corresponding text: China's bank card industry has developed rapidly in recent years."
                    }
                </div>

            </div>
        `
        : ""
    }

`;

        const audioList =
            exampleCard.querySelector(
                ".audio-list"
            );


        /*
         * Add all methods
         */

        methods.forEach(
            method => {

                const audioItem =
                    document.createElement(
                        "div"
                    );


                audioItem.className =
                    `audio-item ${method.category}`;


                const audioPath =
                    getAudioPath(
                        `example${exampleIndex}`,
                        method.file
                    );


                audioItem.innerHTML = `

                    <div class="audio-info">

                        <div class="audio-name">
                            ${method.name}
                        </div>
                        <div class="audio-category">
                            ${method.category}
                        </div>
                    </div>


                    <audio
                        controls
                        preload="none"
                    >

                        <source
                            src="${audioPath}"
                            type="audio/wav"
                        >

                    </audio>

                `;


                const audio =
                    audioItem.querySelector(
                        "audio"
                    );


                /*
                 * Only one audio can play
                 * at the same time.
                 */

                audio.addEventListener(
                    "play",
                    () => {

                        stopOtherAudio(
                            audio
                        );

                    }
                );


                /*
                 * Missing audio
                 */

                audio.addEventListener(
                    "error",
                    () => {

                        audioItem.classList.add(
                            "audio-missing"
                        );

                    }
                );


                audioList.appendChild(
                    audioItem
                );

            }
        );


        container.appendChild(
            exampleCard
        );

    }

}


/* ============================================================
   Main SNR Selector
   ============================================================ */

function updateSNR(snr) {

    /*
     * Check whether option exists
     */

    if (!snrOptions[snr]) {
        return;
    }


    window.currentSNR = snr;


    /*
     * Update button state
     */

    document
        .querySelectorAll(
            "[data-snr]"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.snr === snr
                );

            }
        );


    /*
     * Update current condition
     */

    const current =
        document.getElementById(
            "current-snr"
        );


    if (current) {

        current.textContent =
            snrOptions[snr].label;

    }


    /*
     * Re-render audio
     */

    renderExamples();

}


/* ============================================================
   Ablation Study
   ============================================================ */


/*
 * Ablation variants
 *
 * The folder names are kept consistent with
 * the actual directory names.
 */

const ablationMethods = [

    {
        folder: "base-noda",
        name: "Stage1 w/o Data Augmentation",
        category: ""
    },

    {
        folder: "base-nohu",
        name: "Stage1 w/o HuBERT Supervision",
        category: ""
    },

    {
        folder: "base-nospk",
        name: "Stage1 w/o Gated Speaker Encoder",
        category: ""
    },

    {
        folder: "nopost",
        name: "StreamN2L w/o Post-training",
        category: ""
    },

    {
        folder: "proposed-noacou",
        name: "StreamN2L w/o Acoustic Loss",
        category: ""
    },

    {
        folder: "proposed-noGRPO",
        name: "StreamN2L w/o GRPO Loss",
        category: ""
    },

    {
        folder: "proposed",
        name: "StreamN2L",
        category: ""
    }

];


/*
 * Current ablation SNR
 *
 * Again, -10 dB is the default.
 */

window.ablationSNR = "-10";


/* ============================================================
   Ablation Audio Path
   ============================================================ */

function getAblationAudioPath(
    folder,
    exampleIndex
) {

    /*
     * Clean
     *
     * audio/ablation/
     *     base-noda/
     *         example1.wav
     */

    if (
        window.ablationSNR === "clean"
    ) {

        return (
            `audio/ablation/` +
            `${folder}/` +
            `example${exampleIndex}.wav`
        );

    }


    /*
     * Noisy
     *
     * audio/ablation/
     *     base-noda/
     *         snr_-10dB/
     *             example1.wav
     */

    return (
        `audio/ablation/` +
        `${folder}/` +
        `snr_-10dB/` +
        `example${exampleIndex}.wav`
    );

}


/* ============================================================
   Render Ablation
   ============================================================ */

function renderAblation() {

    const container =
        document.getElementById(
            "ablation-container"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    /*
     * Two examples
     */

    for (
        let exampleIndex = 1;
        exampleIndex <= 2;
        exampleIndex++
    ) {

        const exampleCard =
            document.createElement(
                "div"
            );


        exampleCard.className =
            "example-card";


        exampleCard.innerHTML = `

            <div class="example-header">

                <div class="example-number">
                    Example ${exampleIndex}
                </div>

            </div>

            <div class="audio-list"></div>

        `;


        const audioList =
            exampleCard.querySelector(
                ".audio-list"
            );


        /*
         * Add all ablation variants
         */

        ablationMethods.forEach(
            method => {

                const audioItem =
                    document.createElement(
                        "div"
                    );


                audioItem.className =
                    `audio-item ${method.category}`;


                const audioPath =
                    getAblationAudioPath(
                        method.folder,
                        exampleIndex
                    );


                audioItem.innerHTML = `

                    <div class="audio-info">

                        <div class="audio-name">
                            ${method.name}
                        </div>

                    </div>


                    <audio
                        controls
                        preload="none"
                    >

                        <source
                            src="${audioPath}"
                            type="audio/wav"
                        >

                    </audio>

                `;


                const audio =
                    audioItem.querySelector(
                        "audio"
                    );


                /*
                 * Only one audio can play
                 */

                audio.addEventListener(
                    "play",
                    () => {

                        stopOtherAudio(
                            audio
                        );

                    }
                );


                /*
                 * Missing audio
                 */

                audio.addEventListener(
                    "error",
                    () => {

                        audioItem.classList.add(
                            "audio-missing"
                        );

                    }
                );


                audioList.appendChild(
                    audioItem
                );

            }
        );


        container.appendChild(
            exampleCard
        );

    }

}


/* ============================================================
   Ablation SNR Selector
   ============================================================ */

function updateAblationSNR(snr) {

    /*
     * Only two conditions are currently supported:
     *
     * -10
     * clean
     */

    if (
        snr !== "-10"
        && snr !== "clean"
    ) {
        return;
    }


    window.ablationSNR = snr;


    /*
     * Update button state
     */

    document
        .querySelectorAll(
            "[data-ablation-snr]"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.ablationSnr === snr
                );

            }
        );


    /*
     * Update text
     */

    const current =
        document.getElementById(
            "current-ablation-snr"
        );


    if (current) {

        if (snr === "clean") {

            current.textContent =
                "Clean / No Noise";

        } else {

            current.textContent =
                "SNR = −10 dB";

        }

    }


    /*
     * Re-render
     */

    renderAblation();

}


/* ============================================================
   Stop Other Audio
   ============================================================ */

function stopOtherAudio(
    currentAudio
) {

    document
        .querySelectorAll(
            "audio"
        )
        .forEach(
            audio => {

                if (
                    audio !== currentAudio
                ) {

                    audio.pause();

                }

            }
        );

}


/* ============================================================
   Button Initialization
   ============================================================ */

function initializeSelectors() {


    /*
     * Main Demo SNR buttons
     */

    document
        .querySelectorAll(
            "[data-snr]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        updateSNR(
                            button.dataset.snr
                        );

                    }
                );

            }
        );


    /*
     * Ablation SNR buttons
     */

    document
        .querySelectorAll(
            "[data-ablation-snr]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        updateAblationSNR(
                            button.dataset.ablationSnr
                        );

                    }
                );

            }
        );

}


/* ============================================================
   Initialize
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
         * Main Demo
         */

        initializeSelectors();

        updateSNR("-10");


        /*
         * Ablation Study
         */

        updateAblationSNR("-10");

    }
);
