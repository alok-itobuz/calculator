import { btnPostfix, createButton } from "./createButton.mjs";

const inputNumbers = document.querySelector(".input-numbers");
const allButtonsContainer = document.querySelector(".buttons-container");
const allSmallButtonsContainer = document.querySelector(
  ".small-buttons-container"
);

const operations = ["+", "-", "*", "/", "^", "!"];
const specialButtons = ["del", "reset", "="];

// flags
let isDotPresentBefore = false;
let isNumPresentBefore = false;
let prevOperatorCount = 0;
let zeroEntered = true;

function isOperation(op) {
  return operations.includes(op);
}

function isValidLetter(val) {
  return (val >= "0" && val <= "9") || operations.includes(val) || val === ".";
}

function isOnlyZero(str) {
  return str.length === 1 && str[0] === "0";
}

function isNumber(val) {
  return val >= "0" && val <= "9";
}

function removeLastChar(str) {
  return str.slice(0, -1);
}

function calculateExpression(expression) {
  let exprArray = expression.trim().split("");
  let nums = [],
    ops = [];
  let strNum = "";
  let flag = 1;
  exprArray.forEach((x, i) => {
    if (flag === -1) {
      strNum += "-";
      flag = 1;
    } else if ((x >= "0" && x <= "9") || x === "." || i === 0) {
      strNum += x;
    } else {
      nums.push(strNum);
      strNum = "";
      ops.push(x);
      if (isOperation(exprArray[i + 1])) {
        flag = -1;
      }
    }
  });
  nums.push(strNum);
  let i = 0;

  // first multiply or divide
  while (i < ops.length) {
    const op = ops[i];
    let res;
    if (op === "*") {
      res = parseFloat(nums[i]) * parseFloat(nums[i + 1]);
    } else if (op === "/") {
      if (nums[i + 1] === "0") {
        inputNumbers.textContent = "Denominator can't be 0";
      }
      res = parseFloat(nums[i]) / parseFloat(nums[i + 1]);
    } else {
      i++;
    }
    if (op === "*" || op === "/") {
      nums[i] = res;
      nums = [...nums.slice(0, i + 1), ...nums.slice(i + 2)];
      ops = [...ops.slice(0, i), ...ops.slice(i + 1)];
      console.log(nums, ops);
    }
  }

  // addition or division
  i = 0;
  while (i < ops.length) {
    const op = ops[i];
    let res;
    if (op === "+") {
      res = parseFloat(nums[i]) + parseFloat(nums[i + 1]);
    } else if (op === "-") {
      res = parseFloat(nums[i]) - parseFloat(nums[i + 1]);
    } else {
      i++;
    }
    if (op === "+" || op === "-") {
      nums[i] = res;
      const numsLeft = nums.slice(0, i + 1);
      const numsRight = nums.slice(i + 2);
      nums = [...numsLeft, ...numsRight];

      ops = [...ops.slice(0, i), ...ops.slice(i + 1)];
    }
  }

  return nums[0];
}

function resetAllFlags() {
  isDotPresentBefore = false;
  isNumPresentBefore = false;
  prevOperatorCount = 0;
  zeroEntered = true;
}

function validateAndUpdateInput(currentInputValue, keyPressed) {
  let currentExpression = inputNumbers.textContent.trim();

  if (keyPressed === "0") {
    if (zeroEntered && !isDotPresentBefore && !isNumPresentBefore) {
      return;
    }
    currentExpression += keyPressed;
    zeroEntered = true;
  } else if (keyPressed === ".") {
    zeroEntered = false;
    if (isDotPresentBefore) {
      return;
    }

    currentExpression += keyPressed;
    isDotPresentBefore = true;
  } else if (isOperation(keyPressed)) {
    isNumPresentBefore = false;
    zeroEntered = false;
    isDotPresentBefore = false;
    if (currentExpression.at(-1) === ".") {
      currentExpression = removeLastChar(currentExpression);
    }
    if (keyPressed !== "-" && prevOperatorCount === 0) {
      if (isOperation(currentExpression.at(-1))) {
        currentExpression = removeLastChar(currentExpression);
      }
      prevOperatorCount = 1;
      currentExpression += keyPressed;
    } else if (keyPressed === "-" && prevOperatorCount <= 1) {
      currentExpression += keyPressed;
      prevOperatorCount++;
    }
  } else if (isNumber(keyPressed)) {
    prevOperatorCount = 0;
    zeroEntered = false;
    isNumPresentBefore = true;
    if (isOnlyZero(currentExpression)) {
      currentExpression = "";
    }
    currentExpression += keyPressed;
  } else if (specialButtons.includes(keyPressed.toLowerCase())) {
    const keyPressedLower = keyPressed.toLowerCase();
    if (keyPressedLower === "del") {
      let lastChar = currentExpression.at(-1);
      if (!currentExpression.textContent) {
        currentExpression = 0;
        inputNumbers.textContent = currentExpression;
        return;
      }
      if (lastChar === ".") {
        isDotPresentBefore = false;
      } else if (isOperation(lastChar)) {
        if (prevOperatorCount >= 1) prevOperatorCount--;
      }
      currentExpression = removeLastChar(currentExpression);

      if (!currentExpression.length) {
        currentExpression = "0";
        resetAllFlags();
      } else {
        lastChar = currentExpression.at(-1);
        if (isNumber(lastChar)) {
          isNumPresentBefore = true;
        } else if (isOperation(lastChar)) {
          if (!prevOperatorCount) prevOperatorCount++;
        }
      }
    } else if (keyPressedLower === "reset") {
      currentExpression = "0";
      resetAllFlags();
    } else if (keyPressedLower === "=") {
      for (let i = 1; i <= 2; i++) {
        if (isOperation(currentExpression.at(-1)))
          currentExpression = removeLastChar(currentExpression);
      }
      currentExpression = calculateExpression(currentExpression);
    }
  }
  inputNumbers.textContent = currentExpression;
}

window.addEventListener("load", function () {
  const btnVals = [
    7,
    8,
    9,
    "DEL",
    4,
    5,
    6,
    "+",
    1,
    2,
    3,
    "-",
    ".",
    0,
    "/",
    "*",
  ];
  allSmallButtonsContainer.innerHTML = "";
  btnVals.forEach((val) =>
    allSmallButtonsContainer.appendChild(createButton(val))
  );
  inputNumbers.textContent = "0";
});

window.addEventListener("keypress", function (e) {
  const key = e.key;
  const isValidKey = isValidLetter(key);
  if (!isValidKey) {
    return;
  }
  const targetedButton = document.querySelector(`.btn-${btnPostfix(key)}`);
  targetedButton.click();
});

allButtonsContainer.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.tagName !== "BUTTON") {
    return;
  }
  const currentInputValue = inputNumbers.textContent.toString().trim();
  const keyPressed = e.target.textContent.toString();

  validateAndUpdateInput(currentInputValue, keyPressed);
});
