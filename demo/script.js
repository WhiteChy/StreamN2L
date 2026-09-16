const examples = [
    "example1",
    "example2"
];

const methods = [
    {
        file: "normal.wav",
        name: "Normal Speech",
        category: "reference"
    },
    {
        file: "cyclegan.wav",
        name: "CycleGAN",
        category: "baseline-nonstream"
    },
    {
        file: "stargan.wav",
        name: "StarGAN",
        category: "baseline-nonstream"
    },
    {
        file: "streamvc.wav",
        name: "StreamVC",
        category: "baseline-stream"
    },
    {
        file: "meanvc.wav",
        name: "MeanVC",
        category: "baseline-stream"
    },
    {
        file: "meanvc_p.wav",
        name: "MeanVC-Pretrained",
        category: "baseline-stream"
    },
    {
        file: "meanvc2_p.wav",
        name: "MeanVC2-Pretrained",
        category: "baseline-stream"
    },
    {
        file: "pgd_n2l.wav",
        name: "PGD-N2L",
        category: "baseline-nonstream"
    },
    {
        file: "streamn2l.wav",
        name: "StreamN2L",
        category: "ours"
    },
        {
        file: "lombard.wav",
        name: "Lombard Speech",
        category: "reference"
    }
];


/* =========================================================
   Only two listening conditions are provided:
   Clean and SNR = -10 dB

   Default condition: SNR = -10 dB
========================================================= */

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


/* =========================================================
   Get audio path
========================================================= */

function getAudioPath(example, filename) {

    const snr = window.currentSNR || "-10";
    const option = snrOptions[snr];

    if (!option || option.folder === null) {
        return `audio/${example}/${filename}`;
    }

    return `audio/${example}/${option.folder}/${filename}`;
}


/* =========================================================
   Render examples
========================================================= */

function renderExamples() {

    const container = document.getElementById(
        "examples-container"
    );

    container.innerHTML = "";

    examples.forEach((example, index) => {

        const exampleCard = document.createElement("div");

        exampleCard.className = "example-card";

        exampleCard.innerHTML = `
            <div class="example-header">
                <div class="example-number">
                    Example ${index + 1}
                </div>
            </div>

            <div class="audio-list"></div>
        `;

        const audioList =
            exampleCard.querySelector(".audio-list");


        methods.forEach(method => {

            const audioPath =
                getAudioPath(example, method.file);

            const audioItem =
                document.createElement("div");

            audioItem.className =
                `audio-item ${method.category}`;

            audioItem.innerHTML = `
                <div class="audio-info">
                    <div class="audio-name">
                        ${method.name}
                    </div>
                </div>

                <audio controls preload="none">
                    <source
                        src="${audioPath}"
                        type="audio/wav">
                </audio>
            `;

            const audio =
                audioItem.querySelector("audio");

            audio.addEventListener("play", () => {

                document
                    .querySelectorAll("audio")
                    .forEach(other => {

                        if (other !== audio) {
                            other.pause();
                        }

                    });

            });


            audio.addEventListener("error", () => {

                audioItem.classList.add(
                    "audio-missing"
                );

            });


            audioList.appendChild(audioItem);

        });


        container.appendChild(exampleCard);

    });

}


/* =========================================================
   SNR selector
========================================================= */

function updateSNR(snr) {

    if (!snrOptions[snr]) {
        return;
    }

    window.currentSNR = snr;


    /* Update button state */

    document
        .querySelectorAll(".snr-button")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.snr === snr
            );

        });


    /* Update current condition */

    const currentSNR =
        document.getElementById("current-snr");

    currentSNR.textContent =
        snrOptions[snr].label;


    /* Stop currently playing audio */

    document
        .querySelectorAll("audio")
        .forEach(audio => {

            audio.pause();
            audio.currentTime = 0;

        });


    /* Re-render audio */

    renderExamples();

}


/* =========================================================
   Initialize
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        window.currentSNR = "-10";

        document
            .querySelectorAll(".snr-button")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {
                        updateSNR(button.dataset.snr);
                    }
                );

            });

        updateSNR("-10");

        renderAblation();
    }
);

/* =========================================================
   Ablation Study
========================================================= */

const ablationMethods = [
    {
        folder: "base-noda",
        name: "Stage1 w/o Data Augmentation",
        category: ""
    },
    {
        folder: "base-nohu",
        name: "Stage1 w/o Hubert Supervision",
        category: ""
    },
    {
        folder: "base-nospk",
        name: "Stage1 w/o Gated Speaker Encoder",
        category: ""
    },
    {
        folder: "nopost",
        name: "StreamN2L w/o Acoustic-guided Post-training",
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
    }
];


function renderAblation() {

    const container =
        document.getElementById("ablation-container");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    for (let exampleIndex = 1; exampleIndex <= 2; exampleIndex++) {

        const exampleCard =
            document.createElement("div");

        exampleCard.className = "example-card";

        exampleCard.innerHTML = `
            <div class="example-header">
                <div class="example-number">
                    Example ${exampleIndex}
                </div>
            </div>

            <div class="audio-list"></div>
        `;

        const audioList =
            exampleCard.querySelector(".audio-list");


        ablationMethods.forEach(method => {

            const audioItem =
                document.createElement("div");

            audioItem.className =
                `audio-item ${method.category}`;

            const audioPath =
                `audio/ablation/${method.folder}/example${exampleIndex}.wav`;

            audioItem.innerHTML = `
                <div class="audio-info">
                    <div class="audio-name">
                        ${method.name}
                    </div>
                </div>

                <audio controls preload="none">
                    <source
                        src="${audioPath}"
                        type="audio/wav">
                </audio>
            `;

            const audio =
                audioItem.querySelector("audio");


            audio.addEventListener("play", () => {

                document
                    .querySelectorAll("audio")
                    .forEach(other => {

                        if (other !== audio) {
                            other.pause();
                        }

                    });

            });


            audio.addEventListener("error", () => {

                audioItem.classList.add(
                    "audio-missing"
                );

            });


            audioList.appendChild(audioItem);

        });


        container.appendChild(exampleCard);
    }
}