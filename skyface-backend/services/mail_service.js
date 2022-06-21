const nodemailer = require("nodemailer");
const UserModel = require("../models/user_model");
var transporter = null;
if (
  process.env.SMTP_HOST &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASSWORD
) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
} else {
  console.log("No SMTP credentials found");
}

let MailService = {
  sendMail: async (req, title, message) => {
    if (!transporter) {
      console.log("No mailer configured");
      return;
    }
    let info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_RECEIVER,
      subject: title,
      text: message,
      html: message,
    });
    console.log("Message sent: %s", info.messageId);
  },
};

module.exports = MailService;
