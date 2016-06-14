"use strict";
const ReactDOM = require('react-dom');
const React = require('react');
const html2canvas = require('html2canvas');

const Uploader = require('./components/uploader');
const Heatmap = require('./components/heat-map');
const Map = require('google-maps-react').Map;

const App = React.createClass({
    getInitialState() {
        return {
            hasUploaded: false,
            points: []
        };
    },
    _capture() {
        html2canvas(this.refs.content).then(canvas => {
            debugger;
        });

    },
    _onUpload(points) {

        this.setState({
            points
        });
    },
    componentDidMount() {
    },
    render() {

        let position = {
            'lat': 43.4643,
            'lng': -80.5204
        };

        return (
            <div>
                <div className="control-pane">
                    <Uploader onUpload={this._onUpload}/>
                    <div className="heatmap-settings">
                        <button onClick={this._capture}>Click</button>
                    </div>
                </div>
                <div ref="content">
                    <Map google={window.google} initialCenter={position}>
                        <Heatmap points={this.state.points}/>
                    </Map>
                </div>
            </div>
        );
    }
});

let mountEl = document.getElementById('mount');

if(mountEl) {
    console.log('mounting!');
    ReactDOM.render(<App />, mountEl);
}
