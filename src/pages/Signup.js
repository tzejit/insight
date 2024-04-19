import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { ThemeProvider } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";

import { signUp, confirmSignUp } from "aws-amplify/auth";

import InsightTitle from "../components/typography/InsightTitle";
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
            {showOTPVerification ? (
                <Box
                    sx={{
                        backgroundColor: "yellow.secondary",
                        flexDirection: "column",
                    }}
                    height="100vh"
                    width="100vw"
                    display="flex"
                    justifyContent="space-evenly"
                    alignItems="center"
                >
                    <InsightTitle />
                    <Stack
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
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
                        {error ? <Alert severity="error">{error}</Alert> : ""}
                    </Stack>
                    <BlackButton
                        onClick={async () => {
                            await handleSignUpConfirmation();
                        }}
                    >
                        Verify
                    </BlackButton>
                </Box>
            ) : (
                <Box
                    sx={{
                        backgroundColor: "yellow.secondary",
                        flexDirection: "column",
                    }}
                    height="100vh"
                    width="100vw"
                    display="flex"
                    justifyContent="space-evenly"
                    alignItems="center"
                >
                    <InsightTitle />
                    <Stack
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <Box width="100%">
                            <Typography
                                color="black"
                                variant="body1"
                                fontWeight="fontWeightMedium"
                                align="left"
                            >
                                Email
                            </Typography>
                        </Box>
                        <TextFieldYellow
                            id="usernameField"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        {/* <Box width="100%">
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
                        /> */}
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
                            id="passwordField"
                            type="password"
                        />
                        {error ? <Alert severity="error">{error}</Alert> : ""}
                    </Stack>
                    <BlackButton
                        onClick={async () => {
                            await handleSignUp();
                        }}
                    >
                        Signup
                    </BlackButton>
                </Box>
            )}
        </ThemeProvider>
    );
}

export default Signup;
