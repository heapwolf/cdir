# Synopsis
An interactive representation of an object for the CLI similar to that of console.dir() in webkit.

# Motivation
Why? Sometimes you have a lot of data that gets dumped to the screen. It's hard to keep track of it visually. A lot of the time you are just looking for one item in a sea of data. Progressive disclosure helps.

# Features
 - Searchable/Repeat search
 - Handles cyclical references
 - Expand and collapse nodes like webkit console.dir()
 - 

# Usage

## Installation
Require the module in your program like this `console.dir = require('cdir')`.

## Navigation
Use `console.dir(someobject)` somewhere in your program and use `tab` or `shift+tab` to cycle through the object's members. You can hit `space`, `return` or `enter` to expand a member. See the example below.

## Searching
Search by pressing the `/` key. This will display a `/` prompt. If you have already searched for something it will be displayed before the `/` prompt. For instance if you searched for "foobar" it would appear as `(foobar) /`.

## Quitting
Hit `ctrl+c` or `q` to quit!

## Simple Example
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
  ],
  "foo": function() { 
    return "node tests/test.js"
  }
};

console.dir(stuff);

```

The output looks something like this.

<img src="https://github.com/hij1nx/cdir/raw/master/screenshot.png"/>

