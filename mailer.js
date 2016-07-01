"use strict";
const helper = require('sendgrid').mail;
const sendgrid = require('sendgrid').SendGrid(process.env.SENDGRID_API_KEY)

const from_email = new helper.Email("order@irunhere.com")


const orderConfirmation = (to_email) => {

    let subject = "Thank you for your order"
    let content = new helper.Content("text/plain", "blah blah blah")

    to_email = new helper.Email(to_email);
    let mail = new helper.Mail(from_email, subject, to_email, content)
    let requestBody = mail.toJSON();
    let request = sendgrid.emptyRequest();
    request.method = 'POST';
    request.path = '/v3/mail/send';
    request.body = requestBody;

    return new Promise((res, rej) => {
        sendgrid.API(request, function (response) {
            res(response);
        });
    });
};

module.exports = {
    orderConfirmation
};
