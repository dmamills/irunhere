"use strict";

const React = require('react');
const _ = require('lodash');

const Heatmap = React.createClass({

    getInitialState() {
        return {
            heatmap: null
        };
    },
    componentWillReceiveProps(props) {
        if(props.points.length !== this.props.points.length) {
            this._updateHeatmap(props.points);
        }

        if(!_.isEqual(props.theme, this.props.theme)) {
            this._updateGradient(props.theme);
        }

        if(!_.isEqual(props.settings, this.props.settings)) {
            this._updateSettings(props.settings);
        }

    },
    _updateSettings(settings) {

        let heatmap = this.state.heatmap;
        if(!heatmap) return;

        for(let k in settings) {
            heatmap.set(k, settings[k]);
        }
    },
    _updateGradient(gradient) {

        let heatmap = this.state.heatmap;

        //TODO: Make this RIP
        if(!heatmap) {
            setTimeout(_ => {
                this._updateGradient(gradient);
            });
            return;
        }

        heatmap.set('gradient', gradient);
    },
    _updateHeatmap(points) {
        let map = this.props.map;
        let heatmap = this.state.heatmap;

        points = points.map(p => { return new google.maps.LatLng(p.lat, p.lng); });

        if(heatmap) {
            heatmap.setMap(null);
        }

        heatmap = new google.maps.visualization.HeatmapLayer({
            data: points,
            map: map,
            gradient: this.props.theme
        });

        this._updateSettings(this.props.settings);

        let bounds = points.reduce((bounds, point) => {
            bounds.extend(point);
            return bounds;
        },  new google.maps.LatLngBounds());

        map.fitBounds(bounds);
        this.setState({ heatmap });
    },
    render() {
        return null;
    }
});

module.exports = Heatmap;
