const selectTags = document.querySelectorAll("select");
const exchangeButton = document.querySelector(".exchange");
const translateButton = document.querySelector("button");
const fromTextArea = document.querySelector(".from-text");
const toTextArea = document.querySelector(".to-text");
const icons = document.querySelectorAll(".row i");

const defaultLanguages = {
    from: "en-GB",
    to: "ur-PK"
};

selectTags.forEach((tag, index) => {
    for (const countryCode in countries) {
        let selected = "";
        if (index === 0 && countryCode === defaultLanguages.from) {
            selected = "selected";
        } else if (index === 1 && countryCode === defaultLanguages.to) {
            selected = "selected";
        }
        const option = `<option value="${countryCode}" ${selected}>${countries[countryCode]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

// Exchange text and language selections
exchangeButton.addEventListener("click", () => {
    const tempText = fromTextArea.value;
    const tempLang = selectTags[0].value;

    fromTextArea.value = toTextArea.value;
    toTextArea.value = tempText;

    selectTags[0].value = selectTags[1].value;
    selectTags[1].value = tempLang;
});

translateButton.addEventListener("click", () => {
    const textToTranslate = fromTextArea.value;
    const translateFrom = selectTags[0].value;
    const translateTo = selectTags[1].value;

    if (!textToTranslate) return;

    toTextArea.setAttribute("placeholder", "Translating...");

    const apiUrl = `https://api.mymemory.translated.net/get?q=${textToTranslate}&langpair=${translateFrom}|${translateTo}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            toTextArea.value = data.responseData.translatedText;
            toTextArea.setAttribute("placeholder", "Translation");
        })
        .catch(error => {
            toTextArea.setAttribute("placeholder", "Translation failed");
            console.error("Error translating text:", error);
        });
});

icons.forEach(icon => {
    icon.addEventListener("click", ({ target }) => {
        if (target.classList.contains("fa-copy")) {
            if (target.id === "from") {
                navigator.clipboard.writeText(fromTextArea.value);
            } else {
                navigator.clipboard.writeText(toTextArea.value);
            }
        } else {
            let utterance;
            if (target.id === "from") {
                utterance = new SpeechSynthesisUtterance(fromTextArea.value);
                utterance.lang = selectTags[0].value;
            } else {
                utterance = new SpeechSynthesisUtterance(toTextArea.value);
                utterance.lang = selectTags[1].value;
            }
            speechSynthesis.speak(utterance);
        }
    });
});
