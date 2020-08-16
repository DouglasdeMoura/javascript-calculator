class Calculator {
  constructor() {
    this.buttons = [
      '(', ')', '⌫', 'C',
       7,   8,   9,  '÷',
       4,   5,   6,  '×',
       1,   2,   3,  '-',
       0,  '.', '=', '+'
    ];

    this.result = '';

    this.error = '';
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

  evaluate(input) {
    try {
      this.displayOperand(input);
      return eval(input.replace(/÷/gi, '/').replace(/×/gi, '*'));
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