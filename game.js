// game.js
const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const progressBarFull = document.getElementById("progressBarFull");
const scoreText = document.getElementById("score");
const loader = document.getElementById("loader");
const game = document.getElementById("game");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

// this will hold your JSON-packed questions
let questions = [];
console.log("📗 game.js loaded, about to fetch questions.json…");

console.log("► game.js loaded at", new Date().toLocaleTimeString());
console.log("About to fetch questions.json…");

// Fetch your local questions.json
fetch("./questions.json")
  .then((res) => {
    if (!res.ok) throw new Error("Failed to load questions.json");
    return res.json();
  })
  .then((loadedQuestions) => {
    console.log("📘 fetched questions.json, data:", loadedQuestions);

    questions = loadedQuestions;
    startGame();
  })
  .catch((err) => {
    console.error("Error loading questions:", err);
    loader.innerText = "Could not load questions.";
  });

// Game constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 5;

function startGame() {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  loader.classList.add("hidden");
  game.classList.remove("hidden");
  getNewQuestion();
}

function getNewQuestion() {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    return window.location.assign("end.html");
  }

  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  // remove it from the pool
  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
}

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;
    acceptingAnswers = false;

    const selected = e.target;
    const selectedAnswer = selected.dataset["number"];
    const isCorrect = selectedAnswer == currentQuestion.answer;

    const classToApply = isCorrect ? "correct" : "incorrect";
    selected.parentElement.classList.add(classToApply);

    if (isCorrect) {
      incrementScore(CORRECT_BONUS);

      setTimeout(() => {
        selected.parentElement.classList.remove(classToApply);
        getNewQuestion();
      }, 1000);
    } else {
      // ❗️Custom alert bisa diganti dengan modal atau efek lain
      alert(currentQuestion.wrong_message || "Ups, jawaban salah! Coba lagi ya~");

      // Hapus class setelah delay biar warna balik normal
      setTimeout(() => {
        selected.parentElement.classList.remove(classToApply);
        acceptingAnswers = true; // boleh jawab lagi
      }, 800);
    }
  });
});

function incrementScore(num) {
  score += num;
  scoreText.innerText = score;
}
