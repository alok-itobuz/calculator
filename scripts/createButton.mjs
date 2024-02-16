export function btnPostfix(val) {
  if (val >= "0" && val <= "9") {
    return val;
  } else {
    switch (val) {
      case "+":
        return "plus";
      case "-":
        return "minus";
      //   case "X":
      case "*":
        return "mul";
      case "/":
        return "divide";
      case ".":
        return "dot";
    }
  }
}
export function createButton(val) {
  const btnContainer = document.createElement("div");
  btnContainer.classList.add("btn-normal-container", "col-3");

  const btn = document.createElement("button");
  btn.classList.add(
    "btn",
    "btn-normal",
    "w-100",
    "h-100",
    `btn-${btnPostfix(val)}`
  );

  if (val === "DEL") btn.classList.add("btn-delete");
  btn.textContent = val;

  btnContainer.append(btn);

  return btnContainer;
}
