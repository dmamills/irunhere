"use strict"
const React = require('react');
const Select = require('react-select');
const api = require('../services/api-service');
const _ = require('lodash');

const ProductSelection = React.createClass({
    getInitialState() {
        return {
            product: false,
            style: 'poster',
            size: '12x16',
            styles: [
                'poster',
                'framed'
            ],
            sizes: [
                '12x16',
                '16x20',
                '24x36'
            ]
        };
    },
    componentDidMount() {
        let state = this.state;
        api.getProduct(state.style, state.size).then(product => {
            let state = this.state;
            state.product = product;
            this.setState(state);
        });
    },
    _selectProduct() {
        this.props.onProductSelected(this.state.product);
    },
    _updateHandler(prop) {
        return value => {
            let state = this.state;
            state[prop] = value;
            this.setState(state);
            this._getProduct();
        };
    },
    _getProduct() {
        let settings = {
            style: this.state.style,
            dimensions: this.state.size
        };

        api.getProduct(settings.style, settings.dimensions).then(product => {
            let state = this.state;
            state.product = product;
            this.setState(state);
        });
    },
    render() {
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

        let styles = this.state.styles.map(s => {
            return {
                value: s,
                label: _.capitalize(s)
            };
        });

        let sizes = this.state.sizes.map(s => {
            return {
                value: s,
                label: s
            };
        });

        let updateStyleFn = this._updateHandler('style');
        let updateSizeFn = this._updateHandler('size');

        return (
            <div className="product-selection">
                <button className="btn paper-button" onClick={this.props.closeFn}>Close</button>
                <h3>Looks good!</h3>
                <p>Now let's select the type of product you'd like to have your accomplishments printed on!</p>
                {product}
                <div>
                    <label htmlFor="style">Style</label>
                    <Select
                        name="style"
                        clearable={false}
                        value={this.state.style}
                        searchable={false}
                        options={styles}
                        onChange={updateStyleFn}
                    />
                </div>
                <div>
                    <label htmlFor="size">Dimensions</label>
                    <Select
                        name="size"
                        clearable={false}
                        searchable={false}
                        value={this.state.size}
                        options={sizes}
                        onChange={updateSizeFn}
                    />
                </div>
                    <button className="btn paper-button" onClick={this._selectProduct}>Select Product</button>
            </div>
        )
    }
});

module.exports = ProductSelection;
