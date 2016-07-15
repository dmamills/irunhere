"use strict";
const React = require('react');
const Select = require('react-select');
const themes = require('../heatmap-themes.json').themes;

const HeatmapThemeSelector = React.createClass({

    getInitialState() {
        return {
            themes,
            selected: 0
        }
    },
    _select(i) {
        let state = this.state;
        state.selected = i;
        this.props.onSelect(state.themes[i]);
        this.setState(state);
    },
    render() {

        let themes = this.state.themes.map((t, i) => {
            return { value: i, label: t.name }
        });

        return (
            <div className="widget theme-selector">
                <h4>Heatmap Themes</h4>
                <Select
                    value={themes[this.state.selected]}
                    options={themes}
                    autoBlur={true}
                    searchable={false}
                    onChange={this._select}
                />
            </div>
        );
    }
});

module.exports = HeatmapThemeSelector;
