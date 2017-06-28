### Simle Calculator
This app is a simple calculator. It can perfom basic operations, like add/minus/multiply/divide. Also, it supports parenthesis.

#### How to run
Open this [demo](https://fttlanshang.github.io/calculator/) or download the zip file and open the `index.html`.

#### How it's implemented
The basic ideas are as follows. They are quite straight forward. Maybe there are better implementations.
- get the string in the result show box (I get the string until the user presses enter)
- turns the string into an array, each number and operator is a element
- turns the infix array into suffix array
- calculate the suffix array