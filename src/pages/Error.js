import { useNavigate } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import { Typography, Box } from "@mui/material";
import Stack from "@mui/material/Stack";

import theme from "../components/themes/MainTheme";
import YellowButton from "../components/buttons/YellowButton";

function Error() {
    const navigate = useNavigate();
    async function backHome() {
        navigate("/");
    }

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{ backgroundColor: "yellow.main" }}
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
                        backgroundColor: "yellow.main",
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
                    <YellowButton
                        marginBottom="1em"
                        width="20rem"
                        onClick={() => backHome()}
                    >
                        Return to login page
                    </YellowButton>
                </Stack>
            </Box>
        </ThemeProvider>
    );
}

export default Error;
