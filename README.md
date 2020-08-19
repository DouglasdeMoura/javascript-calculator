# JavaScript Calculator

A simple JavaScript calculator built with HTML, CSS and vanilla JavaScript.


[Check the calculator working in the browser](https://douglasdemoura.github.io/javascript-calculator/).

Please, give me your thoughts on my implementation of the shunting-yard algorithm 😄.

## Usage

You can use your keyboard to interact with the calculator:

- Use <kbd>C</kbd>, <kbd>ESC</kbd> or <kbd>Delete</kbd> to clear the display;
- Use <kbd>←</kbd> or <kbd>↑</kbd> to go backwards in the input history;
- Use <kbd>→</kbd> or <kbd>↓</kbd> to go forward in the input history;
- Use number keys, parenthesis and <kbd>.</kbd> to input data.

## The solution

The method `Calculator().solve()` receives and infix notation mathematical expression and
solves it by rearraging the expression in [RPN](https://en.wikipedia.org/wiki/Reverse_Polish_notation) (postfix notation)
using the [shunting-yard algorithm](https://en.wikipedia.org/wiki/Shunting-yard_algorithm), by [Edsger Dijkstra](https://en.wikipedia.org/wiki/Edsger_W._Dijkstra).
Then, it processes the expression to output the result.

The class `CalculatorBuilder()` contains the methods to build the interface of the calculator and handle
the user's interactions.

## Contribution

Feel free to contribute with the solution and give me tips and counseling to make it better :)

## Author

[Douglas Moura](http://douglasmoura.dev)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details