
console.dir = require('../cdir');

var stuff = { 
  "name" : "dir", 
  "description" : "An interactive console.dir() for the terminal.",
  "tags" : [
    "console",
    "debug",
    "debugging",
    "json",
    "interacive",
    "prompt"
  ],
  "version" : "0.0.1",
  "author" : "Paolo Fragomeni <paolo@nodejisu.com>",
  "repository" : { 
    "type" : "git",
    "url" : "http://github.com/hij1nx/node-dir.git"
  },
  "bugs" : { 
    "url" : "http://github.com/hij1nx/node-dir/issues" 
  },
  "engines" : ["node >= 0.6.x"],
  "main" : "./dir",
  "scripts": { 
    "test": "node tests/test.js"
  }
};

console.dir(stuff);
