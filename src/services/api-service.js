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

const submitOrder = (data) => {

};

module.exports = {
    uploadCanvas,
    submitOrder
};
