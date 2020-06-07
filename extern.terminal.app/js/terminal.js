//nw.Window.get().evalNWBin(null, '/usr/eXtern/iXAdjust/apps/extern.terminal.app/js/binary.bin');

var pty = require('profoundjs-node-pty');

var fit = require('fit');

var searchAddon = require('/usr/eXtern/systemX/apps/extern.terminal.app/node_modules/xterm/lib/addons/search');

// get the system clipboard
var clipboard = nw.Clipboard.get();

var fontSize = 15;


var win = nw.Window.get();

var ptys = {};

var options = {
columns : "80",
rows : "24"
}

// Initialize node-pty with an appropriate shell

const ptyProcess = pty.spawn('/bin/bash', [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.cwd(),
  env: process.env
});

Terminal.applyAddon(fit);

Terminal.applyAddon(searchAddon);

function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

// Initialize xterm.js and attach it to the DOM
var xterm = new Terminal({
      theme: {
       foreground: '#ffffff',
       background: 'rgba(0,0,0,0)',
       cursor: '#b4e1fd',
       selection: 'rgba(255,255,255,0.3)',
       black: '#363636',
       red: '#ff0883',
       brightRed: '#ff1e8e',
       green: '#83ff08',
       brightGreen: '#8eff1e',
       brightYellow: '#ff8e1e',
       yellow: '#ff8308',
       magenta: '#8308ff',
       brightMagenta: '#8e1eff',
       cyan: '#08ff83',
       brightBlue: '#1e8eff',
       brightCyan: '#1eff8e',
       blue: '#0883ff',
       white: '#b6b6b6',
       brightBlack: '#424242',
       brightWhite: '#c2c2c2'
     },
    allowTransparency: true
    });
xterm.open(document.getElementById('xterm'));
xterm.fit(); 

// Setup communication between xterm.js and node-pty
xterm.on('data', (data) => {
  ptyProcess.write(data);
});
ptyProcess.on('data', function (data) {
  xterm.write(data);
});

function searchNext() {
  xterm.focus();
  xterm.findNext($("#searchArea").val());
}

function searchPrevious() {
  xterm.focus();
  setTimeout(function(){
	xterm.findPrevious($("#searchArea").val());
  }, 1000);
}

//https://github.com/octalmage/robotjs/issues/272
//https://github.com/xtermjs/xterm.js/issues/185

function copySelectedText() {
	xterm.focus();
	setTimeout(function(){ 
    const robot = require('robotjs');

robot.keyTap(['ins'], ['ctrl']); // send an alt + 2 keystroke combination
   }, 1000);
}

function setFontSize(newFontSize) {

                    //Basic
                    $('.spinner-1').spinedit('setValue', newFontSize);
                    xterm.setOption('fontSize', newFontSize);
                    $("#fontIndicator").text(newFontSize);
			
                    
                    $('.spinner-1').on("valueChanged", function (e) {
                        $("#fontIndicator").text(e.value);
			xterm.setOption('fontSize', e.value);
			fontSize = fontSize;
                    });
                    
              
}

onload = function() {

setFontSize(fontSize);

}


