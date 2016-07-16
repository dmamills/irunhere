"use strict"
const React = require('react');
const Select = require('react-select');

const Loader = require('./loader');
const api = require('../services/api-service');

const OrderInfo = React.createClass({
    getInitialState() {
        return {
            isLoading: false,
            countries: [],
            shipping_estimates: null
        }
    },
    _countrySelect(e) {
        let state = this.state;
        let code = e.target.value;
        state.selectedCountry = state.countries.find(c => c.code === code);
        this.setState(state);
    },
    _submitOrder() {

        let settings = {
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
            product_id: this.props.product.id
        };

        api.submitOrder(settings).then(info => {
            console.log(info);
        });
    },

    _getShippingEstimate() {

        let settings = {
            product_id: this.props.product.id,
            address: this.refs.address1.value,
            state: this.refs.state.value,
            zip: this.refs.zip.value,
            country: this.refs.country.value,
        };

        let state = this.state;
        state.isLoading = true;
        this.setState(state);

        api.shippingEstimate(settings).then(estimates => {
            state.isLoading = false;
            state.shipping_estimates = estimates;
            this.setState(state);
        });
    },

    componentDidMount() {
        api.getCountries().then(countries => {
            let state = this.state;
            state.countries = countries;
            this.setState(state);
        }, err => {
            console.log(err);
        });
    },
    render() {
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

        let shippingBtn = (<button className="btn paper-button" onClick={this._getShippingEstimate}>Get Shipping Estimate</button>);

        if(this.state.shipping_estimates) {
            shippingBtn = (<button className="btn paper-button" onClick={this._submitOrder}>Submit Order</button>);
        }

        let states = false;
        if(this.state.selectedCountry && this.state.selectedCountry.states) {
            states = this.state.selectedCountry.states.map(s => { return { value: s.code, label: s.name}; });
        }

        return (
                    <div className="order-info">
                        <button className="btn paper-button" onClick={this.props.closeFn}>Close</button>
                        <button className="btn paper-button" onClick={this.props.unsetProduct}>Go Back</button>

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
                           <Select
                               name="state"
                               clearable={false}
                               searchable={false}
                               options={states}
                           />
                        </div>
                        <div className="flex flex-column">
                            <label htmlFor="zip">Zip/Postal Code</label>
                            <input name="zip" type="text" ref="zip" id="zip"/>
                        </div>

                        <div className="flex flex-row">
                            <Loader isLoading={this.state.isLoading}/>
                            {shipping_estimates}
                            <div>
                                {shippingBtn}
                            </div>
                        </div>
                    </div>);
    }
});

module.exports = OrderInfo;
