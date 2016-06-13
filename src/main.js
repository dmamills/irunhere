"use strict";
const ReactDOM = require('react-dom');
const React = require('react');
const request = require('superagent');

const App = React.createClass({

    _upload(e) {

        //upload runs
        e.preventDefault();

        request.post('/runs')
        .send(new FormData(this.refs.runs))
        .end((err, res) => {
            this.refs.output.innerHTML = JSON.stringify(res.body);
        });
    },
    componentDidMount() {

    },
    render() {
        return (
            <div>
                <form ref="runs">
                <input name="runs" type="file" multiple ref="files"/>
                <button onClick={this._upload}>Click</button>
                </form>
                <div ref="output"></div>
            </div>
        );
    }
});

let mountEl = document.getElementById('mount');

if(mountEl) {
    console.log('mounting!');
    ReactDOM.render(<App />, mountEl);
}
