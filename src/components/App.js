"use strict";
const React = require('react');
const html2canvas = require('html2canvas');

const Uploader = require('./uploader');
const Heatmap = require('./heat-map');
const UploadedModal = require('./uploaded-modal');
const Theme = require('./theme');
const ThemeSelector = require('./theme-selector');
const HeatmapThemeSelector = require('./heatmap-theme-selector');
const HeatmapControls = require('./heatmap-controls');

const Leaflet = require('leaflet');
const Map = require('react-leaflet').Map;
const TileLayer = require('react-leaflet').TileLayer;
const HeatmapLayer = require('react-leaflet-heatmap-layer').default;

const api = require('../services/api-service.js');
const initalTheme = require('../themes.json').themes[0];
const heatmapTheme = require('../heatmap-themes').themes[1];

const App = React.createClass({
    getInitialState() {
        return {
            hasUploaded: false,
            points: [],
            img_url: '',
            heatmap_settings: { zoom: 14, opacity: 1, radius: 15 },
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
    _mapZoom(e) {
        let zoom = e.target._zoom;
        let state = this.state;
        this.state.heatmap_settings.zoom = zoom;
        this.setState(state);
    },
    render() {

        let zoomLevel = parseInt(this.state.heatmap_settings.zoom);
        let heatmapRadius = parseInt(this.state.heatmap_settings.radius);
        let opacity = parseInt(this.state.heatmap_settings.opacity);
        let position = {
            'lat': 44.4643,
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
                    <ThemeSelector onSelect={this._updateTheme('theme')}/>
                    <HeatmapThemeSelector onSelect={this._updateTheme('heatmap_theme')}/>
                    <HeatmapControls heatmapSettings={this.state.heatmap_settings} onUpdates={this._updateState('heatmap_settings')} capture={this._capture}/>
                </div>
                <div className="preview-container" ref="content">
                    <Map
                        animate={true}
                        center={position}
                        zoom={zoomLevel}
                        longitudeExtractor={m => m.lng}
                        latitudeExtractor={m => m.lat}
                        onZoomend={this._mapZoom}
                    >
                        <HeatmapLayer
                            points={this.state.points} 
                            radius={heatmapRadius}
                            longitudeExtractor={m => m.lng}
                            latitudeExtractor={m => m.lat}
                            intensityExtractor={m => parseFloat(m.lng)}
                        />
                        <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' />
                    </Map>
                </div>
            </div>
        );
    }
});

module.exports = App;
