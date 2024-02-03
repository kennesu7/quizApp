const myQuestions = [
    {
        question: "Where is cmpt 276 located?",
        choices: [
            "Burnaby Campus",
            "Surrey Campus",
            "Downtown Campus",
            "CMPT 276 does not exist"
        ],
        answer: "Surrey Campus"
    },
    {
        question: "2*5?",
        choices: [
            "10", "90", "25", "0"
        ],
        answer: 10
    },
    {
        question: "How much is 1GB worth?",
        choices: [
            "1024mb",
            "500mb",
            "2000mb",
            "0.1TB"
        ],
        answer: "1024mb"
    },
    {
        question: "What year is it?",
        choices: [
            "2002",
            "2022",
            "2024",
            "2026"
        ],
        answer: "2024"
    }
]

let usersAnswers = {};
let question;
let currentQuestionIndex;

// Function borrowed from https://www.freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/
// Function will shuffle the array so that the same questions arent asked in the same order.
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
// Logic on how to save users previous code is in part influenced by 
//*  https://dev.to/talibackend/simple-quiz-app-using-html-css-and-javascript-b8j * 
function createAnswers() {
    // use a map function
    // for each option in myQuestions array return an HTML string 
    return question.choices.map((option) => {
        const selected = usersAnswers[question.question] === option; //checks if the question has been selected before
        return `
            <div class="each-answer">
                <input type="radio"
                    onclick="addUserAnswer()"
                    ${selected ? "checked" : ""}
                    name="answer-button" value="${option}"> ${option}
            </div>`;
    }).join('');
}


// Adds the users answers to the usersAnswers object
// Some of the code logic is inspired by * https://dev.to/talibackend/simple-quiz-app-using-html-css-and-javascript-b8j *
const addUserAnswer = () => {
    let possbileAnswers = document.getElementsByName("answer-button");
    for (let i = 0; i < possbileAnswers.length; i++) {
        let currentAnswer = possbileAnswers[i];
        // usersAnswers objecte is checked using the key value pairs
        // if the question matches the prevvious selected answer then that answer has been chosen previously
        // by the user
        if (currentAnswer.checked == true) {
            usersAnswers[`${question.question}`] = currentAnswer.value;
        }
    }
}


const restartQuiz = () => {
    const delete_me = document.querySelector(".main-wrapper");
    delete_me.classList.remove('hide');
    const quizContainer = document.querySelector(".quiz-container");
    quizContainer.classList.remove('hide');
    const resultsContainer = document.querySelector(".results-container");
    resultsContainer.classList.add('hide');
    // Initialize to 0
    currentQuestionIndex = 0;
    usersAnswers = {};
    shuffleArray(myQuestions);
    displayQuesstion(0);
}


const submitQuiz = () => {
    const delete_me = document.querySelector(".main-wrapper");
    delete_me.classList.add('hide');
    const resultsContainer = document.querySelector(".results-container");
    resultsContainer.classList.remove('hide');
    // Asks user to confirm submission
    let confirmMessage = `Do you want to submit? You may have unanswered questions`;
    let askBeforeSubmission = confirm(confirmMessage);
    let numAttempted = 0; numCorrect = 0; numWrong = 0;
    // store indexs of incorrect questions
    let incorrectQuestions = [];
    if (askBeforeSubmission) {
        for (let i = 0; i < myQuestions.length; i++) {
            let question = myQuestions[i];
            if (usersAnswers[`${question.question}`] != undefined) {
                numAttempted++;
            }
            if (usersAnswers[`${question.question}`] == question.answer) {
                numCorrect++;
            } else {
                numWrong++;
                incorrectQuestions.push(i);
            }
        }
    }
    // Displays the answers the user got wrong by a map function
    let wrongAnswers = incorrectQuestions.map(i =>
        `<div class="each-wrong">${myQuestions[i].question}: Your answer - ${usersAnswers[myQuestions[i].question]}, Correct answer - ${myQuestions[i].answer}</div><br>`);
    wrongAnswers = wrongAnswers.join('');


    const resultsDetails = document.querySelector(".results-details");
    const showWrongQuestion = document.querySelector(".incorrect-questions");
    const quizContainer = document.querySelector(".quiz-container");
    const restartButton = document.querySelector(".restart-button");
    const button = '<button class="restart-btn" onclick="restartQuiz()">restart</button>';

    quizContainer.classList.add('hide');
    // displays the users score
    resultsDetails.innerHTML =
        `<div>
    <h3>Congragulations! These are your results </h3>
    <div id="corrected">Correct: ${numCorrect} / ${myQuestions.length}</div>
    <div id="wrong">Wrong: ${numWrong} / ${myQuestions.length}</div>
    </div>`;


    // shows the questions user got wrong
    showWrongQuestion.innerHTML =
        `<h3> Results </h3>
    <div class="wrongAnswers">
    ${wrongAnswers}
    </div>`;
    restartButton.innerHTML = button;

}

// displays each question
const displayQuesstion = (i) => {
    const hide_me = document.querySelector(".results-container");
    hide_me.classList.add("hide");
    currentQuestionIndex = i;
    // If the question exists
    if (myQuestions[currentQuestionIndex]) {
        question = myQuestions[currentQuestionIndex];
        let options = createAnswers();

        const questionName = document.querySelector(".question_name");
        const answersContainer = document.querySelector(".answers-containers");
        const actionButtons = document.querySelector(".action-btns");

        questionName.textContent = `Question ${currentQuestionIndex + 1}:     ${question.question}`;
        answersContainer.innerHTML = options;

        let btns = '';
        //if first question then dont display previous
        if (currentQuestionIndex > 0) {
            btns += `<button class="previous-and-next" onclick="displayQuesstion(${currentQuestionIndex - 1})">Previous</button>`;
        }
        // if last question then dont display next
        if (currentQuestionIndex < myQuestions.length - 1) {
            btns += `<button class="previous-and-next" onclick="displayQuesstion(${currentQuestionIndex + 1})">Next</button>`;
        }
        // only on the last question show the submit button
        if (currentQuestionIndex === myQuestions.length - 1) {
            btns += `<button class="previous-and-next" onclick="submitQuiz()" style="background-color: red;">Submit</button>`;
        }
        actionButtons.innerHTML = btns;
    }
}
// start the quiz
displayQuesstion(0);