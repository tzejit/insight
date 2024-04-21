import { Link } from "react-router-dom";

import Grid from "@mui/material/Grid";
import { ThemeProvider } from "@mui/material/styles";
import { Typography, Box } from "@mui/material";
import Stack from "@mui/material/Stack";
import CssBaseline from "@mui/material/CssBaseline";

import {
    InsightTitleFontFamily,
    InsightTitle,
} from "../components/typography/InsightTitle";
import BlackButton from "../components/buttons/BlackButton";
import theme from "../components/themes/MainTheme";
import logo from "../assets/InSight Logo_edited_color.webp";
import "./landing.css";

function Landing() {
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
                <Stack justifyContent="center" alignItems="center">
                    <img src={logo} width="250"></img>
                    <Typography
                        color="black"
                        variant="h4"
                        sx={{ opacity: "50%" }}
                        fontWeight="200"
                        fontStyle="italic"
                        fontFamily={InsightTitleFontFamily}
                        margin="0.5rem"
                    >
                        Ready
                    </Typography>
                    <Typography
                        color="black"
                        variant="h3"
                        sx={{ opacity: "75%" }}
                        fontWeight="300"
                        fontStyle="italic"
                        fontFamily={InsightTitleFontFamily}
                        margin="0.5rem"
                    >
                        Set
                    </Typography>
                    <InsightTitle is_animated />

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
