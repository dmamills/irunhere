"use strict";
const React = require('react');
const html2canvas = require('html2canvas');
const request = require('superagent');

const Uploader = require('./uploader');
const Heatmap = require('./heat-map');
const Theme = require('./theme');
const ThemeSelector = require('./theme-selector');
const Map = require('google-maps-react').Map;

const initalTheme = require('../themes.json').themes[0];


const App = React.createClass({
    getInitialState() {
        return {
            hasUploaded: false,
            points: [],
            theme: initalTheme.settings
        };
    },
    _capture() {
        html2canvas(this.refs.content.firstChild, {
            proxy: '/convert',
            logging: true,
            taintTest: true
        }).then(canvas => {
            let data = canvas.toDataURL();
            request.post('/save')
            .send({'data': data.split('data:image/png;base64,')[1]})
            .end((err, res) => {
                window.open(res.url);
                console.log('ayy');
            });
        });

    },
    _onUpload(points) {
        this.setState({
            points
        });
    },
    _themeChanged(theme) {
        console.log(theme);
        let state = this.state;
        state.theme = theme.settings;
        this.setState(state);
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
                    <ThemeSelector onSelect={this._themeChanged} />
                    <div className="heatmap-settings">
                        <button onClick={this._capture}>Save Image</button>
                    </div>
                </div>
                <div ref="content">
                    <Map google={window.google} initialCenter={position}>
                        <Heatmap theme={this.state.heatmap_theme} points={this.state.points}/>
                        <Theme theme={this.state.theme}/>
                    </Map>
                </div>
            </div>
        );
    }
});

module.exports = App;