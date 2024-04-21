import { useNavigate } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import { Typography, Box } from "@mui/material";
import Stack from "@mui/material/Stack";
import CssBaseline from "@mui/material/CssBaseline";

import theme from "../components/themes/MainTheme";
import BlackButton from "../components/buttons/BlackButton";

function Error() {
    const navigate = useNavigate();
    async function backHome() {
        navigate("/");
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                height="100vh"
                width="100vw"
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <Stack
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        borderRadius: "1em",
                    }}
                    height="100%"
                >
                    <Typography
                        color="black"
                        variant="h3"
                        fontWeight="fontWeightMedium"
                        margin="1rem"
                    >
                        You are not logged in.
                    </Typography>
                    <BlackButton
                        marginBottom="1em"
                        width="20rem"
                        onClick={() => backHome()}
                    >
                        Return to login page
                    </BlackButton>
                </Stack>
            </Box>
        </ThemeProvider>
    );
}

export default Error;
