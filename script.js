const computingDisplay = document.querySelector('[data-computing-display]');
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const allClearButton = document.querySelector('[data-all-clear]');
const deleteCharButton = document.querySelector('[data-delete]');
const equalsButton = document.querySelector('[data-equals]');
let isResultOnDisplay = false;

function cleanDisplay() {
  computingDisplay.innerText = '';
}

function displayChar(button) {
  computingDisplay.innerText = computingDisplay.innerText + button.innerText.toString();
}

function deleteChar() {
  computingDisplay.innerText = computingDisplay.innerText.toString().slice(0, -1);
}

numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (isResultOnDisplay) {
      cleanDisplay();
    }
    isResultOnDisplay = false;
    displayChar(button);
  });
});

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (isResultOnDisplay) {
      cleanDisplay();
    }
    isResultOnDisplay = false;
    displayChar(button);
  });
});

allClearButton.addEventListener('click', button => {
  cleanDisplay();
});

deleteCharButton.addEventListener('click', button => {
  deleteChar();
});

equalsButton.addEventListener('click', () => {
  const expression = computingDisplay.innerText;
  const result = ifRootOfNegative(expression);
  computingDisplay.innerText = String(result);
  isResultOnDisplay = true;
});

function ifRootOfNegative(expression) {
  if ((expression.includes('√')) && (expression.includes('-'))) {
    for (let i = 0; i < expression.length; i++) {
      if (expression[i] === '√' && expression[i + 1] === '-') {
        return ('Square root of negative number!');
      } else if (expression[i] === '-' && expression[i + 1] === '√') {
        return parsePlusSeparatedExpression(expression);
      } else {
        return parsePlusSeparatedExpression(expression);
      }
    }
  } else {
    return parsePlusSeparatedExpression(expression);
  }
}

function parsePlusSeparatedExpression(expression) {
  if (expression.includes('+')) {
    const arrayOfPlusSplitExpression = expression.split('+');
    const arrayOfResultsToAssemble = arrayOfPlusSplitExpression.map(el => parseMinusSeparatedExpression(el));
    return assemble(arrayOfResultsToAssemble, '+');
  }
  return parseMinusSeparatedExpression(expression);
}

function parseMinusSeparatedExpression(expression) {
  let result;
  let arrayOfMinusSplitExpression = [];
  let arrayOfMinusPositions = [];
  let arrayOfSubtractingMinusPositions = [];
  let j = 0;
  let k = 0;
  if (expression.includes('-')) {
    let minusPosition = -1;
    while ((minusPosition = expression.indexOf('-', minusPosition + 1)) !== -1) {
      arrayOfMinusPositions.push(minusPosition);
    }
    //parse only subtracting minuses without more priory operation in front of the'-'
    for (let i = 0; i < arrayOfMinusPositions.length; i++) {
      j = arrayOfMinusPositions[i];
      if ((expression[j] === '-' && expression[j - 1] !== '*') && (expression[j] === '-' && expression[j - 1] !== '÷')) {
        arrayOfSubtractingMinusPositions.push(j);
      }
    }
    let startPos = 0;
    for (let i = 0; i < arrayOfSubtractingMinusPositions.length + 1; i++) {
      k = arrayOfSubtractingMinusPositions[i];
      arrayOfMinusSplitExpression.push(expression.slice(startPos, k));
      startPos = k + 1;
    }
    const arrayOfResultsToAssemble = arrayOfMinusSplitExpression.map(el => parseMultiplicationSeparatedExpression(el));
    result = assemble(arrayOfResultsToAssemble, '-');
  } else // expression doesn't includes '-'
  {
    expression = parseMultiplicationSeparatedExpression(expression);
    result = expression;
  }
  return result;
}

function parseMultiplicationSeparatedExpression(expression) {
  let result;
  if (expression.includes('*')) {
    const arrayOfMultiplicationSplitExpression = expression.split('*');
    const arrayOfResultsToAssemble = arrayOfMultiplicationSplitExpression.map(el => parseDivisionSeparatedExpression(el));
    result = assemble(arrayOfResultsToAssemble, '*');
  } else {
    expression = parseDivisionSeparatedExpression(expression);
    result = expression;
  }
  return result;
}

function parseDivisionSeparatedExpression(expression) {
  let result;
  if (expression.includes('÷')) {
    const arrayOfDivisionSplitExpression = expression.split('÷');
    const arrayOfResultsToAssemble = arrayOfDivisionSplitExpression.map(el => parseExponentSeparatedExpression(el));
    result = assemble(arrayOfResultsToAssemble, '÷');
  } else {
    expression = parseExponentSeparatedExpression(expression);
    result = expression;
  }
  return result;
}

function parseExponentSeparatedExpression(expression) {
  let result;
  if (expression.includes('^')) {
    let arrayOfExponentSplitExpression = expression.split('^');
    let arrayOfResultsToAssemble = arrayOfExponentSplitExpression.map(el => parseSqrtSeparatedExpression(el));
    result = assemble(arrayOfResultsToAssemble, '^');
  } else {
    expression = parseSqrtSeparatedExpression(expression);
    result = expression;
  }
  return result;
}

function parseSqrtSeparatedExpression(expression) {
  if (expression.includes('-√')) {
    expression = expression.slice(2);
    return -Math.sqrt(expression);
  } else if (expression.includes('√')) {
    expression = expression.slice(1);
    return Math.sqrt(expression);
  } else
    return expression;
}

function assemble(arr, operation) {
  arr = arr.map(Number);
  let accumulator = arr[0];
  arr = arr.slice(1);
  switch (operation) {
    case '+':
      arr.forEach(function(el) {
        accumulator += el;
      });
      accumulator = (accumulator.toFixed(16)) * 1;
      break;
    case '-':
      arr.forEach(function(el) {
        accumulator -= el;
      });
      accumulator = (accumulator.toFixed(16)) * 1;
      break;
    case '*':
      arr.forEach(function(el) {
        accumulator *= el;
      });
      accumulator = (accumulator.toFixed(16)) * 1;
      break;
    case '÷':
      arr.forEach(function(el) {
        if (el){
          accumulator = accumulator / el;
          accumulator = (accumulator.toFixed(16)) * 1;
        }else{
          return accumulator = 'Division by zero!';
        }
      });
      break;
    case '^':
      const base = accumulator;
      const exponentiation = arr[0];
      for (let i = 1; i < exponentiation; i++) {
        accumulator = accumulator * base;
      }
      accumulator = (accumulator.toFixed(16)) * 1;
      break;
    default:
      accumulator = new Error('Something wrong');
  }
  return accumulator;
}
