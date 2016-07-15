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
            console.log(info);
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

        let closeFn = () => {
            this.props.closeModal(false);
        }

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
                <div className="img-container">
                    <img className="scaled-image-cover" src={this.state.product.image}/>
               </div> 
            </div>);
        }

        return (
            <Modal isOpen={true}>
                <h1>Order</h1>
                <div className="flex">
                    <div className="img-preview-container">
                        <div>
                            <img className="scaled-image-cover" src={this.props.url}/>
                        </div> 
                        {product}
                        <h5>Product Info</h5>
                        <div>
                            <label htmlFor="style">Style</label>
                            <select name="style" ref="style" id="style" onChange={this._getProduct}>
                                <option value="poster">Poster</option>
                                <option value="framed">Framed Poster</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="dimensions">Dimensions</label>
                            <select name="dimensions" ref="dimensions" id="dimensions" onChange={this._getProduct}>
                                <option value="12x16">12x16</option>
                                <option value="16x20">16x20</option>
                                <option value="24x36">24x36</option>
                            </select>
                        </div>
                    </div>
                    <div className="order-info">
                        <h5>Customer Info</h5>
                        <div className="flex flex-column">
                            <label htmlFor="first_name">First Name</label>
                            <input name="first_name" type="text" ref="first_name" id="first_name"/>
                        </div>
                        <div className="flex flex-column">
                            <label htmlFor="last_name">Last Name</label>
                            <input name="last_name" type="text" ref="last_name" id="last_name"/>
                        </div>
                        <div className="flex flex-column">
                            <label htmlFor="email">Email</label>
                            <input name="email" type="text" ref="email" id="email"/>
                        </div>
                        <h5>Shipping Info</h5>
                        <div className="flex flex-column">
                            <label htmlFor="address1">Address</label>
                            <input name="address1" type="text" ref="address1" id="address1"/>
                        </div>
                        <div className="flex flex-column">
                            <label htmlFor="city">City</label>
                            <input name="city" type="text" ref="city" id="city"/>
                        </div>
                        <div className="flex flex-column">
                            <label htmlFor="country">Country</label>
                            <select name="country" ref="country" id="country" onChange={this._countrySelect}>
                                {this.state.countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            {states}
                        </div>
                        <div className="flex flex-column">
                            <label htmlFor="zip">Zip/Postal Code</label>
                            <input name="zip" type="text" ref="zip" id="zip"/>
                        </div>

                        <div className="flex flex-row">
                            <Loader isLoading={this.state.isLoading}/>
                            {shipping_estimates}
                            {shippingBtn}
                            <button onClick={closeFn}>Close</button>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
});

module.exports = UploadedModal;
