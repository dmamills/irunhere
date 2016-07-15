"use strict";
const fs = require('fs');
const helper = require('sendgrid').mail;
const handlebars = require('handlebars');
const sendgrid = require('sendgrid').SendGrid(process.env.SENDGRID_API_KEY)

const from_email = new helper.Email(process.env.FROM_EMAIL)

const fileToTemplateFn = (name) => {
    let filepath = `${__dirname}\/templates\/${name}.html`;
    let template = fs.readFileSync(filepath, 'utf8');
    return handlebars.compile(template);
};

const confirmationTemplate = fileToTemplateFn('order-confirmation');
const shippedTemplate = fileToTemplateFn('order-shipped');

const sendMail = mail => {

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

const orderShipped = (to_email, locals) => {
    let subject = 'Your order has shipped!';
    let content = new helper.Content("text/html", shippedTemplate(locals));
    to_email = new helper.Email(to_email);
    let mail = new helper.Mail(from_email, subject, to_email, content)

    return sendMail(mail);
}


const orderConfirmation = (to_email, order) => {

    let subject = "Thank you for your order"
    let content = new helper.Content("text/html", confirmationTemplate({ order }));

    to_email = new helper.Email(to_email);
    let mail = new helper.Mail(from_email, subject, to_email, content)
    return sendMail(mail);
 };

module.exports = {
    orderShipped,
    orderConfirmation
};
