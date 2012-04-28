# Synopsis
An interactive representation of an object for the CLI similar to that of console.dir() in webkit.

# Motivation
Reading big object dumps is a waste of time. Progressive disclosure helps.

# Features
 - Searchable/Repeat search
 - Handles cyclical references
 - Expand and collapse nodes

# Usage

## Install
Do `npm install cdir -g` and then require the module in your program like this `console.dir = require('cdir')`.

## Navigate
Use `console.dir(someobject)` somewhere in your program and then hit `tab`, `shift+tab` or the arrow keys to cycle through the object's members. You can hit `space`, `return` or `enter` to expand a member.

## Search
Search by pressing the `/` key. This will display a `/` prompt. If you have already searched for something it will be displayed before the `/` prompt. For instance if you searched for "foobar" it would appear as `(foobar) /`.

## Quit
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

