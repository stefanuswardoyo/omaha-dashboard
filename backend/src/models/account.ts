import mongoose, { Schema, Document } from "mongoose";

// Define the interface for your data
interface MyData extends Document {
  InitialDeposit: String;
  Balance: String;
  Equity: String;
  Server: String;
  LastHeartBeat: String;
  OpenPositions: String;
  AccountName: String;
  ProfitPercentage: String;
  TargetBalance: String;
  Alert: Boolean;
  AlertInterval: String;
  SettingBalance: String;
  SettingPercentage: String;
  LastAlertTimeType1: String;
  LastAlertTimeType2: String;
  LastAlertTimeType3: String;
  LastAlertTimeType4: String;

}

// Define the schema
const MyDataSchema = new Schema<MyData>({
  InitialDeposit: { type: String, required: true },
  Balance: { type: String, required: true },
  Equity: { type: String, required: true },
  Server: { type: String, required: true },
  LastHeartBeat: { type: String, required: true },
  OpenPositions: { type: String, required: true },
  AccountName: { type: String, required: true },
  ProfitPercentage: { type: String, required: true },
  TargetBalance: { type: String, required: true },
  Alert: { type: Boolean, required: true },
  AlertInterval: { type: String, required: true },
  SettingBalance: { type: String, required: true },
  SettingPercentage: { type: String, required: true },
  LastAlertTimeType1: { type: String, required: true },
  LastAlertTimeType2: { type: String, required: true },
  LastAlertTimeType3: { type: String, required: true },
  LastAlertTimeType4: { type: String, required: true },
});

// Create the model
const Account = mongoose.model<MyData>("Account", MyDataSchema);

export default Account;
