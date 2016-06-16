"use strict";

const React = require('react');

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
            map: map
        });

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
