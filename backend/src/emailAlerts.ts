import { sendAlertTypeOne } from "./emails/alertTypeOne";
import {
  sendAlertTypeTwoTargetBalance,
  sendAlertTypeTwoPercentage,
} from "./emails/alertTypeTwo";
import Account from "../src/models/account";
import dotenv from "dotenv";
dotenv.config();

export async function alertEmailTypes() {
  try {
    const accounts = await Account.find({});

    for (const account of accounts) {
      //console.log(account);
      let floating_pnl: number =
        Number(account.Equity) - Number(account.Balance);
      let required_pnl_for_alert =
        (Number(account.ProfitPercentage) / 100) *
        Number(account.SettingBalance);
      required_pnl_for_alert = required_pnl_for_alert * -1;

      // Case Alert Type 1
      if (
        floating_pnl <= required_pnl_for_alert &&
        Number(account.SettingBalance) != 0
      ) {
        const previousAlertTime = new Date(Number(account.LastAlertTimeType1));
        const currentTime = new Date();
        const timeDifference =
          (currentTime.getTime() - previousAlertTime.getTime()) / (1000 * 60);
        if (account.Alert == true) {
          if (
            previousAlertTime.getTime() === 0 ||
            timeDifference > Number(process.env.ALERT_INTERVAL)
          ) {
            sendAlertTypeOne(account)
              .then(() => {
                console.log("Alert 1 successfully sent and promise resolved.");
                account.LastAlertTimeType1 = String(currentTime.getTime());
                account.save();
              })
              .catch((error) => {
                console.error("Error sending alert:", error);
              });
          }
        }
      }

      // Case Alert Target Balance Type 2
      if (
        Number(account.Balance) >= Number(account.TargetBalance) &&
        Number(account.TargetBalance) != 0
      ) {
        const previousAlertTime = new Date(Number(account.LastAlertTimeType2));
        const currentTime = new Date();
        const timeDifference =
          (currentTime.getTime() - previousAlertTime.getTime()) / (1000 * 60);
        if (account.Alert == true) {
          if (
            previousAlertTime.getTime() == 0 ||
            timeDifference > Number(process.env.ALERT_INTERVAL)
          ) {
            sendAlertTypeTwoTargetBalance(account)
              .then(() => {
                console.log("Alert 2 successfully sent and promise resolved.");
                account.LastAlertTimeType2 = String(currentTime.getTime());
                account.save();
              })
              .catch((error) => {
                console.error("Error sending alert:", error);
              });
          }
        }
      }

      // Case Alert Target Balance Type 2
      let required_pnl_for_alert2 =
        (Number(account.SettingPercentage) / 100) *
        Number(account.SettingBalance);
      required_pnl_for_alert2 = required_pnl_for_alert2 * -1;
      if (
        floating_pnl >= required_pnl_for_alert2 &&
        Number(account.SettingBalance) != 0 &&
        account.LastAlertTimeType1 > account.LastAlertTimeType2
      ) {
        const currentTime = new Date();
        sendAlertTypeTwoPercentage(account)
          .then(() => {
            console.log("Alert 2 successfully sent and promise resolved.");
            account.LastAlertTimeType2 = String(currentTime.getTime());
            account.save();
          })
          .catch((error) => {
            console.error("Error sending alert:", error);
          });
      }
    }
  } catch (error) {
    console.error("Error in alertEmailTypes function:", error);
  }
}
