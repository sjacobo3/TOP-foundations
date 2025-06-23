let currentInput = ""; // stores the number currently being entered
let firstOperand = ""; // stores the first number for the operation
let secondOperand = ""; // stores the second number for the operation
let currentOperation = null; // stores the active operation (+, -, *, /)
let result = 0; // stores the result of the calculation

const MAX_DIGITS = 12; // maximum number of digits allowed in the display

const outputText = document.getElementById('display-calculation'); // Top display for the ongoing calculation
const resultText = document.getElementById('display-input'); // Main display for the current number/result

// HELPER FUNCTIONS
function updateMainDisplay(value) {
    if (value.length > MAX_DIGITS) {
        resultText.style.fontSize = "30px";
        resultText.textContent = "TOO BIG";
        return true;        // indicate value is too big
    } else {
        resultText.textContent = value;
        return false;
    }
}
function updateOperationDisplay(text) {
    outputText.textContent = text;
}

function clearAll() {
    currentInput = ""; 
    firstOperand = ""; 
    secondOperand = ""; 
    currentOperation = null; 
    result = 0;
    updateMainDisplay("0");
    updateOperationDisplay("0");
}

function backspace() {
    if (currentInput === "TOO BIG" || resultText.textContent === "TOO BIG") {
        clearAll(); // If it's "TOO BIG", clear everything
        return;
    }

    if (currentOperation === null) {
        // Deleting from the first operand
        if (firstOperand.length > 0) {
            firstOperand = firstOperand.slice(0, -1);
            updateMainDisplay(firstOperand);
        }
    } else {
        // Deleting from the second operand
        if (secondOperand.length > 0) {
            secondOperand = secondOperand.slice(0, -1);
            updateMainDisplay(secondOperand);
        }
    }
}

function appendDecimal() {
    if (currentInput === "TOO BIG" || resultText.textContent === "TOO BIG") {
        return; // Don't append if display is error
    }

    if (currentOperation === null) {
        if (!firstOperand.includes(".")) {
            firstOperand += ".";
            updateMainDisplay(firstOperand);
        }
    } else {
        if (!secondOperand.includes(".")) {
            secondOperand += ".";
            updateMainDisplay(secondOperand);
        }
    }
}

function calculateResult() {
    if (firstOperand === "" || secondOperand === "" || currentOperation === null) {
        return; // Not enough operands or no operation
    }

    const num1 = parseFloat(firstOperand);
    const num2 = parseFloat(secondOperand);

    if (isNaN(num1) || isNaN(num2)) {
        resultText.textContent = "Error";
        return;
    }

    switch (currentOperation) {
        case "add":
            result = num1 + num2;
            break;
        case "subtract":
            result = num1 - num2;
            break;
        case "multiply":
            result = num1 * num2;
            break;
        case "divide":
            if (num2 === 0) {
                resultText.textContent = "Error: Div by 0";
                firstOperand = ""; // Reset for new calculation
                secondOperand = "";
                currentOperation = null;
                return;
            }
            result = num1 / num2;
            break;
        default:
            return;
    }

    // Limit floating point precision to 6 decimal places
    result = parseFloat(result.toFixed(6)); 

    if (updateMainDisplay(result.toString())) {
        firstOperand = ""; // Clear if result is too big
    } else {
        firstOperand = result.toString(); // Set result as first operand for chaining
    }
    secondOperand = "";
    currentOperation = null; // Clear operation after calculation
}

// --- Event Handlers ---

// Number buttons
document.querySelectorAll('.number').forEach((button) => {
    button.addEventListener("click", () => {
        if (resultText.textContent === "TOO BIG") {
            clearAll(); // Clear error state before new input
            return;
        }

        if (currentOperation === null) {
            // Building the first number
            if (firstOperand.length < MAX_DIGITS) {
                firstOperand += button.value;
                updateMainDisplay(firstOperand);
            } else {
                updateMainDisplay("TOO BIG"); // Indicate immediate overflow
            }
        } else {
            // Building the second number
            if (secondOperand.length < MAX_DIGITS) {
                secondOperand += button.value;
                updateMainDisplay(secondOperand);
            } else {
                updateMainDisplay("TOO BIG"); // Indicate immediate overflow
            }
        }
    });
});

// Decimal button
document.getElementById('decimal').addEventListener("click", appendDecimal);

// Delete/Backspace button
document.getElementById('delete').addEventListener("click", backspace);

// Clear button
document.getElementById('clear').addEventListener("click", clearAll);

// Operation buttons
document.getElementById('add').addEventListener("click", () => handleOperation(" + ", "add"));
document.getElementById('subtract').addEventListener("click", () => handleOperation(" - ", "subtract"));
document.getElementById('multiply').addEventListener("click", () => handleOperation(" * ", "multiply"));
document.getElementById('divide').addEventListener("click", () => handleOperation(" ÷ ", "divide"));

function handleOperation(operatorSymbol, operationName) {
    if (resultText.textContent === "TOO BIG" || resultText.textContent.includes("Error")) {
        clearAll(); // Clear error state before starting new operation
        return;
    }

    if (firstOperand === "" && currentOperation === null) {
        // If no first operand, assume 0 or wait for input
        // For simplicity, let's wait for input or do nothing if no number entered yet
        return;
    }

    if (currentOperation !== null && secondOperand === "") {
        // If an operation is already set and no second operand,
        // just change the operation
        currentOperation = operationName;
        updateOperationDisplay(`${firstOperand} ${operatorSymbol}`);
        return;
    }

    if (firstOperand !== "" && secondOperand !== "") {
        // If both operands exist, calculate the result first
        calculateResult();
        // After calculation, the result is in firstOperand, so set the new operation
        currentOperation = operationName;
        updateOperationDisplay(`${firstOperand} ${operatorSymbol}`);
    } else if (firstOperand !== "") {
        // Set the first operand and the operation
        currentOperation = operationName;
        updateOperationDisplay(`${firstOperand} ${operatorSymbol}`);
    }
    secondOperand = ""; // Reset second operand for new input
}


// Equals button
document.getElementById('equals').addEventListener("click", () => {
    if (firstOperand !== "" && secondOperand !== "" && currentOperation !== null) {
        updateOperationDisplay(`${firstOperand} ${getOperatorSymbol(currentOperation)} ${secondOperand}`);
        calculateResult();
    } else if (firstOperand !== "" && currentOperation !== null && secondOperand === "") {
        // If an operation is selected but no second operand, pressing equals should use firstOperand as second
        secondOperand = firstOperand;
        updateOperationDisplay(`${firstOperand} ${getOperatorSymbol(currentOperation)} ${secondOperand}`);
        calculateResult();
    }
});

function getOperatorSymbol(operationName) {
    switch (operationName) {
        case "add": return "+";
        case "subtract": return "-";
        case "multiply": return "*";
        case "divide": return "÷";
        default: return "";
    }
}

// switching theme buttons
let switchButtons = document.querySelectorAll(".button-theme");
switchButtons.forEach(button => {
    button.addEventListener("click", () => {
        // Remove all theme classes from the body
        document.body.classList.remove("theme-comic", "theme-western", "theme-dark", "theme-default");
        const introHeader = document.getElementById("introHeader");
        introHeader.style.display = "none";

        // Add the selected theme class
        const selectedTheme = button.value.toLowerCase();

        // Add class only if it's not default
        if (selectedTheme !== "default") {
            document.body.classList.add(`theme-${selectedTheme}`);
        } else {
            // show introHeader
            introHeader.style.display = "block";
        }
    });
});