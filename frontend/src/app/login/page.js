"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import "./Login.css";

require("dotenv").config();
const server_url = process.env.SERVER_URL;

const NewLogin = () => {
  const [Password, setPassword] = useState("");
  const [isPasswordInput, setIsPasswordInput] = useState(false);
  const [Username, setUsername] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(true);

  const router = useRouter();

  const handleCheckboxChange = () => {
    setIsPasswordInput(!isPasswordInput);
  };
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleUsernameChange = (event) => {
    const newUsername = event.target.value;
    setUsername(newUsername);
    setIsUsernameValid(validateEmail(newUsername));
  };
  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${server_url}/login-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Username, Password }),
      });
      if (response.ok) {
        //console.log("login body1");
        const data = await response.json();
        // Store the token in localStorage or session storage
        localStorage.setItem("token", data.token);
        localStorage.setItem("Username", Username);
        localStorage.setItem("isLoggedIn", "true");
        toast.success("Login successful!", { position: "bottom-right" });
        router.push("/dashboard");
      } else {
        // Handle login error
        console.error("Login failed");
        toast.error("Login failed. Please check your credentials.", {
          position: "bottom-right",
        });
      }
    } catch (error) {
      // Handle network error
      console.error("Network error:", error);
      toast.error("Network error. Please try again later.", {
        position: "bottom-right",
      });
    }
  };

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

  return (
    <div
      className="w-screen h-screen bg-cover bg-no-repeat bg-[url('/img/clientBg.jpg')] bg-[right] "
      style={{
        position: "relative",
      }}
    >
      <ToastContainer />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          background: "rgba(255, 255, 255, 0.9)",
          borderRadius: "10px",
          height: "80px",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "10px", // Adjust the radius value as needed
          backgroundColor: "rgba(179, 184, 193, .20)",
          backdropFilter: "blur(30px)",
          padding: "20px",
          height: "auto",
        }}
      >
        <p
          style={{
            textAlign: "center",
            fontSize: "20px",
            lineHeight: "1.2",
            fontWeight: "bold",
            color: "white",
            fontFamily: "sans-serif",
            textRendering: "optimizeLegibility",
            paddingTop: "15px",
          }}
        >
          Login
        </p>
        <ThemeProvider theme={theme}>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": {
                m: 0,
                width: "25ch",
              },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="standard-email-input"
              label="Username"
              type="email"
              autoComplete="current-email"
              variant="standard"
              value={Username}
              onChange={handleUsernameChange}
              error={!isUsernameValid}
              helperText={!isUsernameValid ? "Invalid email address" : ""}
              style={{
                textAlign: "center",
                fontSize: "20px",
                lineHeight: "1.2",
                fontWeight: "bold",
                color: "white",
                fontFamily: "sans-serif",
                textRendering: "optimizeLegibility",
                marginTop: "45px",
                borderColor: isUsernameValid ? "" : "red",
              }}
            />
            <br />
            <TextField
              id="standard-password-input"
              label="Password"
              type={isPasswordInput ? "text" : "password"}
              value={Password}
              onChange={handlePasswordChange}
              autoComplete="current-password"
              variant="standard"
              style={{
                textAlign: "center",
                fontSize: "20px",
                lineHeight: "1.2",
                fontWeight: "bold",
                color: "white",
                fontFamily: "sans-serif",
                textRendering: "optimizeLegibility",
                marginTop: "15px",
              }}
            />
            <br />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isPasswordInput}
                  onChange={handleCheckboxChange}
                />
              }
              style={{ color: "white" }}
              label="Show password"
            />
            <br />{" "}
            <div
              style={{
                display: "flex",
                justifyContent: "center" /* horizontally center */,
                alignItems: "center" /* vertically center */,
                marginLeft: "10px",
              }}
            >
              <button className="button-64" role="button" onClick={handleSubmit}>
                <span className="text">Sign in</span>
              </button>
            </div>
          </Box>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default NewLogin;
