const React = require('react');

const Theme = React.createClass({
    componentWillReceiveProps(props) {
        props.map.setOptions({styles: props.theme, disableDefaultUI: true});
    },
    render() {
        return null;

    }
});

module.exports = Theme;
