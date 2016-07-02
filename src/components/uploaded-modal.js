"use strict";
const React = require('react');
const Modal = require('react-modal');

const api = require('../services/api-service');

const UploadedModal = React.createClass({

    getInitialState() {
        hasShipping: false,
    },
    _getShippingEstimate() {
        let settings = {
            style: this.refs.style.value,
            dimensions: this.refs.dimensions.value,
            first_name: this.refs.first_name.value,
            last_name: this.refs.last_name.value,
            address: this.refs.address1.value,
            state: this.refs.state.value,
            zip: this.refs.zip.value,
            country: this.refs.country.value,
            img_url: this.props.url,
            email: this.refs.email.value
        };

       console.log(settings);

       api.shippingEstimate(settings).then(res => {
            console.log(res.body);
        });
    },
    render() {
        if(!this.props.show) return false;

        return (
            <Modal isOpen={true}>
                <h1>Order Settings</h1>
                <img width="50%" height="50%" src={this.props.url} />
                <div>
                    <label for="first_name">First Name</label>
                    <input type="text" ref="first_name" id="first_name"/>
                </div>
                <div>
                    <label for="last_name">Last Name</label>
                    <input type="text" ref="last_name" id="last_name"/>
                </div>
                <div>
                    <label for="email">Email</label>
                    <input type="text" ref="email" id="email"/>
                </div>
                <div>
                    <label for="address1">Address</label>
                    <input type="text" ref="address1" id="address1"/>
                </div>
                <div>
                    <label for="city">City</label>
                    <input type="text" ref="city" id="city"/>
                </div>
                <div>
                    <label for="state">State</label>
                    <input type="text" ref="state" id="state"/>
                </div>
                <div>
                    <label for="country">Country</label>
                    <input type="text" ref="country" id="country"/>
                </div>
                <div>
                    <label for="zip">zip</label>
                    <input type="text" ref="zip" id="zip"/>
                </div>
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
                    <button onClick={this._getShippingEstimate}>Save</button>
                    <button onClick={this.props.closeModal}>Close</button>
                </div>
            </Modal>
        );
    }
});

module.exports = UploadedModal;
