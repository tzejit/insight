import { Link } from "react-router-dom";

import Grid from "@mui/material/Grid";
import { ThemeProvider } from "@mui/material/styles";
import { Typography, Box } from "@mui/material";
import Stack from "@mui/material/Stack";

import InsightTitle from "../components/typography/InsightTitle";
import BlackButton from "../components/buttons/BlackButton";
import theme from "../components/themes/MainTheme";
import "./landing.css";

function Landing() {
    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{ backgroundColor: "yellow.secondary" }}
                height="100vh"
                width="100vw"
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <Stack justifyContent="center" alignItems="center">
                    <Typography
                        color="black"
                        variant="h3"
                        fontWeight="fontWeightMedium"
                        margin="1rem"
                    >
                        Ready
                    </Typography>
                    <Typography
                        color="black"
                        variant="h3"
                        fontWeight="fontWeightMedium"
                        margin="1rem"
                    >
                        Set
                    </Typography>
                    <InsightTitle />

                    <Grid
                        container
                        spacing="5em"
                        justifyContent="center"
                        alignItems="center"
                        padding="5em"
                    >
                        <Grid item xs="auto">
                            <Link to="login">
                                <BlackButton>Login</BlackButton>
                            </Link>
                        </Grid>
                        <Grid item xs="auto">
                            <Link to="signup">
                                <BlackButton>Sign up</BlackButton>
                            </Link>
                        </Grid>
                    </Grid>
                </Stack>
            </Box>
        </ThemeProvider>
    );
}

export default Landing;
