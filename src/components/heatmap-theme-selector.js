"use strict";
const React = require('react');
const themes = require('../heatmap-themes.json').themes;

const HeatmapThemeSelector = React.createClass({

    getInitialState() {
        return {
            themes
        }
    },
    _select(i, e) {
        this.props.onSelect(this.state.themes[i]);
    },
    render() {

        let themes = this.state.themes.map((t, i) => {
            var boundHandler = this._select.bind(this, i);
            return (<li key={t.name}><button onClick={boundHandler}>{t.name}</button></li>)
        });

        return (
            <div className="theme-selector">
                <h4>HM Themes</h4>
                <ul>
                    {themes}
                </ul>
            </div>
        );
    }
});

module.exports = HeatmapThemeSelector;
