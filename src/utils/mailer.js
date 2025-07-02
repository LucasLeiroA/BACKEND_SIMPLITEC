const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const sendLeadEmail = async (to, subject, html) => {
    await transporter.sendMail({
        from: `"SimpliTEC Leads" <${process.env.MAIL_USER}>`,
        to,
        subject,
        html
    });
};

module.exports = { sendLeadEmail };
