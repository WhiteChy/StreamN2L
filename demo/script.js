// ============================================================
// StreamN2L Demo
// ============================================================

// ------------------------------------------------------------
// SNR options
// ------------------------------------------------------------

const snrOptions = {
    "-10": {
        label: "SNR = −10 dB",
        folder: "snr_-10dB"
    },

    "-5": {
        label: "SNR = −5 dB",
        folder: "snr_-5dB"
    },

    clean: {
        label: "Clean / No Noise",
        folder: null
    }
};


// ------------------------------------------------------------
// Main demo methods
// ------------------------------------------------------------

const methods = [
    {
        id: "normal",
        name: "Normal Speech",
        file: "normal.wav",
        className: "normal"
    },

    {
        id: "cyclegan",
        name: "CycleGAN",
        file: "cyclegan.wav",
        className: ""
    },

    {
        id: "stargan",
        name: "StarGAN",
        file: "stargan.wav",
        className: ""
    },

    {
        id: "streamvc",
        name: "StreamVC",
        file: "streamvc.wav",
        className: ""
    },

    {
        id: "meanvc",
        name: "MeanVC",
        file: "meanvc.wav",
        className: ""
    },

    {
        id: "meanvc_p",
        name: "MeanVC-Pretrained",
        file: "meanvc_p.wav",
        className: ""
    },

    {
        id: "meanvc2_p",
        name: "MeanVC2-Pretrained",
        file: "meanvc2_p.wav",
        className: ""
    },

    {
        id: "streamn2l",
        name: "StreamN2L",
        file: "streamn2l.wav",
        className: "ours"
    },

    {
        id: "pgd_n2l",
        name: "PGD-N2L",
        file: "pgd_n2l.wav",
        className: ""
    },

    {
        id: "lombard",
        name: "Lombard Speech",
        file: "lombard.wav",
        className: "reference"
    }
];


// ------------------------------------------------------------
// Ablation methods
// ------------------------------------------------------------

const ablationMethods = [
    {
        id: "base-noda",
        name: "Stage1 w/o Data Augmentation",
        folder: "base-noda"
    },

    {
        id: "base-nohu",
        name: "Stage1 w/o HuBERT Supervision",
        folder: "base-nohu"
    },

    {
        id: "base-nospk",
        name: "Stage1 w/o Gated Speaker Encoder",
        folder: "base-nospk"
    },

    {
        id: "nopost",
        name: "StreamN2L w/o Post-training",
        folder: "nopost"
    },

    {
        id: "proposed-noacou",
        name: "StreamN2L w/o Acoustic Loss",
        folder: "proposed-noacou"
    },

    {
        id: "proposed-noGRPO",
        name: "StreamN2L w/o GRPO Loss",
        folder: "proposed-noGRPO"
    },

    {
        id: "proposed",
        name: "StreamN2L",
        folder: "proposed",
        className: "ours"
    }
];


// ------------------------------------------------------------
// Ablation reference audio
// ------------------------------------------------------------

const ablationReference = {
    normal: "audio/ablation/reference/normal",
    lombard: "audio/ablation/reference/lombard"
};


// ------------------------------------------------------------
// Global state
// ------------------------------------------------------------

window.currentSNR = "-10";
window.ablationSNR = "-10";


// ------------------------------------------------------------
// Utility: stop all other audio
// ------------------------------------------------------------

function stopOtherAudio(currentAudio) {
    const audios = document.querySelectorAll("audio");

    audios.forEach(audio => {
        if (audio !== currentAudio) {
            audio.pause();
            audio.currentTime = 0;
        }
    });
}


// ------------------------------------------------------------
// Utility: create audio element
// ------------------------------------------------------------

function createAudioElement(src) {
    const audio = document.createElement("audio");

    audio.controls = true;
    audio.preload = "none";
    audio.src = src;

    audio.addEventListener("play", function () {
        stopOtherAudio(audio);
    });

    return audio;
}


// ------------------------------------------------------------
// Main demo audio path
// ------------------------------------------------------------

function getAudioPath(exampleIndex, fileName) {
    const option = snrOptions[window.currentSNR];

    let path = `audio/example${exampleIndex}/`;

    if (option && option.folder) {
        path += `${option.folder}/`;
    }

    path += fileName;

    return path;
}


// ------------------------------------------------------------
// Ablation audio path
// ------------------------------------------------------------

function getAblationAudioPath(folder, exampleIndex) {
    let path = `audio/ablation/${folder}/`;

    if (window.ablationSNR !== "clean") {
        path += `snr_${window.ablationSNR}dB/`;
    }

    path += `example${exampleIndex}.wav`;

    return path;
}


// ------------------------------------------------------------
// Ablation reference audio path
// ------------------------------------------------------------

function getAblationReferenceAudioPath(type, exampleIndex) {
    let path = `${ablationReference[type]}/`;

    if (window.ablationSNR !== "clean") {
        path += `snr_${window.ablationSNR}dB/`;
    }

    path += `example${exampleIndex}.wav`;

    return path;
}


// ------------------------------------------------------------
// Transcript for clean examples
// ------------------------------------------------------------

const transcripts = {
    1: {
        chinese: "对应文本: 中国人非常友善和热情",
        english: "Corresponding text: Chinese people are very friendly and warm-hearted."
    },
    2: {
        chinese: "对应文本: 中国银行卡产业近年来发展迅速。",
        english: "Corresponding text: China's bank card industry has developed rapidly in recent years."
    }
};


// ------------------------------------------------------------
// Create main demo audio item
// ------------------------------------------------------------

function createAudioItem(method, exampleIndex) {

    const item = document.createElement("div");

    item.className = "audio-item";

    if (method.className) {
        item.classList.add(method.className);
    }

    const name = document.createElement("div");

    name.className = "audio-name";
    name.textContent = method.name;

    const audioContainer = document.createElement("div");

    audioContainer.className = "audio-control";

    const src = getAudioPath(
        exampleIndex,
        method.file
    );

    const audio = createAudioElement(src);

    audio.addEventListener("error", function () {
        item.classList.add("audio-missing");
    });

    audioContainer.appendChild(audio);

    item.appendChild(name);
    item.appendChild(audioContainer);

    return item;
}


// ------------------------------------------------------------
// Create transcript
// ------------------------------------------------------------

function createTranscript(exampleIndex) {

    if (window.currentSNR !== "clean") {
        return null;
    }

    const text = transcripts[exampleIndex];

    if (!text) {
        return null;
    }

    const transcript = document.createElement("div");

    transcript.className = "example-transcript";
    transcript.dataset.cleanTranscript = "true";

    const chinese = document.createElement("div");
    chinese.className = "transcript-chinese";
    chinese.textContent = text.chinese;

    const english = document.createElement("div");
    english.className = "transcript-english";
    english.textContent = text.english;

    transcript.appendChild(chinese);
    transcript.appendChild(english);

    return transcript;
}


// ------------------------------------------------------------
// Render main demo
// ------------------------------------------------------------

function renderExamples() {

    const container = document.getElementById("examples-container");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    // Only display example1 and example2
    const examples = [1, 2];

    examples.forEach(exampleIndex => {

        const exampleBlock = document.createElement("div");

        exampleBlock.className = "example-block";

        const title = document.createElement("h3");

        title.className = "example-title";

        title.textContent = `Example ${exampleIndex}`;

        exampleBlock.appendChild(title);

        methods.forEach(method => {

            const item = createAudioItem(
                method,
                exampleIndex
            );

            exampleBlock.appendChild(item);

        });

        const transcript = createTranscript(exampleIndex);

        if (transcript) {
            exampleBlock.appendChild(transcript);
        }

        container.appendChild(exampleBlock);

    });
}


// ------------------------------------------------------------
// Update main SNR
// ------------------------------------------------------------

function updateSNR(snr) {

    if (!snrOptions[snr]) {
        return;
    }

    window.currentSNR = snr;

    // Update active button
    document.querySelectorAll("[data-snr]").forEach(button => {

        if (button.dataset.snr === snr) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }

    });

    // Update displayed label if present
    const label = document.getElementById("current-snr");

    if (label) {
        label.textContent = snrOptions[snr].label;
    }

    renderExamples();
}


// ------------------------------------------------------------
// Create ablation audio item
// ------------------------------------------------------------

function addAblationAudioItem(
    container,
    name,
    src,
    className = ""
) {

    const item = document.createElement("div");

    item.className = "audio-item";

    if (className) {
        item.classList.add(className);
    }

    const nameElement = document.createElement("div");

    nameElement.className = "audio-name";

    nameElement.textContent = name;

    const audioContainer = document.createElement("div");

    audioContainer.className = "audio-control";

    const audio = createAudioElement(src);

    audio.addEventListener("error", function () {
        item.classList.add("audio-missing");
    });

    audioContainer.appendChild(audio);

    item.appendChild(nameElement);
    item.appendChild(audioContainer);

    container.appendChild(item);

    return item;
}


// ------------------------------------------------------------
// Render ablation study
// ------------------------------------------------------------

function renderAblation() {

    const container = document.getElementById(
        "ablation-container"
    );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    // Only display example1 and example2
    const examples = [1, 2];

    examples.forEach(exampleIndex => {

        const exampleBlock = document.createElement("div");

        exampleBlock.className = "example-block";

        const title = document.createElement("h3");

        title.className = "example-title";

        title.textContent = `Example ${exampleIndex}`;

        exampleBlock.appendChild(title);


        // ----------------------------------------------------
        // 1. Normal Speech
        // ----------------------------------------------------

        const normalSrc =
            getAblationReferenceAudioPath(
                "normal",
                exampleIndex
            );

        addAblationAudioItem(
            exampleBlock,
            "Normal Speech",
            normalSrc,
            "reference"
        );


        // ----------------------------------------------------
        // 2. Ablation variants
        // ----------------------------------------------------

        ablationMethods.forEach(method => {

            const src =
                getAblationAudioPath(
                    method.folder,
                    exampleIndex
                );

            addAblationAudioItem(
                exampleBlock,
                method.name,
                src,
                method.className || ""
            );

        });


        // ----------------------------------------------------
        // 3. Lombard Speech
        // ----------------------------------------------------

        const lombardSrc =
            getAblationReferenceAudioPath(
                "lombard",
                exampleIndex
            );

        addAblationAudioItem(
            exampleBlock,
            "Lombard speech",
            lombardSrc,
            "reference"
        );


        container.appendChild(exampleBlock);

    });
}


// ------------------------------------------------------------
// Update ablation SNR
// ------------------------------------------------------------

function updateAblationSNR(snr) {

    if (!snrOptions[snr]) {
        return;
    }

    window.ablationSNR = snr;

    // Update active button
    document.querySelectorAll(
        "[data-ablation-snr]"
    ).forEach(button => {

        if (button.dataset.ablationSnr === snr) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }

    });


    // Update displayed label if present
    const label = document.getElementById(
        "current-ablation-snr"
    );

    if (label) {
        label.textContent =
            snrOptions[snr].label;
    }


    renderAblation();
}


// ------------------------------------------------------------
// Initialize main SNR selector
// ------------------------------------------------------------

function initializeMainSNRSelector() {

    const buttons =
        document.querySelectorAll(
            "[data-snr]"
        );

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const snr =
                    this.dataset.snr;

                updateSNR(snr);

            }
        );

    });
}


// ------------------------------------------------------------
// Initialize ablation SNR selector
// ------------------------------------------------------------

function initializeAblationSNRSelector() {

    const buttons =
        document.querySelectorAll(
            "[data-ablation-snr]"
        );

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const snr =
                    this.dataset.ablationSnr;

                updateAblationSNR(snr);

            }
        );

    });
}


// ------------------------------------------------------------
// Set initial active button
// ------------------------------------------------------------

function initializeActiveButtons() {

    document.querySelectorAll(
        "[data-snr]"
    ).forEach(button => {

        if (
            button.dataset.snr ===
            window.currentSNR
        ) {
            button.classList.add("active");
        }

    });


    document.querySelectorAll(
        "[data-ablation-snr]"
    ).forEach(button => {

        if (
            button.dataset.ablationSnr ===
            window.ablationSNR
        ) {
            button.classList.add("active");
        }

    });
}


// ------------------------------------------------------------
// Global audio behavior
// ------------------------------------------------------------

function initializeAudioBehavior() {

    document.addEventListener(
        "play",
        function (event) {

            if (
                event.target &&
                event.target.tagName === "AUDIO"
            ) {
                stopOtherAudio(event.target);
            }

        },
        true
    );
}


// ------------------------------------------------------------
// Smooth navigation
// ------------------------------------------------------------

function initializeNavigation() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );

    links.forEach(link => {

        link.addEventListener(
            "click",
            function (event) {

                const targetId =
                    this.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(
                        targetId
                    );

                if (!target) {
                    return;
                }

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    });
}


// ------------------------------------------------------------
// Initialize page
// ------------------------------------------------------------

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeMainSNRSelector();

        initializeAblationSNRSelector();

        initializeActiveButtons();

        initializeAudioBehavior();

        initializeNavigation();

        renderExamples();

        renderAblation();

    }
);
