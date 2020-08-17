class Calculator {
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

    this.lastOperator = '';
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
    const operation = this.createDiv('operand');
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
    htmlElementToAppend.appendChild(this.buildInterface());
  }

  displayError(message) {
    const display = document.getElementsByClassName('display')[0];
    const errorDiv = this.createDiv('error');

    errorDiv.innerHTML = message;
    display.appendChild(errorDiv);
  }

  displayOperand(operand) {
    const operandContainer = document.getElementsByClassName('operand')[0];
    operandContainer.textContent = `${operand} =`;
  }

  clearError() {
    const errorDiv = document.getElementsByClassName('error')[0];

    if (typeof errorDiv !== 'undefined') {
      errorDiv.remove();
    }
  }

  clearOperand() {
    const operandContainer = document.getElementsByClassName('operand')[0];
    operandContainer.textContent = '';
  }

  getOperator(operator) {
    const operators = {
      "/": {
        symbol: '/',
        precedence: 3,
        associativity: 'left',
        eval: (a, b) => {
          return a / b;
        }
      },
      "*": {
        symbol: '*',
        precedence: 3,
        associativity: 'left',
        eval: (a, b) => {
          return a * b;
        }
      },
      "+": {
        symbol: '+',
        precedence: 2,
        associativity: 'left',
        eval: (a, b) => {
          return a + b;
        }
      },
      "-": {
        symbol: '-',
        precedence: 2,
        associativity: 'left',
        eval: (a, b) => {
          return a - b;
        }
      }
    }

    return operators[operator];
  }

  infixExpressionToPostfixExpression(expression) {
    const tokens = expression.split(' ').filter( token => {
      return token !== '';
    });

    const queue = [];
    const stack = [];

    tokens.forEach((token) => {
      const operator = this.getOperator(token);

      if (isFinite(token)) {
        queue.push(token);
      } else if (
        typeof stack[0] === 'object'
        && (
          stack[0].precedence > operator.precedence
          || (
            stack[0].precedence === operator.precedence
            && operator.associativity === 'left'
          )
        )
      ) {
        queue.push(stack[0]);
        stack.shift();
        stack.unshift(operator);
        
      } else if (token === '(') {
        stack.unshift(token);
      } else if (token === ')') {
        const rightParenthesisIndex = stack.indexOf('(');

        for (let i = 0; i < rightParenthesisIndex; i++) {
          queue.push(stack.shift());          
        }

        stack.shift();
      } else {
        if (typeof operator === 'object') {
          stack.unshift(operator);
        } else {
          stack.unshift(token);
        }
      }
    });

    stack.forEach(() => {
      queue.push(stack.shift());
    });

    return queue;
  }

  solveExpression(expression) {
    const postfixExpression = this.infixExpressionToPostfixExpression(expression);
    const stack =  [];

    postfixExpression.map((element) => {
      if (isFinite(element)) {
        stack.unshift(Number(element));
      } else {
        const b = stack.shift();
        const a = stack.shift();

        stack.unshift(element.eval(a, b));
      }
    });

    const result = stack.pop();

    return result;

  }

  evaluate(input) {
    try {
      this.displayOperand(input);
      const preparedExpression = input.replace(/÷/gi, ' / ')
        .replace(/×/gi, ' * ')
        .replace(/-/gi, ' - ')
        .replace(/\+/gi, ' + ')
        .replace(/\(/gi, ' ( ')
        .replace(/\)/gi, ' ) ');

      return this.solveExpression(preparedExpression);
    } catch (error) {
      this.result = '';
      this.displayError('Check your expression <br>and try again.');
      console.log(error);
      return input;
    }
  }

  handleClick(input) {
    const calculatorInput = document.getElementsByClassName('input')[0];
    this.clearError();

    if (this.result !== '') {
      this.result = '';

      if (isFinite(input)) {
        calculatorInput.textContent = '';
      }
    }

    if (
      !isFinite(this.lastOperator)
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

    switch (input) {
      case '=':
        const result = this.evaluate(calculatorInput.textContent);

        if (typeof this.result !== undefined) {
          calculatorInput.textContent = result;
          this.result = result;
        }
        break;
      case '⌫':
        calculatorInput.textContent = calculatorInput.textContent.slice(0, -1);
        break;
      case 'C':
        calculatorInput.textContent = '';
        this.clearOperand();
        break;
      default:
        calculatorInput.textContent += input;
        break;
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const calculator = new Calculator();
  const htmlElementToAppendTheCalculator = document.getElementById('root');
  calculator.getInterface(htmlElementToAppendTheCalculator);
});