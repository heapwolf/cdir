var tty = require('tty');
var ttys = require('ttys');
var rl = require('readline');

var stdin = ttys.stdin;
var stdout = ttys.stdout;

//
// shorthand write to stdout
//
var write = function write (s) {
  stdout.write(s);
}

//
// move the cursor upward on the screen
//
var up = function up (i, save) {

  i = i || 1;

  if (i > 0) {
    while(i--) {
      write(!save ? '\033[K\033[1A\r' : '\033[1A\r');
    }
  }
};

var right = function right (i) {

  i = i || 1;

  if (i > 0) {
    while(i--) {
      write('\033[1C\r');
    }
  }
};

//
// generate whitespace
//
var ws = function ws (i, multiplier) {
  
  var s = '';
  
  if (multiplier) {
    i = i * 2;
  }

  while(i--) {
    s += ' ';
  }
  return s;
};

var getType = function getType (o) {

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
// hande cyclical references
//
if (typeof JSON.decycle !== 'function') {
  JSON.decycle = function decycle (object) {

    var objects = [],
        paths = [];

    return (function derez (value, path) {

      var name, nu;

      switch (typeof value) {
        case 'object':

          if (!value) {
            return null;
          }

          for (var i = 0; i < objects.length; i += 1) {
            if (objects[i] === value) {
              return '[Circular]';
            }
          }

          objects.push(value);
          paths.push(path);

          if (Object.prototype.toString.apply(value) === '[object Array]') {
            nu = [];
            for (var i = 0; i < value.length; i += 1) {
              nu[i] = derez(value[i], path + '[' + i + ']');
            }
          } 
          else {

            nu = {};
            for (name in value) {
              nu[name] = derez(value[name], path + '[' + JSON.stringify(name) + ']');
            }
          }
          return nu;
        default:
          return value;
        break;
        }

    }(object, '[Curcular]'));
  };
}

//
// the main export
//
module.exports = function dir (obj, options) {

  var displayed = 0;
  var copybuffer = 0;

  var searchmode = false;
  var searchbuffer = '';
  var lastsearch = '';
  var repeat = false;
  var lastIndex = 0;

  var meta = [], map = [0];

  var selection = 1;
  var index = 0;

  //
  // generate a representation of the data
  //
  var indent = 0;
  var seed = -1;

  var constructMeta = function constructMeta (parentType, depth, node, itemPrefix, dontPreface) {

    itemPrefix = itemPrefix || '';

    var first = meta.length === 0;
    var type = getType(node);
    seed++;

    function addStrData (str) {

      indent++;
      depth++;

      str = str.replace(/\r|\n/g, '\\r\\n');

      var buffer = '';
      var description = ws(indent, true);
      var maxWidth = stdout.getWindowSize()[0] - indent - 6;

      for (var i = 0, cpos = 0, l = str.length; i < l; i++, cpos++) {

        buffer += str[i];

        if (cpos >= maxWidth) {

          cpos = 0;

          meta.push({
            description: description + '\033[31m"' + buffer + '"\033[0m',
            expanded: false,
            displayed: first,
            type: type,
            depth: depth,
            index: seed++
          });

          buffer = '';
        }

      }

      if (buffer.length > 0) {

        meta.push({
          description: description + '\033[31m"' + buffer + '"\033[0m',
          expanded: false,
          displayed: first,
          type: type,
          depth: depth,
          index: seed++
        });

      }

      indent--;
    }

    switch (type) {
      case 'string':

        var extLen = (indent + itemPrefix.length) - 2;
        var truncatedNode = '0';
        var truncated = false;

          if (node.length > stdout.getWindowSize()[0] - extLen) {
            truncatedNode = '▸ ' + '\033[31m"' + node.substr(0, stdout.getWindowSize()[0]/2) + '..."\033[0m';
            truncated = true;
          }
          else {
            truncatedNode = '\033[31m"' + node + '"\033[0m';
          }

          meta.push({
            description: itemPrefix + truncatedNode,
            expanded: false,
            displayed: first,
            type: type,
            depth: depth,
            node: node,
            index: seed
          });

          if (truncated === true) {
            addStrData(node);
          }
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
          node: node,
          index: seed
        });
      break;
      case 'function':

        meta.push({
          description: itemPrefix + '▸ \033[36m[Function]\033[0m',
          expanded: false,
          displayed: first,
          type: type,
          depth: depth,
          node: node,
          index: seed
        });

        if (Object.keys(node.prototype).length > 0) {

          indent++;
          depth++;

          constructMeta(type, depth, node.toString(), ws(indent, true));

          for (var key in node.prototype) {
            var description = ws(indent, true) + key + ': ';
            constructMeta(type, depth, node.prototype[key], description);
          }

          indent--;

        }
        else {
          addStrData(node.toString());
        }

      break;
      case 'array':

        meta.push({
          description: itemPrefix + '▸ \033[36mArray[\033[0m' + node.length + '\033[36m]\033[0m',
          expanded: false,
          displayed: first,
          type: type,
          depth: depth,
          node: node,
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
          description: itemPrefix + '▸ \033[36mObject\033[0m',
          expanded: false,
          displayed: first,
          type: type,
          depth: depth,
          node: node,
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

  var renderMeta = function renderMeta () {

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

  var toggle = function toggle (index) {

    var start = selection;
    var stop = meta.length;
    var next = meta[index].depth+1;
    var started = false;
    var toggledCount = 0;

    if (meta[index].type === 'string' && 
      (meta[index].description.indexOf('▸') === -1 && 
      meta[index].description.indexOf('▾') === -1)) {
      return;
    }

    if (meta[index].expanded) {

      meta[index].description = meta[index].description.replace('▾', '▸');
      meta[index].expanded = false;

      for (var i = index, l = stop; i < l; i++) {

        if (meta[i].depth >= next) {
          meta[i].displayed = false;

          //
          // if anything that was opened below this node shows that it was
          // expanded, change its icon so that it appears collapsed.
          //
          meta[i].description = meta[i].description.replace('▾', '▸');
          meta[i].expanded = false;
          started = true;
          toggledCount++;
        }
        else if (started && meta[i].depth < next) {
          break;
        }
      }

    }
    else {

      meta[index].description = meta[index].description.replace('▸', '▾');
      meta[index].expanded = true;

      for (var i = index, l = stop; i < l; i++) {

        if (meta[i].depth === next) {
          meta[i].displayed = true;
          meta[i].expanded = false;
          started = true;
          toggledCount++;
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
    return toggledCount;
  };

  var listener = function listener (chunk, key) {

    //
    // search mode stuff
    //
    if (chunk === '/' && searchmode === false) {

      searchmode = true;
      searchbuffer = '';

      //
      // show the user a prompt, if they did a search, 
      // include that before the prompt as the default.
      //
      if (lastsearch !== '') {
        stdout.write('(' + lastsearch + ') /');
      }
      else {
        stdout.write('/');
      }
    }
    else if (searchmode === true && typeof key !== 'undefined' && key.name === 'backspace') {
      
      //
      // dont delete more characters than the user has entered.
      //
      if (searchbuffer.length > 0) {

        searchbuffer = searchbuffer.slice(0, -1);
        write('\033[1D \033[1D');
      }
    }
    else if (searchmode === true && typeof key !== 'undefined' && key.name === 'enter') {

      searchmode = false;

      //
      // preserve the old selection in case nothing is found.
      //
      var oldSelection = selection;
      selection = 0;

      //
      // if the user enters nothing, assume we want to repeat the last search.
      //
      if (searchbuffer === '') {
        searchbuffer = lastsearch;
        repeat = true;
      }
      else {
        repeat = false;
      }

      //
      // clear the line
      //
      write('\r\033[K');

      var regexp;
      var found = false;

      //
      // create a regular expression from the input.
      // if its a bad regexp, let the user know nicely.
      //
      try {

        regexp = new RegExp(searchbuffer);
      }
      catch(e) {

        write(e.message + '\r');
        return;
      }

      var l = meta.length;
      var startIndex = meta[selection].index;

      if (repeat) {
        startIndex = lastIndex + 1;
      }

      for (var i = startIndex; i < l; i++) {

        //
        // if there is a match
        //
        if (regexp.test(meta[i].description)) {

          var currentDepth = meta[i].depth;
          var matchedIndex = meta[i].index;

          found = true;
          lastIndex = meta[i].index;

          for (var j = i; j >= 0; j--) {

            if (meta[j].depth < currentDepth) {

              if (meta[j].expanded === false) {
                currentDepth--;
                toggle(j);
              }
            }
          }

          for (var k = 0; k < l; k++) {
            if (meta[k].displayed === true) {
              selection++;
            }
            if (meta[k].index === matchedIndex) {
              break;
            }
          }

          up(displayed);
          renderMeta();
          break;

        }

      }

      if (!found) {

        write('Not found\r');
        selection = oldSelection;
      }

      //
      // save the last search even if its unsuccessful.
      //
      lastsearch = searchbuffer;

      //
      // reset the search buffer
      //
      searchbuffer = '';

      //
      // discontinue listening to keypresses until we're
      // done searching.
      //
      return true;
    }
    else if (searchmode === true && typeof(chunk) !== 'undefined') {

      write(chunk);
      searchbuffer += chunk;
    }

    //
    // exploration mode stuff
    //
    if (key && searchmode === false) {

      var downAction = (key.name === 'tab' && !key.shift) || key.name === 'down' || key.name === 'j';
      var upAction = (key.shift && key.name === 'tab') || key.name === 'up' || key.name === 'k';

      if (downAction && selection < displayed) {

        //
        // get the actual index of the item from the map.
        //
        index = map[selection];

        selection++;
        lastIndex = 0;

        up(displayed);
        renderMeta();
      }

      if (upAction && selection > 1) {

        selection--;
        lastIndex = 0;
        index = map[selection-1];

        up(displayed);
        renderMeta();
      }

      //
      // if this is a toggle.
      //
      if ((key.name === 'space' || key.name === 'enter' || 
            key.name === 'right' || key.name === 'left' || 
            key.name === 'h' || key.name === 'l') &&
          (meta[index].type === 'array' || meta[index].type === 'object' ||
            meta[index].type === 'function' || meta[index].type === 'string')
              && selection <= displayed) {

        index = map[selection-1];
        toggle(index);
      }

      if (key.name === 'q' || (key.ctrl && key.name === 'c')) {

        if (!wasRaw) {
          raw(false);
        }
        if (oldKeypressListeners.length > 0) {
          oldKeypressListeners.forEach(function (l) {
            stdin.on('keypress', l);
          });
          stdin.emit('keypress', '\r', { name: 'enter', ctrl: false, meta: false, shift: false });
          stdin.resume();
        }
        else {
          stdin.pause();
        }
        stdin.removeListener('keypress', listener);
      }

    }
  };

  function raw (mode) {
    var setRawMode = stdin.setRawMode || tty.setRawMode;
    setRawMode.call(stdin, mode);
  }

  stdin.resume();

  var wasRaw;
  if ('isRaw' in stdin) {
    wasRaw = stdin.isRaw
  } else {
    // node < v0.7.7, assume yes, makes running in the repl work
    wasRaw = true
  }
  raw(true);


  // node >= v0.7.7, "keypress" events don't automatically get emitted
  if (rl.emitKeypressEvents) {
    rl.emitKeypressEvents(stdin);
  }

  // grab hold of stdin's "keypress" listeners array
  var keypressListeners = stdin.listeners('keypress');

  // remove any current "keypress" listeners
  var oldKeypressListeners = keypressListeners.splice(0);

  stdin.on('keypress', listener);

  // dont remove any "data" listeners, because one of
  // them is the one that generates the "keypress" events

  process.nextTick(function() {

    up();
    write('\033[K\r');
    write('\033[K\r\n');

    var dobj = JSON.decycle(obj);

    constructMeta(getType(dobj), 0, dobj);
    renderMeta();

  });

};
