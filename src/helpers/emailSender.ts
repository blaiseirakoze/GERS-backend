import dotenv from 'dotenv';
// import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import Handlebars from "handlebars";
const nodemailer = require('nodemailer');

dotenv.config();
const logo = "";
export const sendEmail = async (info: any) => {
  const {
    to,
    subject,
    content,
  } = info

  // Step 1
  let transporter: any = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const jsonPath = path.join(__dirname, '..', 'template', 'email_template.html');  
  const source = fs.readFileSync(jsonPath, 'utf8');
  const template = Handlebars.compile(source);
  const html = template({
    body: content,
    logo,
    actionTitle: "Click here top open"

  });
  let mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject: subject.toUpperCase(),
    html
  };
  transporter.sendMail(mailOptions, async (err, data) => {
    // if (err)
    // {
    //   throw new Error('email not sent');
    // }
    if (data) {
      return console.log("Email sent!")
    }
  });
};