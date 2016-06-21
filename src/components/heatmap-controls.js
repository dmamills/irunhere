"use strict";

const React = require('react');
const _ = require('lodash');

const HeatmapControls = React.createClass({

    getInitialState() {
        return {
            radius: 15,
            opacity: 1,
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
        return (
            <div className="hm-controls-container">
                <h3>Heatmap controls</h3>
                <input name="radius" type="range" min="1" max="30" value={this.state.radius} onChange={this._onChange('radius')}/>
                <label for="radius">Radius {this.state.radius}</label>
                <input name="opacity" type="range" min="0" max="1" step="0.01" value={this.state.opacity} onChange={this._onChange('opacity')}/>
                <label for="opacity">opacity {this.state.opacity}</label>
            </div>
        );
    }
});

module.exports = HeatmapControls;
