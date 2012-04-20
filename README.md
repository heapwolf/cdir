# Synopsis
An interactive representation of an object for the CLI similar to that of console.dir() in webkit.

# Motivation
Why? Sometimes you have a lot of data that gets dumped to the screen. It's hard to keep track of it visually. A lot of the time you are just looking for one item in a sea of data. Progressive disclosure helps.

# Usage
First, require the module. Then use `console.dir(somecode)` in your program and then use `tab` or `shift+tab` to cycle through the object's members. You can hit `space`, `return` or `enter` to expand a member. See the example below.

Hit `ctrl+c` or `q` to quit!

There is a CLI version too if you want to use it. `npm install cdir -g`.

```js

console.dir = require('../dir');

var stuff = { 
  "name" : "cdir", 
  "description" : "An interactive console.dir() for the terminal.",
  "tags" : [
    "console",
    "debug",
    "debugging",
    "json",
    "interacive",
    "prompt"
  ]
  "foo": function() { 
    return "node tests/test.js"
  }
};

console.dir(stuff);

```

The output looks something like this.

<img src="https://github.com/hij1nx/cdir/raw/master/screenshot.png"/>

