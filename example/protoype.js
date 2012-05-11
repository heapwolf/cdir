
console.dir = require('../cdir');

var x = function() {};
x.prototype.foo = 10;
x.prototype.bar = [1,2,3];
x.prototype.bazz = function() { var x = "hello, world"; return x; };

var y = new x();

var foobar = {
  foodbla: x,
  foosball: y
};

console.dir(foobar);
