"use strict";
const React = require('react');
const Select = require('react-select');
const themes = require('../themes.json').themes;

const ThemeSelector = React.createClass({

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
            t.id = i;
            return t;
        });

        let optionRender = (t) => {
            let style = {
                'marginLeft': '.5rem'
            };

            return (<div className="flex flex-vert-center">
                <img src="http://placehold.it/40x40"/>
                <strong style={style}>{t.name}</strong>
            </div>);
        }

        return (
            <div className="widget theme-selector">
                <h4>Map Themes</h4>
                <Select
                    value={themes[this.state.selected].name}
                    clearable={false}
                    valueKey={'id'}
                    options={themes}
                    autoBlur={true}
                    searchable={false}
                    optionRenderer={optionRender}
                    onChange={this._select}
                />
            </div>
        );
    }
});

module.exports = ThemeSelector;
