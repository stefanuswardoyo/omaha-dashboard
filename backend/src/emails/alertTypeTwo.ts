const nodemailer = require("nodemailer");
import dotenv from "dotenv";
dotenv.config();

export async function sendAlertTypeTwoTargetBalance(
  jsonData: any
): Promise<void> {
  try {
    console.log("Sending Alert Type 2 Target Balance");
    const {
      Server,
      AccountName,
      InitialDeposit,
      Balance,
      Equity,
      OpenPositions,
      TargetBalance,
    } = jsonData;

    if (
      !Server ||
      !AccountName ||
      !InitialDeposit ||
      !Balance ||
      !Equity ||
      !OpenPositions ||
      !TargetBalance
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
    let additionalInfo = "Respected Sir, Target Balance Acheived";

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
            <td>${Balance}</td>
          </tr>
          <tr>
          <th>Target Balance</th>
          <td>${TargetBalance}</td>
        </tr>
          <tr>
            <th>Account Equity</th>
            <td>${Equity}</td>
          </tr>
          <tr>
            <th>Open Positions</th>
            <td>${OpenPositions}</td>
          </tr>
        </table>
      </body>
    </html>
  `;
    const subject = `${AccountName} ${Server} Target Balance Acheived`;
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





export async function sendAlertTypeTwoPercentage(
    jsonData: any
  ): Promise<void> {
    try {
      console.log("Sending Alert Type 2 Target Percentage");
      const {
        Server,
        AccountName,
        InitialDeposit,
        Balance,
        Equity,
        OpenPositions,
        TargetBalance,
        SettingPercentage
      } = jsonData;
  
      if (
        !Server ||
        !AccountName ||
        !InitialDeposit ||
        !Balance ||
        !Equity ||
        !OpenPositions ||
        !TargetBalance ||
        !SettingPercentage
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
      let additionalInfo = "Respected Sir, Setting Percentage PnL Acheived";
  
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
              <td>${Balance}</td>
            </tr>
            <tr>
            <th>Setting Percentage</th>
            <td>${SettingPercentage}</td>
          </tr>
            <tr>
              <th>Account Equity</th>
              <td>${Equity}</td>
            </tr>
            <tr>
              <th>Open Positions</th>
              <td>${OpenPositions}</td>
            </tr>
          </table>
        </body>
      </html>
    `;
      const subject = `${AccountName} ${Server} Setting Percentage Acheived`;
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