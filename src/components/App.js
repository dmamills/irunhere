"use strict";
const React = require('react');
const html2canvas = require('html2canvas');
const request = require('superagent');

const Uploader = require('./uploader');
const Heatmap = require('./heat-map');
const Theme = require('./theme');
const ThemeSelector = require('./theme-selector');
const HeatmapThemeSelector = require('./heatmap-theme-selector');
const HeatmapControls = require('./heatmap-controls');
const Map = require('google-maps-react').Map;

const initalTheme = require('../themes.json').themes[0];
const heatmapTheme = require('../heatmap-themes').themes[1];

const App = React.createClass({
    getInitialState() {
        return {
            hasUploaded: false,
            points: [],
            heatmap_settings: { intensity: 15 },
            heatmap_theme: heatmapTheme.settings,
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
        let state = this.state;
        state.points = points;
        this.setState(state);
    },
    _heatmapThemeChanged(theme) {
        let state = this.state;
        state.heatmap_theme = theme.settings;
        this.setState(state);
    },
    _themeChanged(theme) {
        let state = this.state;
        state.theme = theme.settings;
        this.setState(state);
    },
    _onUpdates(settings) {
        let state = this.state;
        state.heatmap_settings = settings;
        this.setState(settings);
    },
    componentDidMount() {
    },
    render() {

        let position = {
            'lat': 43.4643,
            'lng': -80.5204
        };

        return (
            <div className="app-container">
                <div className="control-pane">
                    <div className="widget brand">
                        <h1>I RUN HERE</h1>
                    </div>
                    <Uploader onUpload={this._onUpload}/>
                    <ThemeSelector onSelect={this._themeChanged} />
                    <HeatmapThemeSelector onSelect={this._heatmapThemeChanged} />
                    <HeatmapControls onUpdates={this._onUpdates} capture={this._capture.bind(this)}/>
                </div>
                <div className="preview-container" ref="content">
                    <Map google={window.google} initialCenter={position}>
                        <Heatmap theme={this.state.heatmap_theme} points={this.state.points} settings={this.state.heatmap_settings}/>
                        <Theme theme={this.state.theme}/>
                    </Map>
                </div>
            </div>
        );
    }
});

module.exports = App;
