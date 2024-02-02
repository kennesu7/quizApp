const myQuestions = [
    {
        question : "Where is cmpt 276 located?",
        choices : [
            "Burnaby Campus",
            "Surrey Campus",
            "Downtown Campus",
            "CMPT 276 does not exist"
        ],
        answer : "Surrey Campus"
    },
    {
        question : "2+3?",
        choices : [
            "2", "3", "5", "19"
        ],
        answer : 5
    },
    {
        question : "How much is 1GB worth?",
        choices : [
            "1024mb",
            "500mb",
            "2000mb",
            "0.1TB"
        ],
        answer : "1024mb"
    },
    {
        question : "What year is it?",
        choices : [
            "2002",
            "2022",
            "2024",
            "2026"
        ],
        answer : "2024"
    }
]

let usersAnswers = {};
let question;
let currentQuestionIndex;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

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



const addUserAnswer = () => {
    let currentOptions = document.getElementsByName("answer-button");
    for (let i = 0; i < currentOptions.length; i++) {
        let currentOption = currentOptions[i];
        if (currentOption.checked == true) {
            usersAnswers[`${question.question}`] = currentOption.value;
        }
    }
}


const restartQuiz = () => {
    const delete_me=document.querySelector(".main-wrapper");
    delete_me.classList.remove('hide');
    const quizContainer=document.querySelector(".quiz-container");
    quizContainer.classList.remove('hide');
    const resultsContainer=document.querySelector(".results-container");
    resultsContainer.classList.add('hide');
    currentQuestionIndex = 0;
    usersAnswers = {};
    shuffleArray(myQuestions);
    displayQuesstion(0);
}


const submitQuiz = () => {
    const delete_me=document.querySelector(".main-wrapper");
    delete_me.classList.add('hide');
    const resultsContainer=document.querySelector(".results-container");
    resultsContainer.classList.remove('hide');

    let confirmMessage = `Do you want to submit? You may have unanswered questions`;
    let answered = Object.keys(usersAnswers);
    if (answered.length < myQuestions.length) {
        confirmMessage += `\nYou have ${myQuestions.length - answered.length} questions out of ${myQuestions.length} unanswered.`
    }
    let askBeforeSubmission = confirm(confirmMessage);
    let attempted = 0; correct = 0; wrong = 0;
    // store indexs of incorrect questions
    let incorrectQuestions = [];
    if (askBeforeSubmission) {
        for (let i = 0; i < myQuestions.length; i++) {
            let question = myQuestions[i];
            if (usersAnswers[`${question.question}`] != undefined) {
                attempted++;
            }
            if (usersAnswers[`${question.question}`] == question.answer) {
                correct++;
            } else {
                wrong++;
                incorrectQuestions.push(i);
            }
        }
    }
    let wrongAnswers = incorrectQuestions.map(i =>
        `<div class="each-wrong">${myQuestions[i].question}: Your answer - ${usersAnswers[myQuestions[i].question]}, Correct answer - ${myQuestions[i].answer}</div><br>`);
    wrongAnswers = wrongAnswers.join('');


    const resultsDetails = document.querySelector(".results-details");
    const showWrongQuestion=document.querySelector(".incorrect-questions");
    const quizContainer=document.querySelector(".quiz-container");
    const restartButton=document.querySelector(".restart-button");
    const buttonContent = '<button class="restart-btn" onclick="restartQuiz()">Restart</button>';

    quizContainer.classList.add('hide');

    resultsDetails.innerHTML=
    `<div>
    <h3>Your Score</h3>
    <div id="attempted">Attempted: ${attempted} / ${myQuestions.length}</div>
    <div id="corrected">Correct: ${correct} / ${myQuestions.length}</div>
    <div id="wrong">Wrong: ${wrong} / ${myQuestions.length}</div>
</div>`;

    

    showWrongQuestion.innerHTML=
    `<h3> Results </h3>
    <div class="wrongAnswers">
    ${wrongAnswers}
    </div>`;
    restartButton.innerHTML = buttonContent;


   
}


const displayQuesstion = (i) => {
    const hide_me=document.querySelector(".results-container");
    hide_me.classList.add("hide");
    currentQuestionIndex = i;
    if (myQuestions[currentQuestionIndex]) {
        question = myQuestions[currentQuestionIndex];
        let options = createAnswers();

        const questionName = document.querySelector(".question_name");
        const answersContainer = document.querySelector(".answers-containers");
        const actionButtons = document.querySelector(".action-btns");

        questionName.textContent = `Question ${currentQuestionIndex + 1} of ${myQuestions.length}: ${question.question}`;
        answersContainer.innerHTML = options;

        let buttonsHTML = '';
        if (currentQuestionIndex > 0) {
            buttonsHTML += `<button class="prev-next" onclick="displayQuesstion(${currentQuestionIndex - 1})">Previous</button>`;
        }
        if (currentQuestionIndex < myQuestions.length - 1) {
            buttonsHTML += `<button class="prev-next" onclick="displayQuesstion(${currentQuestionIndex + 1})">Next</button>`;
        }
        if (currentQuestionIndex === myQuestions.length - 1) {
            buttonsHTML += `<button class="prev-next" onclick="submitQuiz()" style="background-color: red;">Submit</button>`;
        }
        actionButtons.innerHTML = buttonsHTML;
    } else {
        alert("Invalid question");
    }
}
displayQuesstion(0);