let score = 0;
let currentProblemNumber = 1;
let problem;
let started = false;
let operators = [];

document.addEventListener("DOMContentLoaded", () => {
  const listElements = document.querySelectorAll(".show-hide ul li");
  const expressionElement = document.querySelector(".expression");
  const currentScoreElement = document.querySelector(".currentScore");
  const currentProblemElement = document.querySelector(".currentProblem");
  setProblemAndAnswersVisible(false);
  addListeners(
    listElements,
    expressionElement,
    currentScoreElement,
    currentProblemElement
  );
  document.querySelector(".year").innerText = new Date().getFullYear();
});

const addListeners = (
  listElements,
  expressionElement,
  currentScoreElement,
  currentProblemElement
) => {
  for (listElement of listElements) {
    listElement.addEventListener("click", (event) => {
      if (event.target.innerText == problem.correctAnswer) {
        score++;
      }
      currentScoreElement.innerText = score;
      eventLoop(listElements, expressionElement, currentProblemElement);
    });
  }

  // Keyboard input
  document.addEventListener("keyup", (event) => {
    switch (event.code) {
      case "Digit1":
        listElements[0].click();
        break;
      case "Digit2":
        listElements[1].click();
        break;
      case "Digit3":
        listElements[2].click();
        break;
      case "Digit4":
        listElements[3].click();
    }
  });

  const btnStartOverElement = document.getElementById("btnStartOver");
  btnStartOverElement.addEventListener("click", () => {
    if (!started) {
      startQuiz(listElements, expressionElement, currentProblemElement);
    } else {
      score = 0;
      currentScoreElement.innerText = score;
      currentProblemNumber = 1;
      eventLoop(listElements, expressionElement, currentProblemElement);
      setShowHideVisible();
    }
  });
  const instructionsElement = document.querySelector("header p.show-hide");
  btnStartOverElement.addEventListener("dblclick", () => {
    if (started) {
      started = false;
      setProblemAndAnswersVisible(false);
      btnStartOverElement.innerText = "Start";
      instructionsElement.innerText =
        "Please choose the math operations you would like to practice and click start";
      currentProblemNumber = 1; // Reset number
    }
  });
  const checkBoxes = document.querySelectorAll('input[type="checkbox"]');
  for (checkBox of checkBoxes) {
    checkBox.addEventListener("click", () => {
      btnStartOverElement.disabled = !areCheckboxesChecked(checkBoxes);
    });
  }

  // Dark theme

  const darkModeToggle = document.getElementById("toggleDarkMode");
  console.log(darkModeToggle);
  darkModeToggle.addEventListener("click", (event) => {
      event.preventDefault();
      for(child of document.children) {
          if(child.classList.contains("theme-dark")) {
            child.classList.remove("theme-dark");  
            continue;
          }
          child.classList.add("theme-dark");
      }
      const html = document.querySelector("html");
      if(darkModeToggle.innerText === "☀️") {
        html.style.backgroundColor = "#fff";
        darkModeToggle.innerText = "🌙";
      } else {
        html.style.backgroundColor = "#111";
        darkModeToggle.innerText = "☀️";
      }
  })

};

const eventLoop = (listElements, expressionElement, currentProblemElement) => {
  if (currentProblemNumber > 10) {
    // Stop looping
    setShowHideVisible(false);
    return;
  }
  problem = generateProblem(operators[randomNumber(operators.length - 1)]);
  currentProblemElement.innerText = currentProblemNumber;
  expressionElement.innerText = problem.question;
  let i = 0;
  for (listElement of listElements) {
    listElement.innerText = problem.answers[i];
    i++;
  }
  currentProblemNumber++;
};

const setProblemAndAnswersVisible = (visible = true) => {
  const problemSection = document.getElementById("problem");
  const answersSection = document.getElementById("answers");
  const operators = document.getElementById("operators");
  if (visible) {
    problemSection.classList.remove("hidden");
    answersSection.classList.remove("hidden");
    operators.classList.add("hidden");
  } else {
    problemSection.classList.add("hidden");
    answersSection.classList.add("hidden");
    operators.classList.remove("hidden");
  }
};

const setShowHideVisible = (visible = true) => {
  const showHideElements = document.querySelectorAll(".show-hide");
  for (element of showHideElements) {
    visible === false
      ? element.classList.add("hidden")
      : element.classList.remove("hidden");
  }
};

const randomNumber = (max) => {
  // ADD MIN MAX
  return Math.floor(Math.random() * (max + 1));
};

const generateProblem = (operator, numberOfAnswers = 4) => {
  const { x, y, answer } = generateQuestion(operator); // object destructuring
  return {
    question: `${x} ${operator} ${y}`,
    correctAnswer: answer,
    answers: generateAnswers(answer, numberOfAnswers, operator),
  };
};

/**
 * Returns an object with the numbers and the solution
 * @param {string} operator The operator to be applied
 */
const generateQuestion = (operator) => {
  let x;
  let y;
  let answer;
  switch (operator) {
    case "+":
      x = randomNumber(50);
      y = randomNumber(50);
      answer = x + y;
      break;
    case "-":
      x = randomNumber(100);
      y = randomNumber(100);
      answer = x - y;
      break;
    case "×":
      x = randomNumber(9);
      y = randomNumber(9);
      answer = x * y;
      break;
    case "÷":
      y = randomNumber(8) + 1; // 1-9
      answer = randomNumber(8) + 1; // 1-9
      x = y * answer;
      break;
    default:
      throw new TypeError(`Invalid operator ${operator}`);
  }
  return {
    x: x,
    y: y,
    answer: answer,
  };
};

/**
 * Generates an array of possible answers
 * Possible answers are generated to match the operator possibilities
 * **Answers will be unique**
 * Could be problematic if numberOfAnswers is greater than the possible unique answers
 * @param {number} correctAnswer
 * @param {number} numberOfAnswers
 * @param {string} operator
 */
const generateAnswers = (correctAnswer, numberOfAnswers, operator) => {
  const answers = [];
  const isValidAnswer = (answer) =>
    answer !== correctAnswer && !answers.includes(answer);
  for (let i = 0; i < numberOfAnswers; i++) {
    let incorrectAnswer;
    switch (operator) {
      case "+":
        do {
          incorrectAnswer = randomNumber(200); // 0 to 100
        } while (!isValidAnswer(incorrectAnswer));
        break;
      case "-":
        do {
          incorrectAnswer =
            correctAnswer < 0 ? randomNumber(100) - 100 : randomNumber(100); // -100 to 100
        } while (!isValidAnswer(incorrectAnswer));
        break;
      case "×":
        do {
          incorrectAnswer = randomNumber(9) * randomNumber(9);
        } while (!isValidAnswer(incorrectAnswer));
        break;
      case "÷":
        do {
          incorrectAnswer = randomNumber(9);
        } while (!isValidAnswer(incorrectAnswer));
        break;
      default:
        throw new TypeError(`Invalid operator ${operator}`);
    }
    answers.push(incorrectAnswer);
  }
  answers[randomNumber(numberOfAnswers - 1)] = correctAnswer; // Zero indexed
  return answers;
};

const startQuiz = (listElements, expressionElement, currentProblemElement) => {
  const btnStartOverElement = document.getElementById("btnStartOver");
  btnStartOverElement.innerText = "Start Over";
  const instructionsElement = document.querySelector("header p.show-hide");
  instructionsElement.innerText =
    "Please select an answer below the problem by clicking on the box or pressing keys 1-4";
  setProblemAndAnswersVisible();
  computeOperators();
  started = true;
  eventLoop(listElements, expressionElement, currentProblemElement);
};

/**
 * Loops through check boxes and adds operators
 */
const computeOperators = () => {
  operators = [];
  const checkBoxes = document.querySelectorAll('input[type="checkbox"]');
  for (checkBox of checkBoxes) {
    if (checkBox.checked) operators.push(checkBox.value);
  }
};

const areCheckboxesChecked = (checkBoxes) => {
  for (checkBox of checkBoxes) {
    if (checkBox.checked) return true;
  }
  return false;
};
