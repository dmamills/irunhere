"use strict";
const React = require('react');
const Modal = require('react-modal');

const ProductSelection = require('./product-selection');
const OrderInfo = require('./order-info');
const api = require('../services/api-service');

const UploadedModal = React.createClass({

    getInitialState() {
        return {
            isLoading: false,
            countries: [],
            product: false,
            shipping_estimates: null,
            productSelected: false
        }
    },
    _productSelected(product) {
        let state = this.state;
        state.productSelected = true;
        state.product = product;
        this.setState(state);
    },
    render() {
        if(!this.props.show) return false;

        let closeFn = () => {
            this.props.closeModal(false);
        }

        if(!this.state.productSelected) {
            return (
                <Modal isOpen={true}>
                    <ProductSelection onProductSelected={this._productSelected}/>
                </Modal>
            );
        } else {
            return (
                <Modal isOpen={true}>
                    <OrderInfo url={this.props.url} product={this.state.product}/>
                </Modal>
            );
        }
    }
});

module.exports = UploadedModal;
