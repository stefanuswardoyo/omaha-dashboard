import moment from 'moment';
const nodemailer = require("nodemailer");
import dotenv from 'dotenv';
dotenv.config();

interface Account {
  Server: string;
  AccountName: string;
  LastHeartBeat: string;
  // Other properties of Account
}

export async function sendAlertTypeThree(account: Account): Promise<void> {
  try {
    console.log("Sending Alert Type 3");

    const transporter = nodemailer.createTransport({
      port: 465,
      host: "smtp.gmail.com",
      secure: true,
      secureConnection: false,
      auth: {
        user: process.env.EMAIL_ADMIN,
        pass: process.env.PASSWORD_ADMIN,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    // Create HTML template
    const htmlTemplate = `
    <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          h2 {
            color: #333;
          }
          p {
            color: #555;
          }
        </style>
      </head>
      <body>
        <h2>Account Disconnected</h2>
        <p>Your account has been disconnected.</p>
        <table>
          <tr>
            <th>Server Number</th>
            <td>${account.Server}</td>
          </tr>
          <tr>
            <th>Account Name</th>
            <td>${account.AccountName}</td>
          </tr>
          <tr>
            <th>Last Heartbeat</th>
            <td>${moment(parseInt(account.LastHeartBeat)).format('YYYY-MM-DD HH:mm:ss')}</td>
          </tr>
        </table>
      </body>
    </html>
  `;
    const subject = 'Account Disconnected';
    const mailOptions = {
      from: `"OMAHA TRADING LLC" <${process.env.EMAIL_ADMIN}>`, // sender address
      to: `${process.env.EMAIL_ADMIN}`, // list of receivers
      subject: subject, // Subject line
      html: htmlTemplate, // html body
    };

    // Send mail
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log("Error Sending Email");
    throw error;
  }
}
