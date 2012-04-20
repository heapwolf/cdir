
var tty = require('tty');
var fs = require('fs');
var jv = exports, stack = [];

var stdin = process.openStdin(); 
tty.setRawMode(true);    

var tabSize = 2;
var displayed = 0;

var meta = [], map = [0];

var selection = 1;
var index = 0;

var write = function write(s) {
  process.stdout.write(s);
}

//
// move the cursor upward on the screen
//
var up = function up(i) {

var maxLineLen = process.stdout.getWindowSize()[0]/2;

  if (i > 0) {
    while(i--) {
      write(ws(maxLineLen, true) + '\033[1A\r');
    }
  }
  else {
    write('\033[1A\r');
  }
};

//
// generate whitespace
//
var ws = function ws(i, multiplier) {
  
  var s = '';
  
  if (multiplier) {
    i = i * tabSize;
  }

  while(i--) {
    s += ' ';
  }
  return s;
};

var getType = function getType(o) {

  if (typeof o === 'string' || typeof o === 'number' || 
    typeof o === 'boolean' || typeof o === 'function') {
    return typeof o;
  }
  else if (({}).toString.call(o) === '[object RegExp]') {
    return 'regexp';
  }
  else if (Array.isArray(o)) {
    return 'array';
  }
  else if (typeof o === 'undefined') {
    return 'undefined';
  }
  else if (({}).toString.call(o) === '[object Null]') {
    return 'null';
  }
  else if (({}).toString.call(o) === '[object Object]') {
    return 'object';
  }
};

//
// generate a representation of the data
//
var indent = 0;
var seed = -1;
var constructMeta = function constructMeta(parentType, depth, node, itemPrefix) {

  itemPrefix = itemPrefix || '';

  var first = meta.length === 0;
  var type = getType(node);
  seed++;

  switch(type) {
    case 'string':

      meta.push({
        description: itemPrefix + '\033[31m"' + node + '"\033[0m',
        expanded: false,
        displayed: first,
        type: type,
        depth: depth,
        index: seed
      });

    break;
    case 'number':
    case 'boolean':
    case 'undefined':
    case 'regexp':
    case 'null':

      meta.push({
        description: itemPrefix + '\033[31m' + node + '\033[0m',
        expanded: false,
        displayed: first,
        type: type,
        depth: depth,
        index: seed
      });

    break;
    case 'function':

      meta.push({
        description: itemPrefix + '[Function]',
        expanded: false,
        displayed: first,
        type: type,
        depth: depth,
        index: seed
      });

    break;
    case 'array':

      meta.push({
        description: itemPrefix + '\033[36mArray[\033[0m' + node.length + '\033[36m]\033[0m',
        expanded: false,
        displayed: first,
        type: type,
        depth: depth,
        index: seed
      });

      indent++;
      depth++;

      for (var i = 0, l = node.length; i < l; i++) {
        var description = ws(indent, true) + i + ': ';
        constructMeta(type, depth, node[i], description);
      }

      indent--;

    break;
    case 'object':

      meta.push({ 
        description: itemPrefix + '\033[36mObject\033[0m',
        expanded: false,
        displayed: first,
        type: type,
        depth: depth,
        index: seed
      });

      indent++;
      depth++;

      for (var key in node) {
        var description = ws(indent, true) + key + ': ';
        constructMeta(type, depth, node[key], description);
      }

      indent--;

    break;
  }

};

var renderMeta = function renderMeta() {

  displayed = 0;

  for (var i = 0, l = meta.length; i < l; i++) {

    if (meta[i].displayed === true) {

      displayed++;

      if (displayed === selection) {
        write('\033[30;47m');
        write(meta[i].description.replace(/\033\[[0-9;]*m/g, '') + '\n');
        write('\033[0m');
      }
      else {
        write(meta[i].description + '\n');
      }

    }
  }
};

var listener = function listener(chunk, key) {

  if (key) {

    var downAction = (key.name === 'tab' && !key.shift) || key.name === 'down';
    var upAction = (key.shift && key.name === 'tab') || key.name === 'up';

    if (downAction && selection < displayed) {

      //
      // get the actual index of the item from the map.
      //
      index = map[selection];

      selection++;

      up(displayed);
      renderMeta();
    }

    if (upAction && selection > 1) {

      selection--;
      index = map[selection-1];

      up(displayed);
      renderMeta();
    }

    //
    // if this is a toggle, the value must be of type array or object.
    //
    if ((key.name === 'space' || key.name === 'enter') &&
        (meta[index].type === 'array' || meta[index].type === 'object')) {

      var start = selection;
      var stop = meta.length;
      var next = meta[index].depth+1;
      var started = false;

      if (meta[index].type === 'string') {
        return;
      }

      if (meta[index].expanded) {

        meta[index].expanded = false;

        for (var i = index, l = stop; i < l; i++) {

          if (meta[i].depth >= next) {
            meta[i].displayed = false;
            meta[i].expanded = false;
            started = true;
          }
          else if (started && meta[i].depth < next) {
            break;
          }
        }

      }
      else {

        meta[index].expanded = true;

        for (var i = index, l = stop; i < l; i++) {

          if (meta[i].depth === next) {
            meta[i].displayed = true;
            meta[i].expanded = false;
            started = true;
          }
          else if (started && meta[i].depth < next) {
            break;
          }
        }

      }

      map = [];
      for (var i = 0, l = meta.length; i < l; i++) {      
        if (meta[i].displayed === true) {
          map.push(meta[i].index);
        }
      }

      up(displayed);
      renderMeta();
    }

    if (key.name === 'q' || (key.ctrl && key.name == 'c')) {
      //write('\r\n');
      stdin.removeListener('keypress', listener);
      stdin.pause();
    }

  }
};

var dir = function dir(obj, options) {

  constructMeta(getType(obj), 0, obj);
  renderMeta();

  stdin.on('keypress', listener);
};

module.exports = dir;
