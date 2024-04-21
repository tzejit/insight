import { ViewHeadline } from "@mui/icons-material";
import { createTheme } from "@mui/material";

const theme = createTheme({
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    bottom: 0,
                    marginBottom: 0,
                    paddingBottom: 0,
                    height: "100vh",
                    backgroundColor: "#FAACA8",
                    backgroundImage:
                        "linear-gradient(to top, #dcd9d6, #ffffff)",
                    backgroundAttachment: "fixed",
                },
            },
        },
    },
    palette: {
        primary: { main: "#f2f2f2" },
        secondary: { main: "#fcfbfa", contrastText: "#000000" },
        accent: {
            main: "#fcc010",
        },
        yellow: {
            main: "#1E1E1E",
            secondary: "#FCFBFA",
            contrastText: "#000000",
            light: "#ECECEC",
        },
        grey: { main: "#D9D9D9" },
        brown: { main: "#420D0D" },
        blue: { main: "#020D28" },
        black: { main: "#101010", hover: "#fcc010", contrastText: "#ffffff" },
        chartpos: { main: "#5FA2E0" },
        chartneg: { main: "#020D28" },
        chartneu: { main: "#A7A5A5" },
    },
    typography: {
        fontFamily: "Open Sans",
        button: {
            textTransform: "none",
            flexDirection: "column",
        },
    },
});

export default theme;
