const form = document.querySelector('form');
const resultdiv = document.querySelector('.result');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    getwordinfo(form.elements[0].value);
});

const getwordinfo = async (word) => {
    try {
        resultdiv.innerHTML = "Fetching data...";
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();
        
        let definitions = data[0].meanings[0].definitions[0];
        
        // Extracting phonetic information
        let phoneticText = data[0].phonetics[0]?.text || "Not available";
        let phoneticAudio = data[0].phonetics.find(p => p.audio)?.audio || "";

        resultdiv.innerHTML = `
            <h2><strong>Word:</strong> ${data[0].word}</h2>
            <p class="partsofspeech">${data[0].meanings[0].partOfSpeech}</p>
            <p><strong>Meaning:</strong> ${definitions.definition === undefined ? "Not Found" : definitions.definition}</p>
            <p><strong>Example:</strong> ${definitions.example === undefined ? "Not Found" : definitions.example}</p>
            <p><strong>Synonyms:</strong></p>
        `;

        if (data[0].meanings[0].definitions[0].synonyms.length === 0) {
            resultdiv.innerHTML += '<span>Not Found</span>';
        } else { 
            for (let i = 0; i < data[0].meanings[0].definitions[0].synonyms.length; i++) {
                resultdiv.innerHTML += `<li>${data[0].meanings[0].definitions[0].synonyms[i]}</li>`;
            }
        }

        resultdiv.innerHTML += '<p><strong>Antonyms:</strong></p>';

        if (data[0].meanings[0].definitions[0].antonyms.length === 0) {
            resultdiv.innerHTML += '<span>Not Found</span>';
        } else { 
            for (let i = 0; i < data[0].meanings[0].definitions[0].antonyms.length; i++) {
                resultdiv.innerHTML += `<li>${data[0].meanings[0].definitions[0].antonyms[i]}</li>`;
            }
        }

        // Adding pronunciation
        resultdiv.innerHTML += `
            <p><strong>Pronunciation:</strong> ${phoneticText}</p>
        `;
        if (phoneticAudio) {
            resultdiv.innerHTML += `<audio controls>
                <source src="${phoneticAudio}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>`;
        }

        // Adding read more button
        resultdiv.innerHTML += `<div><a href="${data[0].sourceUrls[0]}" target="_blank">Read More</a></div>`;
    } catch (error) {
        resultdiv.innerHTML = '<p>The word could not be found, please provide another word</p>';
    }
    console.log(data);
};
