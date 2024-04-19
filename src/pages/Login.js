import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";

import { signIn } from "aws-amplify/auth";

import InsightTitle from "../components/typography/InsightTitle";
import BlackButton from "../components/buttons/BlackButton";
import TextFieldYellow from "../components/inputs/TextFieldYellow";
import theme from "../components/themes/MainTheme";
import { fetch_user_auth_status, do_sign_out } from "../hooks/auth";

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function loginApiCall() {
        try {
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
            navigate("/welcome");
        } catch (error) {
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
            <Box
                sx={{ backgroundColor: "yellow.secondary", flexDirection: "column" }}
                height="100vh"
                width="100vw"
                display="flex"
                justifyContent="space-evenly"
                alignItems="center"
            >
                <InsightTitle />
                <Stack justifyContent="center" alignItems="center" spacing={2}>
                    <Box width="100%">
                        <Typography
                            color="black"
                            variant="body1"
                            fontWeight="fontWeightMedium"
                            align="left"
                        >
                            Username
                        </Typography>
                    </Box>
                    <TextFieldYellow
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Box width="100%">
                        <Typography
                            color="black"
                            variant="body1"
                            fontWeight="fontWeightMedium"
                            align="left"
                        >
                            Password
                        </Typography>
                    </Box>
                    <TextFieldYellow
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                    />
                    {error ? <Alert severity="error">{error}</Alert> : ""}
                </Stack>
                <BlackButton onClick={loginApiCall}>Login</BlackButton>
            </Box>
        </ThemeProvider>
    );
}

export default Login;
