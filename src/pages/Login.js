import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import { Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";

import { signIn } from "aws-amplify/auth";

import { InsightTitle } from "../components/typography/InsightTitle";
import BlackButton from "../components/buttons/BlackButton";
import TextFieldYellow from "../components/inputs/TextFieldYellow";
import theme from "../components/themes/MainTheme";
import { fetch_user_auth_status, do_sign_out } from "../hooks/auth";

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showProgress, setShowProgress] = useState("");
    const [error, setError] = useState("");

    async function loginApiCall() {
        try {
            setShowProgress(true);
            console.info("Attempting login");
            const { isSignedIn, nextStep } = await signIn({
                username,
                password,
            });
            switch (nextStep.signInStep) {
                case "DONE":
                    console.info(`${username} successfully signed in!`);
                    break;
                case "CONFIRM_SIGN_UP":
                    console.warn(
                        `${username} tried to sign in but hasn't verified OTP yet`
                    );
                    setError("You have not verified your account yet.");
                    break;
                default:
                    console.warn(`${username} failed to sign in`);
            }
            setUsername("");
            setPassword("");
            setShowProgress(false);
            navigate("/welcome");
        } catch (error) {
            setShowProgress(false);
            if (error.name === "UserAlreadyAuthenticatedException") {
                console.warn(
                    "There is already a user logged in - logging them out now"
                );
                const user_auth_status = await fetch_user_auth_status();
                await do_sign_out();
                loginApiCall(); // try login again after previous user is logged out
            } else {
                console.error("Error signing in", error);
                setError(error.message);
            }
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    flexDirection: "column",
                }}
                height="100vh"
                width="100vw"
                display="flex"
                justifyContent="space-evenly"
                alignItems="center"
            >
                <Paper
                    sx={{
                        padding: "2em 5em 2em 5em",
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                    elevation="6"
                >
                    <InsightTitle />
                    <Stack
                        sx={{
                            marginTop: "2em",
                            marginBottom: "2em",
                        }}
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <Typography>Log in with your email address.</Typography>
                        <TextFieldYellow
                            placeholder="Email"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextFieldYellow
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            type="password"
                        />
                        {error ? <Alert severity="error">{error}</Alert> : ""}
                    </Stack>
                    {showProgress ? (
                        <CircularProgress color="black" />
                    ) : (
                        <BlackButton onClick={loginApiCall}>Login</BlackButton>
                    )}
                </Paper>
            </Box>
        </ThemeProvider>
    );
}

export default Login;
