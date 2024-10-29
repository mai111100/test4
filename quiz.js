document.addEventListener('DOMContentLoaded', () => {
    let currentQuestionIndex = 0;
    let selectedLanguage = null;

    // Scores for each personality (bird type)
    let weaverScore = 0, pelicanScore = 0, flycatcherScore = 0, owlScore = 0;
    let crowScore = 0, craneScore = 0, parakeetScore = 0, eagleScore = 0, pigeonScore = 0;

    // English and Vietnamese questions
    const englishQuestions = [
        { question: "You start your journey over the seashore...", choices: ["Imma start anyways...", "Nah, no need to mess up..."], weights: [{ flycatcherScore: 1 }, { crowScore: 1 }] },
        { question: "Not long after your departure, a forest full of food appears. What do you do?", choices: ["Gather food and plan ahead - you’ll need it for later", "Enjoy the present - why worry so much about the future?"], weights: [{ weaverScore: 1 }, { parakeetScore: 1 }] },
        { question: "As the sun sets, you reflect on your journey. What now?", choices: ["Think about how to do better next time", "Feel proud of everything you've achieved so far"], weights: [{ weaverScore: 1 }, { flycatcherScore: 1 }] },
    ];

    const vietnameseQuestions = [
        { question: "Bạn chuẩn bị xuất phát từ bờ biển...", choices: ["Kệ - dân chơi không sợ...", "Thôi khoải. Tìm đường khác..."], weights: [{ flycatcherScore: 1 }, { crowScore: 1 }] },
        // ...add remaining questions...
    ];

    // Bird matches for each personality type
    const birdMatches = {
        weaver: ["parakeet", "owl"],
        pelican: ["owl", "eagle"],
        // ...complete bird matches...
    };

    function displayCurrentQuestion() {
        const questions = selectedLanguage === 'english' ? englishQuestions : vietnameseQuestions;
        const currentQuestion = questions[currentQuestionIndex];

        const questionElement = document.getElementById('question');
        const choicesContainer = document.getElementById('choices');

        questionElement.textContent = currentQuestion.question;
        choicesContainer.innerHTML = ''; // Clear previous choices

        currentQuestion.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.textContent = choice;
            button.classList.add('choices');
            button.addEventListener('click', () => handleChoiceClick(index));
            choicesContainer.appendChild(button);
        });

        document.getElementById('done-button').style.display = 'block';
    }

    function handleChoiceClick(choiceIndex) {
        const questions = selectedLanguage === 'english' ? englishQuestions : vietnameseQuestions;
        const currentQuestion = questions[currentQuestionIndex];
        const selectedChoiceWeight = currentQuestion.weights[choiceIndex];

        // Update scores based on the selected choice
        weaverScore += selectedChoiceWeight.weaverScore || 0;
        pelicanScore += selectedChoiceWeight.pelicanScore || 0;
        flycatcherScore += selectedChoiceWeight.flycatcherScore || 0;
        owlScore += selectedChoiceWeight.owlScore || 0;
        crowScore += selectedChoiceWeight.crowScore || 0;
        craneScore += selectedChoiceWeight.craneScore || 0;
        parakeetScore += selectedChoiceWeight.parakeetScore || 0;
        eagleScore += selectedChoiceWeight.eagleScore || 0;
        pigeonScore += selectedChoiceWeight.pigeonScore || 0;
    }

    document.getElementById('done-button').addEventListener('click', () => {
        const questions = selectedLanguage === 'english' ? englishQuestions : vietnameseQuestions;
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayCurrentQuestion();
        } else {
            showNameEntry();
        }
    });

    function showNameEntry() {
        document.getElementById('question-container').style.display = 'none';
        document.getElementById('name-entry').style.display = 'block';

        document.getElementById('submit-name').addEventListener('click', () => {
            const testName = document.getElementById('test-taker-name').value.trim();
            if (!testName) {
                alert("Please enter your name.");
                return;
            }
            displayResult(testName);
        });
    }

    function displayResult(testTakerName) {
        const results = [
            { type: "weaver", score: weaverScore },
            { type: "pelican", score: pelicanScore },
            // ...add other types and their scores...
        ];

        results.sort((a, b) => b.score - a.score);
        const topResult = results[0];
        const secondResult = results[1];

        const potentialMatches = birdMatches[topResult.type];
        const birdMatch = potentialMatches.includes(secondResult.type) ? secondResult.type : potentialMatches[0];

        const languagePrefix = selectedLanguage === 'english' ? 'eng' : 'vie';
        overlayNameOnImage(`${languagePrefix}-persona-${topResult.type}.png`, testTakerName, "Persona");
        overlayNameOnImage(`${languagePrefix}-match-${birdMatch}.png`, testTakerName, "Match");
    }

    function overlayNameOnImage(imagePath, testTakerName, imageLabel) {
        const resultContainer = document.getElementById('result');
        const image = new Image();
        image.src = imagePath;
        
        image.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            
            ctx.drawImage(image, 0, 0);
            ctx.font = '20px Arial';
            ctx.fillStyle = 'black';  // Set text color to black
            ctx.textAlign = 'right';
            
            // Position the text in the bottom-right corner of the first section (1000 x 375)
            const xPosition = canvas.width - 50;  // 50px from the right edge
            const yPosition = 355;                // 20px above the bottom of the first section
            ctx.fillText(`Name: ${testTakerName}`, xPosition, yPosition);

            const finalImage = new Image();
            finalImage.src = canvas.toDataURL('image/png');
            resultContainer.appendChild(finalImage);

            const downloadBtn = document.createElement('a');
            downloadBtn.href = finalImage.src;
            downloadBtn.download = `${imageLabel.toLowerCase()}-${testTakerName}.png`;
            downloadBtn.textContent = `Download ${imageLabel}`;
            downloadBtn.style.display = 'block';
            resultContainer.appendChild(downloadBtn);
        };

        document.getElementById('result-container').style.display = 'block';
    }

    document.querySelectorAll('.language-button').forEach(button => {
        button.addEventListener('click', (event) => {
            selectedLanguage = event.target.dataset.language;
            document.getElementById('language-selection').style.display = 'none';
            document.getElementById('question-container').style.display = 'block';
            displayCurrentQuestion();
        });
    });
});
