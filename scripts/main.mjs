import { btnPostfix, createButton } from "./createButton.mjs";

const inputNumbers = document.querySelector(".input-numbers");
const allButtonsContainer = document.querySelector(".buttons-container");
const allSmallButtonsContainer = document.querySelector(
  ".small-buttons-container"
);

const operations = ["+", "-", "*", "/", "^", "!"];
const specialButtons = ["del", "reset", "="];

function isValidLetter(val) {
  return (val >= "0" && val <= "9") || operations.includes(val) || val == ".";
}

function calculateExpression(expression) {
  let exprArray = expression.trim().split("");
  let nums = [],
    ops = [];
  let strNum = "";
  exprArray.forEach((x, i) => {
    if ((x >= "0" && x <= "9") || x === "." || i == 0) {
      strNum += x;
    } else {
      nums.push(strNum);
      strNum = "";
      ops.push(x);
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

function validateAndUpdateInput(currentInputValue, keyPressed) {
  const isInitialZero = !currentInputValue.length && keyPressed === "0";

  currentInputValue = currentInputValue.trim();
  const isInitialOperationExceptMinus =
    (!currentInputValue.length ||
      (currentInputValue.length === 1 &&
        operations.includes(currentInputValue[0]))) &&
    keyPressed !== "-" &&
    operations.includes(keyPressed);

  const isLastDotAndCurrentDot =
    !!currentInputValue.length &&
    currentInputValue.at(-1) === "." &&
    keyPressed === ".";

  if (keyPressed === ".") {
    let isDotBefore = false;
    for (let i = currentInputValue.length - 1; i >= 0; i--) {
      if (currentInputValue[i] === ".") {
        isDotBefore = true;
        break;
      }
    }
    if (isDotBefore) return;
  }

  // if the first value is 0 or first value is any operation except - then return.
  if (
    isInitialZero ||
    isInitialOperationExceptMinus ||
    isLastDotAndCurrentDot
  ) {
    return;
  } else if (specialButtons.includes(keyPressed.toLowerCase())) {
    if (
      keyPressed.toLowerCase() === "del" &&
      !!inputNumbers.textContent.length
    ) {
      currentInputValue = currentInputValue.split("");
      currentInputValue.splice(-1);
      currentInputValue = currentInputValue.join("");
      inputNumbers.textContent = currentInputValue;
    } else if (keyPressed.toLowerCase() === "reset") {
      inputNumbers.textContent = "";
    } else if (keyPressed === "=") {
      let expr = inputNumbers.textContent;
      const lastChar = inputNumbers.textContent
        .toString()
        .charAt(inputNumbers.textContent.length - 1);
      if (operations.includes(lastChar) || lastChar === ".") {
        expr = expr.split("");
        expr.splice(-1);
        expr = expr.join("");
      }
      console.log(expr);
      const result = calculateExpression(expr);
      inputNumbers.textContent = result;
    }
  }
  // if the last value is any operation or dot and the present key pressed value is any operation then remove the last and add the present keypressed.
  else if (
    !!currentInputValue.length &&
    (operations.includes(currentInputValue.at(-1)) ||
      currentInputValue.at(-1) === ".") &&
    operations.includes(keyPressed)
  ) {
    let prev = currentInputValue.split("");
    prev.splice(-1);
    prev = prev.join("");
    inputNumbers.textContent = prev + keyPressed;
  }
  // if the last value is any operation and the current value is . then it'll take it as floating number like (0.something)
  else {
    inputNumbers.textContent = currentInputValue + keyPressed;
  }
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
    // "X",
  ];
  allSmallButtonsContainer.innerHTML = "";
  btnVals.forEach((val) =>
    allSmallButtonsContainer.appendChild(createButton(val))
  );
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
  const currentInputValue = inputNumbers.textContent.toString();
  const keyPressed = e.target.textContent.toString();

  validateAndUpdateInput(currentInputValue, keyPressed);
});
