//Buttons
const proceedBtn = document.querySelector(".proceed-btn");
const playBtn = document.querySelector(".play-btn");
const nextBtn = document.querySelector(".next-btn");
const resultsBtn = document.querySelector(".results-btn");
const newBtn = document.querySelector(".new-btn");
const loader = document.querySelector(".main-container .loader");

//Screens
const introScreen = document.querySelector(".intro");
const settingsScreen = document.querySelector(".settings"); 
const quizScreen = document.querySelector(".game"); 
const resultsScreen = document.querySelector(".results");


//Quiz screen
const questionElement = document.querySelector(".question");
const answer1Element = document.querySelector(".answer-1");
const answer2Element = document.querySelector(".answer-2");
const answer3Element = document.querySelector(".answer-3");
const answer4Element = document.querySelector(".answer-4");
const answerElementsArray = [answer1Element, answer2Element, answer3Element, answer4Element];

//Results screen
const scoreElement = document.querySelector(".score");
