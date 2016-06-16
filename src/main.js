"use strict";
const ReactDOM = require('react-dom');
const React = require('react');

const App = require('./components/App');

let mountEl = document.getElementById('mount');

if(mountEl) {
    console.log('mounting!');
    ReactDOM.render(<App />, mountEl);
}
