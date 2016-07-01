"use strict";
const React = require('react');
const Modal = require('react-modal');


const UploadedModal = React.createClass({

    _closeModal() {
        let settings = {
            style: this.refs.style.value,
            dimensions: this.refs.dimensions.value
        };
        console.log(settings);

    },
    render() {
        if(!this.props.show) return false;

        return (
            <Modal isOpen={true}>
                <h1>Order Settings</h1>
                <img width="50%" height="50%" src={this.props.url} />
                <div>
                    <label for="style">Style</label>
                    <select ref="style" id="style">
                        <option value="poster">Poster</option>
                        <option value="framed">Framed Poster</option>
                    </select>
                </div>
                <div>
                    <label for="dimensions">Dimensions</label>
                    <select ref="dimensions" id="dimensions">
                        <option value="12x16">12x16</option>
                        <option value="16x20">16x20</option>
                        <option value="24x36">24x36</option>
                    </select>
                </div>
                <div>
                    <button onClick={this._closeModal}>Save</button>
                </div>
            </Modal>
        );
    }
});

module.exports = UploadedModal;
