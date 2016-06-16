const React = require('react');

const Theme = React.createClass({
    componentWillReceiveProps(props) {
        props.map.setOptions({styles: props.theme});
    },
    render() {
        return null;

    }
});

module.exports = Theme;
