"use client";
import * as React from "react";
import "./page.css";
import PlaylistAddCheckCircleRoundedIcon from "@mui/icons-material/PlaylistAddCheckCircleRounded";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CandlestickChartIcon from "@mui/icons-material/CandlestickChart";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PercentIcon from "@mui/icons-material/Percent";
import InsightsIcon from "@mui/icons-material/Insights";
import BrowserUpdatedIcon from "@mui/icons-material/BrowserUpdated";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../sidebar/sidebar";
import MinimizedSidebar from "../minimizedSidebar/minimizedSidebar.js";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import EmailIcon from "@mui/icons-material/Email";

const moment = require("moment");

// require("dotenv").config();
// const server_url = process.env.SERVER_URL;

const QIG_Dashboard = () => {
  const server_url = "http://localhost:8000";
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [Balance, setBalance] = useState([]);
  const [previousBalance, setPreviousBalance] = useState([]);
  const [settingBalance, setSettingBalance] = useState([]);
  const [previousSettingBalance, setPreviousSettingBalance] = useState([]);
  const [percentage, setPercentage] = useState([]);
  const [previousPercentage, setPreviousPercentage] = useState([]);
  const [settingPercentage, setSettingPercentage] = useState([]);
  const [previousSettingPercentage, setPreviousSettingPercentage] = useState(
    []
  );
  const [alert, setAlert] = useState([]);
  const [AlertInterval, setAlertInterval] = useState([]);
  const [jsonData, setJsonData] = useState([
    {
      AccountName: "",
      Server: "",
      timeDifference: "",
      InitialDeposit: "",
      Balance: "",
      Equity: "",
      OpenPositions: "",
      LastHeartBeat: "",
      ProfitPercentage: "",
      TargetBalance: "",
      Alert: "",
      AlertInterval: "",
      SettingBalance: "",
      SettingPercentage: "",
    },
  ]);

  const [userServerNumbers, setUserServerNumbers] = useState("");
  let condition = 0;

  useEffect(() => {
    // ======================================
    const fetchData = async () => {
      try {
        let storedUsername;
        if (typeof window !== "undefined") {
          storedUsername = String(localStorage.getItem("username"));
        }

        const response = await fetch(
          `${server_url}/account/data?Username=${encodeURIComponent(
            storedUsername
          )}`
        );
        const data = await response.json();

        if (Array.isArray(data)) {
          const updatedData = data.map((item) => ({
            ...item,
            timeDifference: getTimeDifference(item.LastHeartBeat),
          }));

          console.log("Data from Backend (updatedData): ", updatedData);
          setJsonData(updatedData);
          console.log("updated json: ", updatedData);
          if (condition === 0) {
            condition = 1;
            const updatedPrevBalance = updatedData.map(
              ({ TargetBalance }) => TargetBalance
            );
            const updatedPrevPercentage = updatedData.map(
              ({ ProfitPercentage }) => ProfitPercentage
            );
            const updatedAlert = updatedData.map(({ Alert }) => Alert);
            const updatedAlertInterval = updatedData.map(
              ({ AlertInterval }) => AlertInterval
            );
            const updatedPrevSettingBalance = updatedData.map(
              ({ SettingBalance }) => SettingBalance
            );
            const updatedPrevSettingPercentage = updatedData.map(
              ({ SettingPercentage }) => SettingPercentage
            );
            setTargetBalancesArrays(
              updatedData.length,
              updatedPrevBalance,
              updatedPrevPercentage,
              updatedAlert,
              updatedAlertInterval,
              updatedPrevSettingBalance,
              updatedPrevSettingPercentage
            );
            console.log("Balances", previousBalance[0], Balance[0]);
          }
        } else if (typeof data === "object") {
          const updatedData = [
            {
              ...data,
              timeDifference: getTimeDifference(data.LastHeartBeat),
            },
          ];
        } else {
          // Handle other cases or provide an error message
          console.error("Invalid data format");
        }
      } catch (error) {
        console.error("Error fetching JSON data:", error);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [router, userServerNumbers]);
  const getTimeDifference = (lastHeartBeat) => {
    const GMTTime = new Date();
    const date = new Date(lastHeartBeat * 1000);
    const timeDifference = Math.floor(
      (GMTTime.getTime() - date.getTime()) / 1000
    );
    if (timeDifference < 0 || timeDifference > 300) {
      return -1;
    }
    return 1;
  };

  useEffect(() => {
    let isLoggedIn;
    if (typeof window !== "undefined") {
      isLoggedIn = localStorage.getItem("isSawyerLoggedIn");
    }

    if (isLoggedIn == "false") {
      router.push("/login");
    }
  }, [router]);

  function timestampToTime(timestamp) {
    const date = moment(timestamp * 1000).format("MM/DD/YYYY HH:mm:ss");
    return date;
  }

  const theme = createTheme({
    palette: {
      background: {
        paper: "#fff",
      },
      text: {
        primary: "#FFFFFF",
        secondary: "#FFFFFF",
      },
      action: {
        active: "#001E3C",
      },
      success: {
        main: "#009688",
      },
    },
  });

  const updatePercentageValue = async (value, user) => {
    try {
      const url = server_url + "/api/updatePercentageValue";
      const data = {
        username: user,
        percent: value,
      };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };

      fetch(url, options)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("POST request succeeded with JSON response:", data);
        })
        .catch((error) => {
          console.error("There was a problem with the POST request:", error);
        });
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle errors here
    }
  };

  const updateSettingPercentageValue = async (value, user) => {
    try {
      const url = server_url + "/api/updateSettingPercentageValue";
      const data = {
        username: user,
        percent: value,
      };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };

      fetch(url, options)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("POST request succeeded with JSON response:", data);
        })
        .catch((error) => {
          console.error("There was a problem with the POST request:", error);
        });
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle errors here
    }
  };

  const updateTargetBalanceValue = async (value, user) => {
    try {
      const url = server_url + "/api/updateTargetBalance";
      const data = {
        username: user,
        percent: value,
      };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };

      fetch(url, options)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("POST request succeeded with JSON response:", data);
        })
        .catch((error) => {
          console.error("There was a problem with the POST request:", error);
        });
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle errors here
    }
  };

  const updateSettingBalanceValue = async (value, user) => {
    try {
      const url = server_url + "/api/updateSettingBalance";
      const data = {
        username: user,
        percent: value,
      };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };

      fetch(url, options)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("POST request succeeded with JSON response:", data);
        })
        .catch((error) => {
          console.error("There was a problem with the POST request:", error);
        });
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle errors here
    }
  };

  const updateAlertValue = async (value, user) => {
    try {
      const url = server_url + "/api/updateAlertValue";
      const data = {
        username: user,
        percent: value,
      };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };

      fetch(url, options)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("POST request succeeded with JSON response:", data);
        })
        .catch((error) => {
          console.error("There was a problem with the POST request:", error);
        });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleBalanceChange = (event, index, mode) => {
    event.preventDefault();
    if (mode === 1) {
      const newBalance = event.target.value;
      const updatedBalance = [...Balance];
      updatedBalance[index] = newBalance;
      setBalance(updatedBalance);
    } else {
      const newSettingBalance = event.target.value;
      const updatedSettingBalance = [...settingBalance];
      updatedSettingBalance[index] = newSettingBalance;
      setSettingBalance(updatedSettingBalance);
    }
  };

  const handlePercentageChange = (event, index, mode) => {
    if (mode === 1) {
      event.preventDefault();
      const newPercentage = event.target.value;
      const updatedPercentage = [...percentage];
      updatedPercentage[index] = newPercentage;
      setPercentage(updatedPercentage);
    } else {
      event.preventDefault();
      const newSettingPercentage = event.target.value;
      const updatedSettingPercentage = [...settingPercentage];
      updatedSettingPercentage[index] = newSettingPercentage;
      setSettingPercentage(updatedSettingPercentage);
    }
  };

  const handleKeyPress = (event, index, user) => {
    if (event.key === "Enter" && Balance[index] >= 0) {
      event.preventDefault();
      let tempBalance = Balance[index];
      const updatedPreviousBalance = [...previousBalance];
      updatedPreviousBalance[index] = Balance[index];
      setPreviousBalance(updatedPreviousBalance);
      const updatedBalance = [...Balance];
      updatedBalance[index] = "";
      setBalance(updatedBalance);
      updateTargetBalanceValue(tempBalance, user);
    }
    // else {
    //   event.preventDefault();
    //   const updatedBalance = [...Balance];
    //   updatedBalance[index] = "";
    //   setBalance(updatedBalance);
    // }
  };

  const handleSettingBalanceKeyPress = (event, index, user) => {
    if (event.key === "Enter" && settingBalance[index] >= 0) {
      event.preventDefault();
      let tempBalance = settingBalance[index];
      const updatedPreviousSettingBalance = [...previousSettingBalance];
      updatedPreviousSettingBalance[index] = settingBalance[index];
      setPreviousSettingBalance(updatedPreviousSettingBalance);
      const updatedBalance = [...settingBalance];
      updatedBalance[index] = "";
      setSettingBalance(updatedBalance);
      updateSettingBalanceValue(tempBalance, user);
    }
  };

  const handleKeyPressPercentage = (event, index, user) => {
    if (
      event.key === "Enter" &&
      percentage[index] >= 0 &&
      percentage[index] <= 100
    ) {
      event.preventDefault();
      let temp = percentage[index];
      const updatedPreviousPercentages = [...previousPercentage];
      updatedPreviousPercentages[index] = percentage[index];
      setPreviousPercentage(updatedPreviousPercentages);
      const updatedPercentage = [...percentage];
      updatedPercentage[index] = "";
      setPercentage(updatedPercentage);
      updatePercentageValue(temp, user);
    }

    // else {
    //   event.preventDefault();
    //   const updatedPercentage = [...percentage];
    //   updatedPercentage[index] = "";
    //   setPercentage(updatedPercentage);
    // }
  };

  const handleKeyPressSettingPercentage = (event, index, user) => {
    if (
      event.key === "Enter" &&
      settingPercentage[index] >= 0 &&
      settingPercentage[index] <= 100
    ) {
      event.preventDefault();
      let temp = settingPercentage[index];
      const updatedPreviousSettingPercentages = [...previousSettingPercentage];
      updatedPreviousSettingPercentages[index] = settingPercentage[index];
      setPreviousSettingPercentage(updatedPreviousSettingPercentages);
      const updatedSettingPercentage = [...settingPercentage];
      updatedSettingPercentage[index] = "";
      setSettingPercentage(updatedSettingPercentage);
      updateSettingPercentageValue(temp, user);
    }
  };

  function handleAlert(index, user) {
    const tempAlert = [...alert];
    tempAlert[index] = !tempAlert[index];
    let tempAlertData = tempAlert[index];
    setAlert(tempAlert);
    setTimeout(1000);
    updateAlertValue(tempAlertData, user);
  }

  function setTargetBalancesArrays(
    value,
    prevBalance,
    prevPercentage,
    alertData,
    alertIntervalData,
    prevSettingBalancesData,
    prevSettingPercentageData
  ) {
    const updatedBalance = Array(value).fill("");
    const percentages = Array(value).fill("");
    const updatedSettingBalance = Array(value).fill("");
    const updatedSettingPercentage = Array(value).fill("");

    setPreviousBalance(prevBalance);
    setBalance(updatedBalance);
    setAlert(alertData);
    setPercentage(percentages);
    setPreviousPercentage(prevPercentage);
    setAlertInterval(alertIntervalData);
    setPreviousSettingBalance(prevSettingBalancesData);
    setPreviousSettingPercentage(prevSettingPercentageData);
    setSettingBalance(updatedSettingBalance);
    setSettingPercentage(updatedSettingPercentage);
  }

  return (
    <>
      <div
        style={{
          backgroundImage: "url(/img/clientBg.png)",
          display: "flex",
          backgroundRepeat: "repeat-y",
          backgroundSize: "cover",
        }}
      >
        <div
          onMouseEnter={() => setIsSidebarOpen(true)}
          onMouseLeave={() => setIsSidebarOpen(false)}
          style={{
            backgroundColor: "transparent",
            height: "100vh",
            width: "70px",
            zIndex: "1",
          }}
        >
          {isSidebarOpen ? <Sidebar /> : <MinimizedSidebar />}
        </div>
        <br></br>

        <div className="card-container">
          {jsonData.map(
            (item, index) =>
              item.Server && (
                <div
                  key={index}
                  className="detail-card"
                  style={{
                    backgroundColor: "rgba(179, 184, 193, .20)",
                    backdropFilter: "blur(30px)",
                    color: "white",
                  }}
                >
                  <div className="card-row">
                    <div className="row-item">
                      <AccountBalanceIcon
                        style={{ color: "white", fontSize: "20px" }}
                      />
                      <span className="row-label">Account:</span>
                    </div>
                    <span className="row-value">{item.AccountName}</span>
                  </div>

                  <div className="row-divider"></div>
                  <div className="card-row">
                    <div className="row-item">
                      <AccountBalanceIcon
                        style={{ color: "white", fontSize: "20px" }}
                      />
                      <span className="row-label">Server:</span>
                    </div>
                    <span className="row-value">{item.Server}</span>
                  </div>
                  <div className="row-divider"></div>
                  <div className="card-row">
                    <div className="row-item">
                      <PlaylistAddCheckCircleRoundedIcon
                        style={{ color: "white", fontSize: "20px" }}
                      />
                      <span className="row-label">Connection:</span>
                    </div>
                    <span
                      className={`row-value line-2 ${
                        parseInt(item.timeDifference) === -1 ? "red" : "green"
                      }`}
                      style={{
                        color:
                          parseInt(item.timeDifference) === -1
                            ? "red"
                            : "green",
                      }}
                    >
                      {parseInt(item.timeDifference) === -1
                        ? "IN-ACTIVE"
                        : "ACTIVE"}
                    </span>
                  </div>

                  <div className="row-divider"></div>
                  <div className="card-row">
                    <div className="row-item">
                      <AccountBalanceWalletIcon
                        style={{ color: "white", fontSize: "20px" }}
                      />
                      <span className="row-label">Balance:</span>
                    </div>
                    <span className="row-value">
                      ${Number(item.Balance).toFixed(2)}
                    </span>
                  </div>

                  <div className="row-divider"></div>
                  <div className="card-row">
                    <div className="row-item">
                      <CandlestickChartIcon
                        style={{ color: "white", fontSize: "20px" }}
                      />
                      <span className="row-label">Equity:</span>
                    </div>
                    <span
                      className={`row-value ${
                        Number(item.Equity) > Number(item.Balance)
                          ? "dark-green"
                          : Number(item.Equity) < Number(item.Balance)
                          ? "red"
                          : ""
                      }`}
                      style={{
                        color:
                          Number(item.Equity) > Number(item.Balance)
                            ? "darkgreen"
                            : Number(item.Equity) < Number(item.Balance)
                            ? "red"
                            : "white",
                      }}
                    >
                      ${Number(item.Equity).toFixed(2)}
                    </span>
                  </div>
                  <div className="row-divider"></div>
                  <div className="card-row">
                    <div className="row-item">
                      <PlaylistAddCheckCircleRoundedIcon
                        style={{ color: "white", fontSize: "20px" }}
                      />
                      <span className="row-label">Open Positions:</span>
                    </div>
                    <span className="row-value">{item.OpenPositions}</span>
                  </div>

                  <div className="row-divider"></div>
                  <div className="card-row">
                    <div className="row-item">
                      <InsightsIcon
                        style={{ color: "white", fontSize: "20px" }}
                      />
                      <span className="row-label">Floating Pnl:</span>
                    </div>
                    <span
                      className={`row-value ${
                        (
                          Number(item.Equity).toFixed(2) -
                          Number(item.Balance).toFixed(2)
                        ).toFixed(2) > 0
                          ? "dark-green"
                          : (
                              Number(item.Equity).toFixed(2) -
                              Number(item.Balance).toFixed(2)
                            ).toFixed(2) < 0
                          ? "red"
                          : "white"
                      }`}
                      style={{
                        color:
                          (
                            Number(item.Equity).toFixed(2) -
                            Number(item.Balance).toFixed(2)
                          ).toFixed(2) > 0
                            ? "darkgreen"
                            : (
                                Number(item.Equity).toFixed(2) -
                                Number(item.Balance).toFixed(2)
                              ).toFixed(2) < 0
                            ? "red"
                            : "white",
                      }}
                    >
                      $
                      {(
                        Number(item.Equity).toFixed(2) -
                        Number(item.Balance).toFixed(2)
                      ).toFixed(2)}
                    </span>
                  </div>

                  <div className="row-divider"></div>
                  <div className="card-row">
                    <div className="row-item">
                      <PercentIcon
                        style={{ color: "white", fontSize: "20px" }}
                      />
                      <span className="row-label">Loss Percentage:</span>
                    </div>

                    <div className="row-value">
                      <ThemeProvider theme={theme}>
                        <Box
                          component="form"
                          sx={{
                            "& > :not(style)": { mt: 1, width: "17ch" },
                            color: "text.primary",
                          }}
                          noValidate
                          autoComplete="off"
                        >
                          <TextField
                            id="outlined-basic"
                            label="Percentage"
                            variant="outlined"
                            value={percentage[index]}
                            onChange={(event) =>
                              handlePercentageChange(event, index, 1)
                            }
                            onKeyDown={(event) =>
                              handleKeyPressPercentage(
                                event,
                                index,
                                item.Server
                              )
                            }
                          />
                        </Box>
                      </ThemeProvider>
                    </div>
                    <br></br>
                    <span className="row-value">
                      Percentage: {previousPercentage[index]}%
                    </span>
                  </div>

                  <div className="card-row">
                    <div className="row-item">
                      <MonetizationOnIcon
                        style={{ color: "white", fontSize: "20px" }}
                      />
                      <span className="row-label">Target Balance:</span>
                    </div>

                    <div className="row-value">
                      <ThemeProvider theme={theme}>
                        <Box
                          component="form"
                          sx={{
                            "& > :not(style)": { mt: 1, width: "17ch" },
                            color: "text.primary",
                          }}
                          noValidate
                          autoComplete="off"
                        >
                          <TextField
                            id="outlined-basic"
                            label="Balance"
                            variant="outlined"
                            value={Balance[index]}
                            onChange={(event) =>
                              handleBalanceChange(event, index, 1)
                            }
                            onKeyDown={(event) =>
                              handleKeyPress(event, index, item.Server)
                            }
                          />
                        </Box>
                      </ThemeProvider>
                    </div>
                    <br></br>
                    <span className="row-value">
                      Target: ${previousBalance[index]}
                    </span>
                  </div>
                  <div className="row-divider"></div>
                  <div className="card-row">
                    <div className="row-item">
                      <PercentIcon
                        style={{ color: "white", fontSize: "20px" }}
                      />
                      <span className="row-label">Setting Percentage:</span>
                    </div>

                    <div className="row-value">
                      <ThemeProvider theme={theme}>
                        <Box
                          component="form"
                          sx={{
                            "& > :not(style)": { mt: 1, width: "17ch" },
                            color: "text.primary",
                          }}
                          noValidate
                          autoComplete="off"
                        >
                          <TextField
                            id="outlined-basic"
                            label="Percentage"
                            variant="outlined"
                            value={settingPercentage[index]}
                            onChange={(event) =>
                              handlePercentageChange(event, index, 2)
                            }
                            onKeyDown={(event) =>
                              handleKeyPressSettingPercentage(
                                event,
                                index,
                                item.Server
                              )
                            }
                          />
                        </Box>
                      </ThemeProvider>
                    </div>
                    <br></br>
                    <span className="row-value">
                      Setting Percentage: {previousSettingPercentage[index]}%
                    </span>
                  </div>

                  <div className="card-row">
                    <div className="row-item">
                      <MonetizationOnIcon
                        style={{ color: "white", fontSize: "20px" }}
                      />
                      <span className="row-label">Setting Balance:</span>
                    </div>

                    <div className="row-value">
                      <ThemeProvider theme={theme}>
                        <Box
                          component="form"
                          sx={{
                            "& > :not(style)": { mt: 1, width: "17ch" },
                            color: "text.primary",
                          }}
                          noValidate
                          autoComplete="off"
                        >
                          <TextField
                            id="outlined-basic"
                            label="Balance"
                            variant="outlined"
                            value={settingBalance[index]}
                            onChange={(event) =>
                              handleBalanceChange(event, index, 2)
                            }
                            onKeyDown={(event) =>
                              handleSettingBalanceKeyPress(
                                event,
                                index,
                                item.Server
                              )
                            }
                          />
                        </Box>
                      </ThemeProvider>
                    </div>
                    <br></br>
                    <span className="row-value">
                      Setting Balance: ${previousSettingBalance[index]}
                    </span>
                  </div>
                  <div className="row-divider"></div>
                  <div className="card-row">
                    <div className="row-item">
                      <BrowserUpdatedIcon
                        style={{ color: "white", fontSize: "20px" }}
                      />
                      <span className="row-label">Last Data Updated:</span>
                    </div>
                    <span className="row-value">
                      {timestampToTime(item.LastHeartBeat)}
                    </span>
                  </div>

                  <div className="row-divider"></div>
                  <div className="card-row">
                    <div className="row-item">
                      <EmailIcon style={{ color: "white", fontSize: "20px" }} />
                      <span className="row-label">Alert:</span>
                    </div>
                    <div className="row-value">
                      <Switch
                        checked={alert[index]}
                        onClick={() => handleAlert(index, item.Server)}
                      />
                    </div>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </>
  );
};

export default QIG_Dashboard;
