const nodemailer = require("nodemailer");
import dotenv from "dotenv";
dotenv.config();

export async function sendAlertTypeOne(jsonData: any): Promise<void> {
  try {
    console.log("Sending Alert Type 1");
    const {
      Server,
      AccountName,
      InitialDeposit,
      Balance,
      Equity,
      OpenPositions,
    } = jsonData;

    if (
      !Server ||
      !AccountName ||
      !InitialDeposit ||
      !Balance ||
      !Equity ||
      !OpenPositions
    ) {
      console.log("Error Getting Values");
      return;
    }
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

    // Create HTML template with additional information based on Type
    let additionalInfo = "Respected Sir, DEPOSIT REQUIRED";

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
        <h2>Account Information</h2>
        <p>${additionalInfo}</p>
        <table>
          <tr>
            <th>Server Number</th>
            <td>${Server}</td>
          </tr>
          <tr>
            <th>Account Name</th>
            <td>${AccountName}</td>
          </tr>
          <tr>
          <th>Account Balance</th>
          <td>${parseFloat(Balance).toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}</td>
        </tr>
        <tr>
          <th>Account Equity</th>
          <td>${parseFloat(Equity).toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}</td>
        </tr>
          <tr>
            <th>Open Positions</th>
            <td>${OpenPositions}</td>
          </tr>
        </table>
      </body>
    </html>
  `;
    const subject = `${AccountName} ${Server} Drawdown reached`;
    const mailOptions = {
      from: `"OMAHA TRADING LLC" <${process.env.EMAIL_ADMIN}>`, // sender address
      to: `${process.env.EMAIL_ADMIN}`, // list of receivers
      subject: subject, // Subject line
      html: htmlTemplate, // html body
    };

    // Send mail
    const info: any = await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err: any, info: any) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log(info);
          resolve(info);
        }
      });
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log("Error Sending Email");
    throw error;
  }
}
