import { Typography, Stack, Avatar } from "@mui/material";
import BlackButton from "./buttons/BlackButton";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";

function AppMenu(props) {
    const navigate = useNavigate();
    return (
        <Paper
            elevation="6"
            sx={{
                width: "90%",
                marginLeft: "auto",
                marginRight: "auto",
            }}
        >
            <Stack
                direction="column"
                justifyContent="top"
                alignItems="center"
                sx={{
                    borderRadius: "1em",
                    marginTop: "2em",
                    padding: "2em",
                    boxSizing: "border-box",
                }}
                height="inherit"
            >
                <Avatar sx={{ width: "3.5em", height: "3.5em" }} />
                <Typography
                    variant="h6"
                    fontWeight="fontWeightMedium"
                    marginTop="0.5em"
                    marginBottom="1em"
                >
                    {props.username}
                </Typography>
                <BlackButton
                    marginBottom="1em"
                    width="90%"
                    onClick={props.downloadFunc}
                >
                    Download report as PDF
                </BlackButton>
                <BlackButton marginBottom="1em" width="90%">
                    Email PDF report
                </BlackButton>
                {props.children}
                <BlackButton
                    marginBottom="1em"
                    width="90%"
                    onClick={() => navigate("/welcome")}
                >
                    Back to homepage
                </BlackButton>
            </Stack>
        </Paper>
    );
}

export default AppMenu;
