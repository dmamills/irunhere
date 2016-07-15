"use strict";
const ReactDOM = require('react-dom');
const React = require('react');
const PaperRipple = require('paper-ripple');

const App = require('./components/App');

window.applyButtons = () => {

    var buttons = document.querySelectorAll('button.paper-button');
     
    [].forEach.call(buttons, function(button) {
        var ripple = new PaperRipple();
        button.appendChild(ripple.$);
        button.addEventListener('mousedown', function(ev) {
            ripple.downAction(ev);
        });
        button.addEventListener('mouseup', function() {
        ripple.upAction();
        });
    });
}


let mountEl = document.getElementById('mount');

if(mountEl) {
    console.log('mounting!');
    ReactDOM.render(<App />, mountEl);
}
