let sessionToken = "";
let currentQuestion = 1;
let correctAnswer = "";
let possibleAnswers = [];
let rightAnswers = 0;
let sessionQuestions = {};
let userSettings;

// Fetch session token from API note** session expires after 6 hours of inactivity
async function fetchSessionToken(){

    loader.style.display = "block";
    const response = await fetch(`https://opentdb.com/api_token.php?command=request&encode=url3986`);
    const data = await response.json();
    sessionToken = data.token;
    loader.style.display = "none";
}



//Fetch question from the API using the user settings
async function fetchQuestions(setup){
    settingsScreen.style.display = "none";
    loader.style.display = "block";
    const response = await fetch(`https://opentdb.com/api.php?amount=${setup.chosenNumOfQuestions}&category=${setup.chosenCategory}&difficulty=${setup.chosenDificulty}&type=multiple&token=${sessionToken}`);
    const questions = await response.json();
    loader.style.display = "none";
    console.log(questions.results);

    return questions.results;

}

//Used by proceedBtn eventListener on click
async function goToSettings(){

    introScreen.style.display = "none";
    await fetchSessionToken();
    settingsScreen.style.display = "flex";

}

//Gets user settings
function getSettings(){

    const categoryValue = document.querySelector("#category").value;
    const questionsValue = document.querySelector("#questions").value;
    const difficultyValue = document.querySelector("#difficulty").value;

    userSettings = {
        chosenCategory: categoryValue,
        chosenNumOfQuestions: questionsValue,
        chosenDificulty: difficultyValue,
    }
    return userSettings;

}

function displayResults(){
    quizScreen.style.display = "none";

    scoreElement.innerHTML = `${rightAnswers}/${currentQuestion - 1}`;
    resultsScreen.style.display = "flex";
}

//This is a Fisher-Yates shuffle algorithm
function shuffleArray(array){

    var currentIndex = array.length, tempValue, randIndex;

    while (0 != currentIndex){

        randIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        tempValue = array[currentIndex];
        array[currentIndex] = array[randIndex];
        array[randIndex] = tempValue;
    }

    return array;
}

//Decode HTML entities from the server
function decodeHTMLEntities(text){

    let texArea = document.createElement("textarea");
    texArea.innerHTML = text;
    return texArea.value;

}

function nextQuestion(){

    //Bring back event listers to allow user to choose answer on the next question
    answerElementsArray.map((ans) =>{
        ans.addEventListener("click", processAnswer)
    });

    //Reset border colors to their original color
    answerElementsArray.map((ans) =>{
        ans.style.borderColor = "rgb(9, 201, 137)";
    });

    if (currentQuestion <= userSettings.chosenNumOfQuestions){

        const displayedQuestion = sessionQuestions[currentQuestion - 1].question;
        correctAnswer = sessionQuestions[currentQuestion - 1].correct_answer;
        correctAnswer = decodeHTMLEntities(correctAnswer);
        possibleAnswers = [...sessionQuestions[currentQuestion - 1].incorrect_answers];
        possibleAnswers.map((ans) =>{
            ans = decodeHTMLEntities(ans);
        })
        possibleAnswers.push(correctAnswer);
        possibleAnswers = shuffleArray(possibleAnswers);

        possibleAnswers.map((ans, index) =>{
            
            answerElementsArray[index].innerHTML = ans;
            
        });

        questionElement.innerHTML = displayedQuestion;
        quizScreen.style.display = "flex";
        nextBtn.disabled = true;

    } else{
        displayResults();
    }

}

//Used by proceedBtn eventListener on click
async function startQuiz(){
    userSettings = getSettings();
    sessionQuestions =  await fetchQuestions(userSettings);
    nextQuestion(currentQuestion);


}

function processAnswer(evt){
    //Remove event lister to all answer to stop selection
    answerElementsArray.map((ans) =>{
        ans.removeEventListener("click", processAnswer);
    });
    
    if (correctAnswer == evt.target.innerHTML){
        rightAnswers++;
        currentQuestion++;
        evt.target.style.borderColor = "#0afd02";
        nextBtn.disabled = false;

    }
    else{
        
        evt.target.style.borderColor = "#b90404";

        answerElementsArray.map((ans) =>{
            if (ans.innerHTML == correctAnswer){
                ans.style.borderColor = "#0afd02";
            }
        })

        currentQuestion++;
        nextBtn.disabled = false;
    }
}

function newGame(){

    //Reset all variables used to play and show results
    currentQuestion = 1;
    correctAnswer = "";
    possibleAnswers = [];
    rightAnswers = 0;
    sessionQuestions = {};
    userSettings;

    resultsScreen.style.display = "none";
    settingsScreen.style.display = "flex";
}

// When user clicks proceed button
proceedBtn.addEventListener("click", goToSettings);

//When user clicks play button
playBtn.addEventListener("click", startQuiz);

//When user clicks and chooses answer
answerElementsArray.map((ans) =>{
    ans.addEventListener("click", processAnswer)
});

//when user clicks next button
nextBtn.addEventListener("click", nextQuestion);

//when user clicks new button
newBtn.addEventListener("click", newGame);
