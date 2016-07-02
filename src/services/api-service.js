"use strict";

const request = require('superagent');

const uploadCanvas = (dataUrl) => {
    return new Promise((resolve, reject) => {
        request.post('/save')
        .send({'data': dataUrl})
        .end((err, res) => {
            if(err) reject(err);
            else resolve(res);
        });
    });
};

const getCountries = () => {
    return new Promise((resolve, reject) => {
        request('/countries')
        .end((err, res) => {
            if(err) reject(err);
            else resolve(res.body.countries);
        });
    });
};

const shippingEstimate = (data) => {
    return new Promise((resolve, reject) => {
        request.post('/shipping')
        .send(data)
        .end((err, res) => {
            if(err) reject(err);
            else resolve(res);
        });
    });
}

const submitOrder = (data) => {
    return new Promise((resolve, reject) => {
        request.post('/order')
        .send(data)
        .end((err, res) => {
            if(err) reject(err);
            else resolve(res);
        });
    });
};

module.exports = {
    uploadCanvas,
    shippingEstimate,
    submitOrder,
    getCountries
};
