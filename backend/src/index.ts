import express, { Request, Response } from "express";
import cors from "cors";
import * as jwt from "jsonwebtoken";
import connectDB from "./db";
import Account from "../src/models/account";
import Admin from "./models/Admin";
const bcrypt = require("bcryptjs");
import { sendAlertTypeOne } from "./emails/alertTypeOne";
import {
  sendAlertTypeTwoTargetBalance,
  sendAlertTypeTwoPercentage,
} from "./emails/alertTypeTwo";
import dotenv from "dotenv";
import { alertEmailTypes } from "./emailAlerts";
dotenv.config();
const tokenJwt: string = process.env.JWT_TOKEN || "JxVmG85yEnYrXQq3rTfTjzKZcTgRGsRw";
const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
const port = process.env.PORT || 8000;
// Connect to MongoDB
connectDB();

let accountData: any[] = [];

function createAdmin() {
  const newAdmin = new Admin({
    Username: "stefanus.wardoyo@gmail.com" as string,
    Password:
      "$2a$12$jG690N1aJ5TQ7WRlNLkOre7QNjTCZb6aTDGNoYpX4OrQb636d7l66" as string,
  });
  newAdmin
    .save()
    .then((savedData) => {
      console.log("Data saved:", savedData);
    })
    .catch((error) => {
      console.error("Error saving data:", error);
    });
}
async function checkIfAdminExist() {
  const count = await Admin.countDocuments();
  if (count === 0) {
    createAdmin();
    console.log("New Admin created!");
  }
}

//checkIfAdminExist();


app.get("/account/data", async (req: Request, res: Response) => {
  try {
    const data = await Account.find();
    res.json(data);
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("OMAHA TRADING LLC Server Running V3...");
});

app.get("/api/data", (req: Request, res: Response) => {
  const serverNumber = req.query.serverNumber as string;
  if (!serverNumber) {
    return res.send("-1"); // Return -1 if serverNumber is missing
  }
  Account.findOne({ Server: serverNumber })
    .then((existingData) => {
      if (existingData) {
        // Server number exists, update the values
        existingData.Server = serverNumber as string;
        existingData.InitialDeposit = req.query.initialDeposit as string;
        existingData.Balance = req.query.accountBalance as string;
        existingData.Equity = req.query.accountEquity as string;
        existingData.LastHeartBeat = req.query.lastHeartBeat as string;
        existingData.OpenPositions = req.query.openPositions as string;
        existingData.AccountName = req.query.accountName as string;

        // Save the updated document
        existingData
          .save()
          .then((updatedData) => {
            //console.log('Data updated:', updatedData);
            res.send("1");
          })
          .catch((error) => {
            console.error("Error updating data:", error);
          });
      } else {
        // Server number does not exist, create a new document
        const newData = new Account({
          Server: serverNumber as string,
          InitialDeposit: req.query.initialDeposit as string,
          Balance: req.query.accountBalance as string,
          Equity: req.query.accountEquity as string,
          LastHeartBeat: req.query.lastHeartBeat as string,
          OpenPositions: req.query.openPositions as string,
          AccountName: req.query.accountName as string,
          ProfitPercentage: 0,
          TargetBalance: 0,
          SettingPercentage: 0,
          SettingBalance: 0,
          Alert: true,
          AlertInterval: "6",
          LastAlertTimeType1: "0",
          LastAlertTimeType2: "0",
          LastAlertTimeType3: "0",
          LastAlertTimeType4: "0",
        });

        // Save the new document
        newData
          .save()
          .then((savedData) => {
            console.log("Data saved:", savedData);
            res.send(1);
          })
          .catch((error) => {
            console.error("Error saving data:", error);
          });
      }
    })
    .catch((error) => {
      console.error("Error checking server number:", error);
    });
});

app.post("/login-admin", async (req: Request, res: Response) => {
  try {
    console.log("login admin called");
    const { Username, Password } = req.body;
    console.log(req.body);
    console.log("login admin called ");

    const admin = await Admin.findOne({ Username });
    if (!admin) {
      return res.status(404).json({ msg: "Admin does not exists" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(Password, admin.Password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // Create and sign JWT
    const token = jwt.sign({ id: admin.id }, tokenJwt);
    res.status(200).json({ msg: "Login Successful", token: token });
  } catch (err) {
    console.error(err);
    console.log("error is:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

app.post("/api/updateAlertValue", async (req: Request, res: Response) => {
  try {
    console.log("update Alert called");
    console.log(req.body);
    const serverNumber = req.body.username;
    Account.findOne({ Server: serverNumber })
      .then((account) => {
        if (account) {
          account.Alert = req.body.percent;
          return account.save();
        } else {
          console.log("Account not found");
          res.status(404).send("Account not found");
        }
      })
      .then((updatedAccount) => {
        if (updatedAccount) {
          console.log("Account alert updated successfully:", updatedAccount);
          accountData.forEach((user) => {
            if (user.Server === serverNumber) {
              user.Alert = req.body.percent;
            }
          });
          res.status(200).send("Account updated successfully");
        }
      })
      .catch((error) => {
        console.error("Error occurred while updating account alert:", error);
        res.status(500).send("Internal Server Error");
      });
  } catch (error) {
    console.error("Error occurred while updating account alert:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/updatePercentageValue", async (req: Request, res: Response) => {
  try {
    console.log("update percentage called");
    console.log(req.body);
    const serverNumber = req.body.username;
    Account.findOne({ Server: serverNumber })
      .then((account) => {
        if (account) {
          account.ProfitPercentage = req.body.percent.toString();
          return account.save();
        } else {
          console.log("Account not found");
          res.status(404).send("Account not found");
        }
      })
      .then((updatedAccount) => {
        if (updatedAccount) {
          console.log(
            "Account profit percentage updated successfully",
            updatedAccount
          );
          accountData.forEach((user) => {
            if (user.Server === serverNumber) {
              user.ProfitPercentage = req.body.percent;
            }
          });
          res.status(200).send("Account updated successfully");
        }
      })
      .catch((error) => {
        console.error("Error occurred while updating account alert:", error);
        res.status(500).send("Internal Server Error");
      });
  } catch (error) {
    console.error("Error occurred while updating account alert:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/updateSettingPercentageValue", async (req: Request, res: Response) => {
  try {
    console.log("update setting percentage called");
    console.log(req.body);
    const serverNumber = req.body.username;
    Account.findOne({ Server: serverNumber })
      .then((account) => {
        if (account) {
          account.SettingPercentage = req.body.percent.toString();
          return account.save();
        } else {
          console.log("Account not found");
          res.status(404).send("Account not found");
        }
      })
      .then((updatedAccount) => {
        if (updatedAccount) {
          console.log(
            "Account setting percentage updated successfully",
            updatedAccount
          );
          accountData.forEach((user) => {
            if (user.Server === serverNumber) {
              user.SettingPercentage = req.body.percent;
            }
          });
          res.status(200).send("Account updated successfully");
        }
      })
      .catch((error) => {
        console.error("Error occurred while updating account alert:", error);
        res.status(500).send("Internal Server Error");
      });
  } catch (error) {
    console.error("Error occurred while updating account alert:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/updateTargetBalance", async (req: Request, res: Response) => {
  try {
    console.log("update target balance called");
    console.log(req.body);
    const serverNumber = req.body.username;
    Account.findOne({ Server: serverNumber })
      .then((account) => {
        if (account) {
          account.TargetBalance = req.body.percent.toString();
          return account.save();
        } else {
          console.log("Account not found");
          res.status(404).send("Account not found");
        }
      })
      .then((updatedAccount) => {
        if (updatedAccount) {
          console.log(
            "Account target balance updated successfully:",
            updatedAccount
          );
          accountData.forEach((user) => {
            if (user.Server === serverNumber) {
              user.TargetBalance = req.body.percent;
            }
          });
          res.status(200).send("Account updated successfully");
        }
      })
      .catch((error) => {
        console.error("Error occurred while updating account alert:", error);
        res.status(500).send("Internal Server Error");
      });
  } catch (error) {
    console.error("Error occurred while updating account alert:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/updateSettingBalance", async (req: Request, res: Response) => {
  try {
    console.log("update setting balance called");
    console.log(req.body);
    const serverNumber = req.body.username;
    Account.findOne({ Server: serverNumber })
      .then((account) => {
        if (account) {
          account.SettingBalance = req.body.percent.toString();
          return account.save();
        } else {
          console.log("Account not found");
          res.status(404).send("Account not found");
        }
      })
      .then((updatedAccount) => {
        if (updatedAccount) {
          console.log(
            "Account setting balance updated successfully:",
            updatedAccount
          );
          accountData.forEach((user) => {
            if (user.Server === serverNumber) {
              user.SettingBalance = req.body.percent;
            }
          });
          res.status(200).send("Account updated successfully");
        }
      })
      .catch((error) => {
        console.error("Error occurred while updating account alert:", error);
        res.status(500).send("Internal Server Error");
      });
  } catch (error) {
    console.error("Error occurred while updating account alert:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/deleteAccount", async (req: Request, res: Response) => {
  try {
    const { serverNumber } = req.body;
    console.log(serverNumber)
    // Find and delete the account with the matching serverNumber
    const deletedAccount = await Account.findOneAndDelete({ Server: serverNumber });

    if (!deletedAccount) {
      return res.status(404).json({ message: 'Account not found' });
    }
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error("Error occurred while deleting the account:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/serverData", async (req: Request, res: Response) => {

  const serverNumber = req.query.serverNumber as string;
  const dataType = req.query.dataType as string;
  Account.findOne({ Server: serverNumber })
    .then((existingData) => {

      if (dataType == "SettingBalance")
        res.send(existingData.SettingBalance);
      if (dataType == "SettingPercentage")
        res.send(existingData.SettingPercentage);
      if (dataType == "ProfitPercentage")
        res.send(existingData.ProfitPercentage);
      if (dataType == "TargetBalance")
        res.send(existingData.TargetBalance);
    })
    .catch((error) => {
      console.error("Error checking server number:", error);
      res.send(-1)
    });

});

app.get("/api/sendEmail", async (req: Request, res: Response) => {
  const serverNumber = req.query.serverNumber as string;
  const emailType = req.query.emailType as string;
  console.log("serverNumber : ", serverNumber, " emailType : ", emailType)

  Account.findOne({ Server: serverNumber })
    .then((existingData) => {
      if (!existingData) {
        res.status(404).send("Server not found");
        return;
      }

      if (emailType == "1") {
        sendAlertTypeOne(existingData)
          .then(() => {
            console.log("Alert 1 successfully sent and promise resolved.");
            res.send("1");
          })
          .catch((error) => {
            console.error("Error sending alert:", error);
            res.status(500).send("-1");
          });
      } else if (emailType == "2") {
        sendAlertTypeTwoTargetBalance(existingData)
          .then(() => {
            console.log("Alert 2 successfully sent and promise resolved.");
            res.send("2");
          })
          .catch((error) => {
            console.error("Error sending alert:", error);
            res.status(500).send("-1");
          });
      } else if (emailType == "3") {
        sendAlertTypeTwoPercentage(existingData)
          .then(() => {
            console.log("Alert 3 successfully sent and promise resolved.");
            res.send("3");
          })
          .catch((error) => {
            console.error("Error sending alert:", error);
            res.status(500).send("-1");
          });
      } else if (emailType == "4") {
        res.send("4");
      } else {
        res.status(400).send("Invalid emailType");
      }
    })
    .catch((error) => {
      console.error("Error checking server number:", error);
      res.status(500).send("-1");
    });
});

app.post("/reset-password", authenticateToken, async (req: Request, res: Response) => {
  const { username, oldPassword, newPassword, confirmPassword } = req.body;
  console.log(username, oldPassword, newPassword, confirmPassword);
  try {
    // Find the user by their username or ID
    const users = await Admin.find();
    console.log(users);
    const admin = await Admin.findOne({ Username: username });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check if the old password matches the stored hashed password
    const isMatch = await bcrypt.compare(oldPassword, admin.Password);

    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "New password and confirm password do not match" });
    }

    // Hash the new password and update the user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.Password = hashedPassword;
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// allow json body
app.use(express.json());

function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    console.log("authtoken Empty");
    return res.sendStatus(401);
  }

  jwt.verify(token, tokenJwt, (err: any, user: any) => {
    if (err) {
      console.log("authtoken failed");
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
}

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


