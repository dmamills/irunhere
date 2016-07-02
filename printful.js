"use strict";
const request = require('superagent');

const PRINTFUL_AUTH = `Basic ${new Buffer(process.env.PRINTFUL_API_KEY).toString('base64')}`;
const BASE_URL = 'https://api.theprintful.com';

const PRODUCT_TYPES = {
    'poster': 1,
    'framed': 2
};

const getProductId = (type, dimensions) => {
    return new Promise((resolve, reject) => {
        request(`${BASE_URL}/products/${PRODUCT_TYPES[type]}`)
        .set('Authorization', PRINTFUL_AUTH)
        .end((err, apiRes) => {
            let variants = apiRes.body.result.variants;
            let product = variants.find(v => v.size === dimensions);
            resolve(product);
        });
    });
};

const getCountries = () => {
    return new Promise((resolve, reject) => {
        request(`${BASE_URL}/countries`)
        .set('Authorization', PRINTFUL_AUTH)
        .end((err, apiRes) => {
            if(err) reject(err);
            else resolve(apiRes.body.result);
        });
    });
}

const getShippingRates = (info) => {
    return new Promise((resolve, reject) => {
        request.post(`${BASE_URL}/shipping/rates`)
        .set('Authorization', PRINTFUL_AUTH)
        .send(info)
        .end((err, apiRes) => {
            if(err) reject(err);
            else resolve(apiRes.body);
        });
    });
}

module.exports = {
    getProductId,
    getCountries,
    getShippingRates,
    getProductId
}
