"use strict";

const React = require('react');
const _ = require('lodash');

const HeatmapControls = React.createClass({

    componentDidMount() {
        window.applyButtons();
    },
    getInitialState() {
        return {
            updateFn: _.throttle(this.props.onUpdates, 500)
        };
    },
    _onChange(type) {
        return (e) => {
            let state = Object.assign(this.props.heatmapSettings);
            state[type] = e.target.value;
            this.state.updateFn(state);
        }
    },
    render() {

        let opacity = `${Math.floor(this.props.heatmapSettings.opacity * 100)}%`;
        return (
            <div className="widget heatmap-controls">
                <h4>Heatmap controls</h4>
                <div>
                    <input name="zoom" type="range" min="1" max="22" step="1" value={this.props.heatmapSettings.zoom} onChange={this._onChange('zoom')}/>
                    <label htmlFor="zoom">Zoom {this.props.heatmapSettings.zoom}</label>
                </div>
                <div>
                    <input name="radius" type="range" min="1" max="30" value={this.props.heatmapSettings.radius} onChange={this._onChange('radius')}/>
                    <label for="radius">Radius {this.props.heatmapSettings.radius}</label>
                </div>
                <div>
                    <input name="opacity" type="range" min="0" max="1" step="0.01" value={this.props.heatmapSettings.opacity} onChange={this._onChange('opacity')}/>
                    <label for="opacity">Opacity {opacity}</label>
                </div>

                <div>
                    <button className="btn paper-button" onClick={this.props.capture}>Save Image</button>
                </div>
            </div>
        );
    }
});

module.exports = HeatmapControls;
