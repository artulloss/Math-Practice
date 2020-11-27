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
  // Theme
  const localStorage = window.localStorage;
  if(localStorage.getItem('theme') === 'dark') {
    document.getElementById("toggleDarkMode").click();
  }
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

  const btnStartOverElement = document.getElementById("btnStartOver");

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
        break;
      case "KeyR":
        btnStartOverElement.click();
          break;
      case "KeyE":
        const clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent('dblclick', true, true);
        btnStartOverElement.dispatchEvent(clickEvent);
    }
  });

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
  const localStorage = window.localStorage;
  darkModeToggle.addEventListener("click", (event) => {
      event.preventDefault();
      toggleColorShifting(); // RGB in dark theme !!!
      const html = document.querySelector("html");
      const elements = [html, btnStartOverElement];
      for(element of elements) {
          if(element.classList.contains("theme-dark")) {
            element.classList.remove("theme-dark");  
            continue;
          }
          element.classList.add("theme-dark");
      }
      if(darkModeToggle.innerText === "☀️") {
        localStorage.setItem('theme', 'light');
        darkModeToggle.innerText = "🌙";
      } else {
        darkModeToggle.innerText = "☀️";
        localStorage.setItem('theme', 'dark');
      }
  });

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

// Linear color shifting

let shifting = false;
let intervalId;

const toggleColorShifting = () => {
    let elements = [document.querySelector("button")];
    elements = elements.concat(Array.from(document.querySelectorAll(".show-hide ul li")))
    elements.push(document.querySelector(".expression"));
    if(shifting === false) {
        const fps = 30;
        const changeEverySeconds = 1;
        intervalId = setInterval(() => colorShift(elements, fps, changeEverySeconds), 1000 / fps);
        shifting = true;
    } else {
        clearInterval(intervalId);
        shifting = false;
        for(element of elements) {
            element.style.borderColor = "";
        }
    }
}

let colorShiftIncrementor = 0;
let color;
let calculateChangeColorValues = false;
let changeColorValues = {
    r: 0,
    g: 0,
    b: 0
}

const colorShift = (elements, fps, changeEverySeconds) => {    
    const firstElement = elements[0];
    let newColor;
    if(colorShiftIncrementor * changeEverySeconds >= fps) {
        color = randomColor();
        colorShiftIncrementor = 0;
        calculateChangeColorValues = true;
    } else {
        oldColor = firstElement.style.borderColor;
        m = oldColor.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
        if(m) {
            let r, g, b;
            [_, r, g, b] = m;
            if(calculateChangeColorValues) {
                changeColorValues.r = (color.r - r) / fps;
                changeColorValues.g = (color.g - g) / fps;
                changeColorValues.b = (color.b - b) / fps;
                calculateChangeColorValues = false;
            }
            r = Number(r) + changeColorValues.r;
            g = Number(g) + changeColorValues.g;
            b = Number(b) + changeColorValues.b;
            newColor = {
                r: r,
                g: g,
                b: b
            }
            for(element of elements) {
                element.style.borderColor = `rgb(${newColor.r}, ${newColor.g}, ${newColor.b})`;
            }
            colorShiftIncrementor++;
        } else {
            firstElement.style.borderColor = "#8c87d5";
            for(let i = 1; i < elements.length - 1; i++) {
                elements[i].style.borderColor = "#eee";
            }
            color = randomColor();
            calculateChangeColorValues = true;
            colorShiftIncrementor++;
            return;
        }
    }
}

/** Returns random rgb */
const randomColor = () => {
    return {
        r: randomNumber(255),
        g: randomNumber(255),
        b: randomNumber(255)
    }
}