// AMPLIFY CONFIGURATION
import { Amplify } from "aws-amplify";
import amplifyconfig from "./amplifyconfiguration.json";

// Standard imports
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import reportWebVitals from "./reportWebVitals";
import App from "./pages/App";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Welcome from "./pages/Welcome";
import History from "./pages/History";
import Error from "./pages/Error";

// Before anything, make sure Amplify is configured
Amplify.configure(amplifyconfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="dashboard" element={<App />} />
                <Route path="welcome" element={<Welcome />} />
                <Route path="history" element={<History />} />
                <Route path="error" element={<Error />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
