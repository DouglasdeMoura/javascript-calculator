class Calculator {
  constructor() {
    this.operators = {
      '-': {
        arguments: 2,
        symbol: '-',
        precedence: 2,
        associativity: 'left',
        eval: (a, b) => {
          return a - b;
        }
      },
      '+': {
        arguments: 2,
        symbol: '+',
        precedence: 2,
        associativity: 'left',
        eval: (a, b) => {
          return a + b;
        }
      },
      '*': {
        arguments: 2,
        symbol: '*',
        precedence: 3,
        associativity: 'left',
        eval: (a, b) => {
          return a * b;
        }
      },
     '/': {
      symbol: '/',
        arguments: 2,
        precedence: 3,
        associativity: 'left',
        eval: (a, b) => {
          return a / b;
        }
      },
      '~': {
        arguments: 1,
        symbol: '~',
        precedence: 4,
        associativity: 'left',
        eval: (a) => {
          return -1 * a;
        }
      }
    }

    this.significativeAlgarisms = 3;
  }

  isValidOperator(operator) {
    const validation = Object.keys(this.operators).indexOf(operator);

    return (validation !== -1 ? true : false);
  }

  removeSpaces(expression) {
    return expression.replace(/\s+/g, '');
  }

  fixOrphanCharacters(expression) {
    return this.fixOrphanMinusSign(this.fixRightOrphanParenthesis(this.fixLeftOrphanParenthesis(expression)));
  }

  fixLeftOrphanParenthesis(expression) {
    let newExpression;
    const splittedExpression = expression.split('#(');

    function isLastCharacterNumeric(string) {
      if (typeof string !== 'undefined') {
        const lastItemOnTheString = string[string.length - 1];

        return isFinite(lastItemOnTheString);
      }

      return false;
    }

    for (let i = 0; i < splittedExpression.length; i++) {
      if (
        (i % 2) !== 0
        && isLastCharacterNumeric(splittedExpression[i - 1])
      ) {
        splittedExpression[i - 1] = `${splittedExpression[i - 1]}#*`;
      }
    }

    newExpression = splittedExpression.join('#(');

    return newExpression;
  }

  fixRightOrphanParenthesis(expression) {
    let newExpression;
    const splittedExpression = expression.split(')#');

    function isFirstCharacterNumeric(string) {
      if (typeof string !== 'undefined') {
        const firstItemOnTheString = string[0];

        return isFinite(firstItemOnTheString);
      }

      return false;
    }

    for (let i = 0; i < splittedExpression.length; i++) {
      if (
        (i % 2) === 0
        && isFirstCharacterNumeric(splittedExpression[i + 1])
      ) {
        splittedExpression[i + 1] = `*#${splittedExpression[i + 1]}`;
      }
    }

    newExpression = splittedExpression.join(')#');

    return newExpression;
  }

  fixOrphanMinusSign(expression) {
    let newExpression = 
      expression.split('-#(')
                .join('~#(')
                .split('(#-')
                .join('(#~')
                .split('+#-')
                .join('+#~')
                .split('*#-')
                .join('*#~')
                .split('/#-')
                .join('/#~');

    if (newExpression.slice(0, 2) === '#-') {
      newExpression = '#~' + newExpression.slice(2, (newExpression.length));
    }

    return newExpression;
  }

  tokenize(expression) {
    let newExpression = this.removeSpaces(expression);
    const validOperatorForTokenization = {
      ...this.operators,
      '(': {},
      ')': {}
    }
    const operatorsArrayKeys = Object.keys(validOperatorForTokenization);

    operatorsArrayKeys.map((operator) => {
      if (newExpression.indexOf(operator) !== -1) {
        const splittedExpression = newExpression.split(operator);

        if (splittedExpression.length > 1) {
          newExpression = splittedExpression.join(`#${operator}#`);
        } 
      }
    });

    newExpression = newExpression.split('##').join('#')

    const tokenizedExpression = this.fixOrphanCharacters(newExpression).split('#').filter((item) => {
      return item !== '';
    });

    return tokenizedExpression;
  }

  infixToPostfixNotation(tokenizedExpression) {
    const stack = [];
    const queue = [];

    const localOperators = {
      ...this.operators,
      '(': {
        symbol: '(',
        precedence: 0
      }
    }

    tokenizedExpression.forEach(token => {
      if (this.isNumeric(token)) {
        queue.push(token);
      } else if (typeof localOperators[token] !== 'undefined') {
        if (stack.length === 0) {
          stack.unshift(localOperators[token]);
        } else if (localOperators[token].precedence === 0) {
          stack.unshift(localOperators[token]);
        } else if (stack[0].precedence < localOperators[token].precedence) {
          stack.unshift(localOperators[token]);
        } else if (stack[0].precedence > localOperators[token].precedence) {
          queue.push(stack.shift());
          stack.unshift(localOperators[token]);
        } else if (
          stack[0].precedence === localOperators[token].precedence
          && localOperators[token].associativity === 'right'
        ) {
          stack.unshift(localOperators[token]);
        } else if (stack[0].precedence === localOperators[token].precedence) {
          queue.push(stack.shift());
          stack.unshift(localOperators[token]);
        }
      } else if (token === '(') {
        stack.unshift(token);
      } else if (token === ')') {
        while(stack[0].symbol !== '(') {
          queue.push(stack.shift());
  
          if (stack.length === 0) {
            throw new Error('The expression lacks an opening parenthesis.');
          }
        }
        stack.shift();
      }
    });

    while (stack.length > 0) {
      queue.push(stack.shift());
    }

    return queue;
  }

  isNumeric(token) {
    return !isNaN(parseFloat(token)) && isFinite(token);
  }

  evaluate(postfixExpression) {
    const stack = [];

    postfixExpression.map((token) => {
      if (this.isNumeric(token)) {
        stack.push(Number(token));
      } else if(token.arguments === 1) {
        const a = stack.pop();
        stack.push(token.eval(a));
      } else if(typeof token.eval !== 'undefined') {
        const b = stack.pop();
        const a = stack.pop();

        stack.push(token.eval(a, b));
      } else {
        throw new Error("There's no right parenthesis matching the left parenthesis.");
      }
    });

    const result = stack.pop();

    if (Number.isInteger(result)) {
      return result;
    } else {
      return result.toFixed(this.significativeAlgarisms);
    }
  }

  solve(infixExpression) {
    return this.evaluate(this.infixToPostfixNotation(this.tokenize(infixExpression)));
  }
}

class CalculatorBuilder {
  constructor() {
    this.buttons = [
      '(', ')', '⌫', 'C',
      7, 8, 9, '÷',
      4, 5, 6, '×',
      1, 2, 3, '-',
      0, '.', '=', '+'
    ];

    this.result = '';
    this.error = '';
    this.pointer = -1;
    this.history = [];

    this.calculator = new Calculator();
  }

  createButton(value) {
    const button = document.createElement('button');
    const buttonWrapper = document.createElement('div');

    button.innerText = value;

    button.addEventListener('click', () => {
      this.handleClick(button.innerText);
    });

    buttonWrapper.appendChild(button);

    return button;
  }

  createDiv(className) {
    const divElement = document.createElement('div');
    divElement.classList.add(className);

    return divElement;
  }

  buildInterface() {
    const calculator = this.createDiv('calculator');
    const display = this.createDiv('display');
    const operation = this.createDiv('evaluated-expression');
    const input = this.createDiv('input');
    const buttonsArea = this.createDiv('buttons-area');

    this.buttons.map(button => {
      buttonsArea.appendChild(this.createButton(button));
    });

    display.appendChild(operation);
    display.appendChild(input);

    calculator.appendChild(display);
    calculator.appendChild(buttonsArea);

    return calculator;
  }

  getInterface(htmlElementToAppend) {
    document.addEventListener('keydown', (event) => {
      const keys = {
        '0': 0,
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        'Backspace': '⌫',
        'Escape': 'C',
        'Delete': 'C',
        'C': 'C',
        '+': '+',
        '-': '-',
        '/': '÷',
        '*': '×',
        '(': '(',
        ')': ')',
        'Enter': '=',
        '=': '=',
      }

      if (typeof keys[event.key] !== 'undefined') {
        this.handleClick(keys[event.key]);
      }

      if(event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        if (this.pointer > 0) {
          this.pointer -= 1;
        }
      }

      if(event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        if (this.pointer < (this.history.length - 1)) {
          this.pointer += 1;
        }
      }

      if (event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'ArrowRight') {
        this.displayEvaluatedExpression(this.history[this.pointer].expression);
        this.displayResult(this.history[this.pointer].result);
      }
    });

    htmlElementToAppend.appendChild(this.buildInterface());
  }

  displayError(message) {
    const display = document.getElementsByClassName('display')[0];
    const errorDiv = this.createDiv('error');

    errorDiv.innerHTML = message;
    display.appendChild(errorDiv);
  }

  displayEvaluatedExpression(expression) {
    const expressionContainer = document.getElementsByClassName('evaluated-expression')[0];
    expressionContainer.textContent = `${expression} =`;
  }

  displayResult(result) {
    const resultContainer = document.getElementsByClassName('input')[0];
    resultContainer.textContent = result;
  }

  clearError() {
    const errorDiv = document.getElementsByClassName('error')[0];

    if (typeof errorDiv !== 'undefined') {
      errorDiv.remove();
    }
  }

  clearEvaluatedExpression() {
    const evaluatedExpressionContainer = document.getElementsByClassName('evaluated-expression')[0];
    evaluatedExpressionContainer.textContent = '';
  }

  addToHistory(evaluatedExpression, result) {
    this.history.push({
      expression: evaluatedExpression,
      result: result
    });

    this.pointer += 1;
  }

  handleClick(input) {
    const calculatorInput = document.getElementsByClassName('input')[0];

    this.clearError();

    if (this.result !== '') {
      this.result = '';

      if (this.calculator.isNumeric(input)) {
        calculatorInput.textContent = '';
      }
    }

    if (
      !this.calculator.isNumeric(this.lastOperator)
      && input !== 'C'
      && input !== '⌫'
      && input !== '='
      && input !== '('
      && input !== ')'
      && !isFinite(input) 
      && 
        (
          this.lastOperator === '÷' 
          || (this.lastOperator === '×')
          || (this.lastOperator === '-')
          || (this.lastOperator === '+')
        )
    ) {
      input = '';
    } else {
      this.lastOperator = input;
    }

    function replaceCustomCharacters(expression) {
      return expression.split('×').join('*').split('÷').join('/');
    }

    switch (input) {
      case '=':
        try {
          const evaluatedExpression = replaceCustomCharacters(calculatorInput.textContent);
          this.displayEvaluatedExpression(calculatorInput.textContent);
          this.result = this.calculator.solve(evaluatedExpression);
          this.displayResult(this.result);
          this.addToHistory(evaluatedExpression, this.result);
        } catch (error) {
          this.result = '';
          this.displayError('Check your expression <br>and try again.');
        }
        break;
      case '⌫':
        calculatorInput.textContent = calculatorInput.textContent.slice(0, -1);
        break;
      case 'C':
        calculatorInput.textContent = '';
        this.clearEvaluatedExpression();
        break;
      default:
        calculatorInput.textContent += input;
        break;
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const calculator = new CalculatorBuilder();
  const htmlElementToAppendTheCalculator = document.getElementById('root');
  calculator.getInterface(htmlElementToAppendTheCalculator);
});