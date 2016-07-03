"use strict";
const React = require('react');
const Modal = require('react-modal');

const Loader = require('./loader');
const api = require('../services/api-service');

const UploadedModal = React.createClass({

    getInitialState() {
        return {
            isLoading: false,
            countries: [],
            product: false,
            shipping_estimates: null
        }
    },
    componentDidMount() {

        api.getProduct('poster', '12x16').then(product => {
            let state = this.state;
            state.product = product;
            this.setState(state);
        });

        api.getCountries().then(countries => {
            let state = this.state;
            state.countries = countries;
            this.setState(state);
        }, err => {
            console.log(err);
        });
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

        let state = this.state;
        state.isLoading = true;
        this.setState(state);

        api.shippingEstimate(settings).then(res => {
            state.isLoading = false;
            state.shipping_estimates = res.body.result;
            this.setState(state);
        });
    },
    _submitOrder() {

        let settings = {
            style: this.refs.style.value,
            dimensions: this.refs.dimensions.value,
            first_name: this.refs.first_name.value,
            last_name: this.refs.last_name.value,
            address: this.refs.address1.value,
            city: this.refs.city.value,
            state: this.refs.state.value,
            zip: this.refs.zip.value,
            country: this.refs.country.value,
            img_url: this.props.url,
            email: this.refs.email.value,
            shipping_method: this.refs.shipping_method.value,
            product_id: this.state.product.id
        };

        api.submitOrder(settings).then(info => {
            debugger;
        });
    },
    _getProduct(e) {
        let settings = {
            style: this.refs.style.value,
            dimensions: this.refs.dimensions.value
        };
        console.log(settings);

        api.getProduct(settings.style, settings.dimensions).then(product => {
            let state = this.state;
            state.product = product;
            this.setState(state);
        });
    },
    _countrySelect(e) {
        let state = this.state;
        let code = e.target.value;
        state.selectedCountry = state.countries.find(c => c.code === code);
        this.setState(state);
    },
    render() {
        if(!this.props.show) return false;

        let shipping_estimates = false;
        if(this.state.shipping_estimates) {
            shipping_estimates = (
                <div className="shipping-selection">
                    <h5>Shipping Method</h5>
                    <select ref="shipping_method">
                        {this.state.shipping_estimates.map(s => <option key={s.id} value={s.id}> {s.name} - ${s.rate}</option>)};
                    </select>
                </div>
            );
        }

        let shippingBtn = (<button onClick={this._getShippingEstimate}>Get Shipping Estimate</button>);

        if(this.state.shipping_estimates) {
            shippingBtn = (<button onClick={this._submitOrder}>Submit Order</button>);
        }

        let states = false;
        if(this.state.selectedCountry && this.state.selectedCountry.states) {
            states = (
                <div>
                    <label for="state">State/Province</label>
                    <select ref="state" id="state">
                        {this.state.selectedCountry.states.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                    </select>
                </div>
            );
        }

        let product = false;
        if(this.state.product) {
            product = (<div>
                <div>
                    <h3>Selected Product</h3>
                    <strong>{this.state.product.name}</strong> - <span>${this.state.product.price}</span>
                </div>

                <img width="25%" height="25%" src={this.state.product.image}/>
            </div>);
        }

        return (
            <Modal isOpen={true}>
                <h1>Order</h1>
                <div className="flex">
                    <div>
                        <img width="50%" height="50%" src={this.props.url} />
                        {product}
                    </div>
                    <div>
                        <h5>Customer Info</h5>
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
                        <h5>Shipping Info</h5>
                        <div>
                            <label for="address1">Address</label>
                            <input type="text" ref="address1" id="address1"/>
                        </div>
                        <div>
                            <label for="city">City</label>
                            <input type="text" ref="city" id="city"/>
                        </div>
                        <div>
                            <label for="country">Country</label>
                            <select ref="country" id="country" onChange={this._countrySelect}>
                                {this.state.countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            {states}
                        </div>
                        <div>
                            <label for="zip">Zip/Postal Code</label>
                            <input type="text" ref="zip" id="zip"/>
                        </div>
                        <h5>Product Info</h5>
                        <div>
                            <label for="style">Style</label>
                            <select ref="style" id="style" onChange={this._getProduct}>
                                <option value="poster">Poster</option>
                                <option value="framed">Framed Poster</option>
                            </select>
                        </div>
                        <div>
                            <label for="dimensions">Dimensions</label>
                            <select ref="dimensions" id="dimensions" onChange={this._getProduct}>
                                <option value="12x16">12x16</option>
                                <option value="16x20">16x20</option>
                                <option value="24x36">24x36</option>
                            </select>
                        </div>
                        <div>
                            <Loader isLoading={this.state.isLoading}/>
                            {shipping_estimates}
                            {shippingBtn}
                            <button onClick={this.props.closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
});

module.exports = UploadedModal;
