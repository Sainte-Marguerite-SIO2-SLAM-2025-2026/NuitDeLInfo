const softwarePairs = [
    { proprietary: "Photoshop", opensource: "GIMP" },
    { proprietary: "Microsoft Office", opensource: "LibreOffice" },
    { proprietary: "Illustrator", opensource: "Inkscape" },
    { proprietary: "Premiere Pro", opensource: "DaVinci Resolve" },
    { proprietary: "After Effects", opensource: "Blender" },
    { proprietary: "AutoCAD", opensource: "FreeCAD" },
    { proprietary: "Sublime Text", opensource: "VS Code" },
    { proprietary: "Slack", opensource: "Mattermost" },
    { proprietary: "Zoom", opensource: "Jitsi Meet" },
    { proprietary: "Windows", opensource: "Linux Ubuntu" },
    { proprietary: "macOS", opensource: "Elementary OS" },
    { proprietary: "Outlook", opensource: "Thunderbird" },
    { proprietary: "Dropbox", opensource: "Nextcloud" },
    { proprietary: "1Password", opensource: "Bitwarden" },
    { proprietary: "Matlab", opensource: "GNU Octave" },
    { proprietary: "Camtasia", opensource: "OBS Studio" },
    { proprietary: "Spotify", opensource: "Audacious" },
    { proprietary: "WinRAR", opensource: "7-Zip" }
];

let userMatches = [];
let selectedProprietary = null;
let selectedOpensource = null;
let matchedItems = new Set();

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function initGame() {
    const proprietaryList = document.getElementById('proprietaryList');
    const opensourceList = document.getElementById('opensourceList');
    const scoreTotal = document.getElementById('total');

    proprietaryList.innerHTML = '';
    opensourceList.innerHTML = '';
    userMatches = [];
    selectedProprietary = null;
    selectedOpensource = null;
    matchedItems.clear();
    document.getElementById('result').style.display = 'none';
    document.getElementById('score').textContent = '0';
    scoreTotal.textContent = softwarePairs.length;

    const shuffledProprietary = shuffleArray(softwarePairs.map(p => p.proprietary));
    const shuffledOpensource = shuffleArray(softwarePairs.map(p => p.opensource));

    shuffledProprietary.forEach(name => {
        const div = document.createElement('div');
        div.className = 'software-item proprietary';
        div.textContent = name;
        div.dataset.name = name;
        div.onclick = () => selectProprietary(name);
        proprietaryList.appendChild(div);
    });

    shuffledOpensource.forEach(name => {
        const div = document.createElement('div');
        div.className = 'software-item opensource';
        div.textContent = name;
        div.dataset.name = name;
        div.onclick = () => selectOpensource(name);
        opensourceList.appendChild(div);
    });
}

function selectProprietary(name) {
    if (matchedItems.has(name)) return;

    document.querySelectorAll('.proprietary').forEach(el => {
        if (el.dataset.name === name) {
            el.classList.toggle('selected');
        } else {
            el.classList.remove('selected');
        }
    });

    selectedProprietary = document.querySelector('.proprietary.selected') ? name : null;
    checkForMatch();
}

function selectOpensource(name) {
    if (matchedItems.has(name)) return;

    document.querySelectorAll('.opensource').forEach(el => {
        if (el.dataset.name === name) {
            el.classList.toggle('selected');
        } else {
            el.classList.remove('selected');
        }
    });

    selectedOpensource = document.querySelector('.opensource.selected') ? name : null;
    checkForMatch();
}

function checkForMatch() {
    if (selectedProprietary && selectedOpensource) {
        const existingMatch = userMatches.find(m =>
            m.proprietary === selectedProprietary || m.opensource === selectedOpensource
        );

        if (existingMatch) {
            userMatches = userMatches.filter(m => m !== existingMatch);
            matchedItems.delete(existingMatch.proprietary);
            matchedItems.delete(existingMatch.opensource);
        }

        userMatches.push({
            proprietary: selectedProprietary,
            opensource: selectedOpensource
        });

        matchedItems.add(selectedProprietary);
        matchedItems.add(selectedOpensource);

        document.querySelectorAll('.software-item').forEach(el => {
            if (el.dataset.name === selectedProprietary || el.dataset.name === selectedOpensource) {
                el.classList.remove('selected');
                el.classList.add('matched');
            }
        });

        document.getElementById('score').textContent = userMatches.length;

        selectedProprietary = null;
        selectedOpensource = null;
    }
}

function validateAnswers() {
    let correct = 0;
    const resultDiv = document.getElementById('result');

    document.querySelectorAll('.software-item').forEach(el => {
        el.classList.remove('wrong');
    });

    userMatches.forEach(match => {
        const isCorrect = softwarePairs.some(pair =>
            pair.proprietary === match.proprietary && pair.opensource === match.opensource
        );

        if (isCorrect) {
            correct++;
        } else {
            document.querySelectorAll('.software-item').forEach(el => {
                if (el.dataset.name === match.proprietary || el.dataset.name === match.opensource) {
                    el.classList.add('wrong');
                }
            });
        }
    });

    const percentage = (correct / softwarePairs.length) * 100;

    if (percentage === 100) {
        resultDiv.className = 'result success';
        resultDiv.textContent = `🎉 Parfait ! ${correct}/${softwarePairs.length} bonnes réponses !`;
    } else if (percentage >= 50) {
        resultDiv.className = 'result partial';
        resultDiv.textContent = `👍 Pas mal ! ${correct}/${softwarePairs.length} bonnes réponses. Essayez encore !`;
    } else {
        resultDiv.className = 'result fail';
        resultDiv.textContent = `😕 ${correct}/${softwarePairs.length} bonnes réponses. Réessayez !`;
    }
}

document.getElementById('validateBtn').onclick = validateAnswers;
document.getElementById('resetBtn').onclick = initGame;

initGame();