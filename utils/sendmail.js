const nodemailer = require("nodemailer");
const sendmail = async (options) => {
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: process.env.SMPT_SERVICE,
    port: 465,
    secure: true, 
    secureconnection:false,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  const mailoption = {
    to: options.email,
    from: process.env.SMPT_MAIL,
    subject: options.subject,
    text: options.message,
  };
  await transport.sendMail(mailoption);
};
module.exports = sendmail;
