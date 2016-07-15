"use strict";
const React = require('react');
const html2canvas = require('html2canvas');
const api = require('../services/api-service.js');

const Uploader = require('./uploader');
const Heatmap = require('./heat-map');
const UploadedModal = require('./uploaded-modal');
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
            img_url: '',
            heatmap_settings: { intensity: 15 },
            heatmap_theme: heatmapTheme.settings,
            theme: initalTheme.settings
        };
    },
    _capture() {
        //TODO: refactor out and scale canvas to printable size
        html2canvas(this.refs.content.firstChild, {
            proxy: '/convert',
            logging: true,
            taintTest: true
        }).then(canvas => {
            let data = canvas.toDataURL().split('data:image/png;base64,')[1];
            api.uploadCanvas(data).then(res => {
                this._updateState('hasUploaded')(true);
                this._updateState('img_url')(res.body.url);
            });
        });

    },
    _updateState(prop) {
        return value => {
            let state = this.state;
            state[prop] = value;
            this.setState(state);
        }
    },
    _updateTheme(prop) {
        return theme => {
            let state = this.state;
            state[prop] = theme.settings;
            this.setState(state);
        }
    },
    render() {
        let position = {
            'lat': 43.4643,
            'lng': -80.5204
        };

        return (
            <div className="app-container">
                <UploadedModal show={this.state.hasUploaded} url={this.state.img_url} closeModal={this._updateState('hasUploaded')}/>
                <div className="control-pane">

                    <div className="widget brand">
                        <h1>I RUN HERE</h1>
                    </div>

                    <Uploader onUpload={this._updateState('points')}/>
                    <ThemeSelector onSelect={this._updateTheme('theme')} />
                    <HeatmapThemeSelector onSelect={this._updateTheme('heatmap_theme')} />
                    <HeatmapControls onUpdates={this._updateState('heatmap_settings')} capture={this._capture}/>

                </div>
                <div className="preview-container" ref="content">
                    <Map google={window.google} initialCenter={position} zoom={this.state.heatmap_settings.zoom}>
                        <Heatmap theme={this.state.heatmap_theme} points={this.state.points} settings={this.state.heatmap_settings}/>
                        <Theme theme={this.state.theme}/>
                    </Map>
                </div>
            </div>
        );
    }
});

module.exports = App;
