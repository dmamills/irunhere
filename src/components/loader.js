"use strict"
const React = require('react');

const Loader = React.createClass({

    render() {
        if(this.props.isLoading) {
            return <span className="loader">Loading...</span>
        } else {
            return false;
        }
    }
});

module.exports = Loader;
