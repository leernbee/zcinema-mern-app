// EmailService.js
const nodemailer = require("nodemailer");

require("dotenv").config();

const mailgunTransport = require("nodemailer-mailgun-transport");
// Configure transport options
const mailgunOptions = {
  auth: {
    api_key: process.env.api_key,
    domain: process.env.domain
  }
};

const transport = mailgunTransport(mailgunOptions);

// EmailService
class EmailService {
  constructor() {
    this.emailClient = nodemailer.createTransport(transport);
  }

  sendText(to, subject, html) {
    return new Promise((resolve, reject) => {
      this.emailClient.sendMail(
        {
          from: '"ZCinema" <no-reply@zcinema.com>',
          to,
          subject,
          html
        },
        (err, info) => {
          if (err) {
            reject(err);
          } else {
            resolve(info);
          }
        }
      );
    });
  }
}

module.exports = new EmailService();
