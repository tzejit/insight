import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { ThemeProvider } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";

import { signUp, confirmSignUp } from "aws-amplify/auth";

import { InsightTitle } from "../components/typography/InsightTitle";
import TextFieldYellow from "../components/inputs/TextFieldYellow";
import BlackButton from "../components/buttons/BlackButton";
import theme from "../components/themes/MainTheme";

function Signup() {
    const navigate = useNavigate();

    const [username, setUsername] = useState(""); // username refers to email now, we no longer have conventional usernames
    const [password, setPassword] = useState("");
    // const [email, setEmail] = useState("");
    const [isSignupSuccess, setSignupSuccess] = useState("");
    const [confirmationCode, setConfirmationCode] = useState(""); // renamed from otp for convenience
    const [error, setError] = useState("");
    const [showOTPVerification, setShowOTPVerification] = useState(false);

    async function handleSignUpConfirmation() {
        try {
            const { isSignUpComplete, nextStep } = await confirmSignUp({
                username,
                confirmationCode,
            });
            setSignupSuccess(isSignUpComplete);

            if (isSignUpComplete) {
                navigate("/login");
            } else {
                console.warn("Wrong OTP!");
                setError("Wrong OTP. Please try again.");
            }
        } catch (error) {
            console.error("Error confirming sign up", error);
            setError(error.message);
        }
    }

    // From https://docs.amplify.aws/javascript/build-a-backend/auth/enable-sign-up/
    async function handleSignUp() {
        try {
            const { isSignUpComplete, userId, nextStep } = await signUp({
                username,
                password,
                options: {
                    // optional
                    autoSignIn: true, // or SignInOptions e.g { authFlowType: "USER_SRP_AUTH" }
                },
            });
            // nextStep.signUpStep has values ("DONE" | "CONFIRM_SIGN_UP" | "COMPLETE_AUTO_SIGN_IN")
            switch (nextStep.signUpStep) {
                case "CONFIRM_SIGN_UP":
                    setShowOTPVerification(true);
                    console.info(`${userId} tried sign-up, awaiting OTP`);
                    break;
                case "DONE":
                    setShowOTPVerification(false);
                    console.info(`Signed up ${userId} successfully!`);
                    break;
                default:
                    setShowOTPVerification(false);
                    console.warn(`${userId} failed to sign up!`);
            }
        } catch (error) {
            console.error("Error signing up", error);
            setError(error.message);
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {showOTPVerification ? (
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
                            justifyContent="center"
                            alignItems="center"
                            spacing={2}
                            sx={{
                                marginTop: "2em",
                                marginBottom: "2em",
                            }}
                        >
                            <Box width="100%">
                                <Typography
                                    color="black"
                                    variant="body1"
                                    fontWeight="fontWeightMedium"
                                    align="left"
                                >
                                    Enter verification code sent to {username}
                                </Typography>
                            </Box>
                            <TextFieldYellow
                                id="otpTextField"
                                placeholder="Enter OTP"
                                onChange={(e) =>
                                    setConfirmationCode(e.target.value)
                                }
                            />
                            {error ? (
                                <Alert severity="error">{error}</Alert>
                            ) : (
                                ""
                            )}
                        </Stack>
                        <BlackButton
                            onClick={async () => {
                                await handleSignUpConfirmation();
                            }}
                        >
                            Verify
                        </BlackButton>
                    </Paper>
                </Box>
            ) : (
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
                            justifyContent="center"
                            alignItems="center"
                            spacing={2}
                            sx={{
                                marginTop: "2em",
                                marginBottom: "2em",
                            }}
                        >
                            <Typography>
                                Create a new account with us for a one week free
                                trial.
                            </Typography>
                            <Typography
                                color="black"
                                variant="body1"
                                fontWeight="fontWeightMedium"
                                align="left"
                            ></Typography>
                            <TextFieldYellow
                                id="usernameField"
                                placeholder="Email"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextFieldYellow
                                onChange={(e) => setPassword(e.target.value)}
                                id="passwordField"
                                placeholder="New password"
                                type="password"
                            />
                            {error ? (
                                <Alert severity="error">{error}</Alert>
                            ) : (
                                ""
                            )}
                        </Stack>
                        <BlackButton
                            onClick={async () => {
                                await handleSignUp();
                            }}
                        >
                            Signup
                        </BlackButton>
                    </Paper>
                </Box>
            )}
        </ThemeProvider>
    );
}

export default Signup;
