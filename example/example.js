
console.dir = require('../cdir');

var big = { 
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
  "version" : function(a) { if ('x' && 1) { return 'A short string'; } else if (a) { console.log('foobar'); return 2000; } return 10; },
  "author" : "Paolo Fragomeni <paolo@nodejitsu.com>",
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
  },
  "a" : "dir", 
  "descsription" : "An interactive console.dir() for the terminal.",
  "tasgs" : [
    "console",
    "debug",
    "debugging",
    "json",
    "interacive",
    "prompt"
  ],
  "vsersion" : "0.0.1",
  "asuthor" : "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "asuadadasdsadthor" : "Paolo Fragomeni <paolo@nodejitsu.com>Paolo Fragomeni <paolo@nodejitsu.com>Paolo Fragomeni <paolo@nodejitsu.com>Paolo Fragomeni <paolo@nodejitsu.com>Paolo Fragomeni <paolo@nodejitsu.com>",
  "rsepository" : { 
    "type" : "git",
    "url" : "http://github.com/hij1nx/node-dir.git"
  },
  "bugss" : { 
    "url" : "http://github.com/hij1nx/node-dir/issues" 
  },
  "ensgines" : ["node >= 0.6.x"],
  "masin" : "./dir",
  "sscripts": { 
    "test": "node tests/test.js"
  },
  "foo": {
    "a" : "dir", 
    "descsription" : "An interactive console.dir() for the terminal.",
    "tasgs" : [
      "console",
      "debug",
      "debugging",
      "json",
      "interacive",
      "prompt"
    ],
    "vsersion" : "0.0.1",
    "asuthor" : "Paolo Fragomeni <paolo@nodejitsu.com>Paolo Fragomeni <paolo@nodejitsu.com>Paolo Fragomeni <paolo@nodejitsu.com>Paolo Fragomeni <paolo@nodejitsu.com>Paolo Fragomeni <paolo@nodejitsu.com>",
    "rsepository" : { 
      "type" : "git",
      "url" : "http://github.com/hij1nx/node-dir.git"
    },
    "bugss" : { 
      "url" : "http://github.com/hij1nx/node-dir/issues" 
    },
    "ensgines" : ["node >= 0.6.x"],
    "masin" : "./dir",
    "sscripts": { 
      "test": "node tests/test.js"
    }
  }
};

console.dir(big);