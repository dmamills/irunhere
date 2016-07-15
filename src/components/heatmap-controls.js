"use strict";

const React = require('react');
const _ = require('lodash');

const HeatmapControls = React.createClass({

    componentDidMount() {
        window.applyButtons();
    },
    getInitialState() {
        return {
            radius: 15,
            opacity: 1,
            zoom: 14,
            updateFn: _.debounce(this.props.onUpdates, 500)
        };
    },
    _onChange(type) {
        return (e) => {
            let state = this.state;
            state[type] = e.target.value;
            this.setState(state);
            this.state.updateFn(state);
        }
    },
    render() {

        let opacity = `${Math.floor(this.state.opacity * 100)}%`;
        return (
            <div className="widget heatmap-controls">
                <h4>Heatmap controls</h4>
                <div>
                    <input name="zoom" type="range" min="1" max="22" step="1" value={this.state.zoom} onChange={this._onChange('zoom')}/>
                    <label for="opacity">Zoom {this.state.zoom}</label>
                </div>
                <div>
                    <input name="radius" type="range" min="1" max="30" value={this.state.radius} onChange={this._onChange('radius')}/>
                    <label for="radius">Radius {this.state.radius}</label>
                </div>
                <div>
                    <input name="opacity" type="range" min="0" max="1" step="0.01" value={this.state.opacity} onChange={this._onChange('opacity')}/>
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
