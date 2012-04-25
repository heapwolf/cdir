
console.dir = require('../cdir');

var x = { a: 0, b: 1, c: 2 };
x.a = x;

console.dir(x);