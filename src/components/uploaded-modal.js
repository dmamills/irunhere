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
    _closeModal() {
        this._unsetProduct();
        this.props.closeModal(false);
    },
    _productSelected(product) {
        let state = this.state;
        state.productSelected = true;
        state.product = product;
        this.setState(state);
    },
    _unsetProduct() {
        let state = this.state;
        state.productSelected = false;
        state.product = null;
        this.setState(state);

    },
    render() {
        if(!this.props.show) return false;

        if(!this.state.productSelected) {
            return (
                <Modal isOpen={true}>
                    <ProductSelection closeFn={this._closeModal} onProductSelected={this._productSelected}/>
                </Modal>
            );
        } else {
            return (
                <Modal isOpen={true}>
                    <OrderInfo closeFn={this._closeModal}  unsetProduct={this._unsetProduct} url={this.props.url} product={this.state.product}/>
                </Modal>
            );
        }
    }
});

module.exports = UploadedModal;
