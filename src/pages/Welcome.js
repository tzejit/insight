import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import { ThemeProvider } from "@mui/material/styles";
import { Typography, Avatar, Box } from "@mui/material";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import CssBaseline from "@mui/material/CssBaseline";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// import { v4 as uuidv4 } from "uuid";

import "./landing.css";
import theme from "../components/themes/MainTheme";
import BlackButton from "../components/buttons/BlackButton";
import { InsightTitle } from "../components/typography/InsightTitle";

import TextFieldYellow from "../components/inputs/TextFieldYellow";
import { submit_job, start_job_polling } from "../hooks/jobManagement";
import { upload_file } from "../hooks/dataManagement";
import { fetch_user_auth_status, do_sign_out } from "../hooks/auth";
import { Cloud } from "@mui/icons-material";

function Welcome() {
    // const [authed, payload, uuid] = useAuth();
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState("");
    const [awsId, setAwsId] = useState("");
    const [fileName, setFileName] = useState("");
    const [latestJobId, setLatestJobId] = useState("");
    const [productName, setProductName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const inputRef = useRef(null);
    const navigate = useNavigate();

    async function logout() {
        try {
            await do_sign_out();
            navigate("/");
        } catch (error) {
            console.error("Error signing out", error);
        }
    }

    function handle_input() {
        console.debug("Handling input");
        const newFileName = inputRef.current.value.split("\\").slice(-1)[0];
        setFileName(newFileName);
        console.debug("File name", newFileName);
    }

    function handle_drop(e) {
        e.preventDefault();
        inputRef.current.files = e.dataTransfer.files;
        handle_input();
    }

    async function handle_upload() {
        const fileId = fileName; // with or without .csv (doesn't matter)
        const file = inputRef.current.files[0];
        // TODO: (low) Verify that file uploaded is a CSV
        if (productName === "") {
            setError("Product name is empty");
            return;
        }
        setError("");

        try {
            // File upload does NOT automatically trigger a processing job
            // Refer to submit_job below
            setLoading(true);
            await upload_file(fileId, file);

            // Create a callback for the job status subscription later on
            // TODO: (medium) Change this to show the user the status of the job
            const job_progress_callback = (data) => {
                if (data === "COMPLETED" || data === "FAILED") {
                    setLoading(false);
                    setSuccess(true);
                }
            };

            // Create a job with the submitted file
            const jobId = await submit_job(userId, awsId, fileId, productName);
            setLatestJobId(jobId);

            // The callback is automatically attached to the job status subscription
            // The callback is called whenever there is a CHANGE in the job status
            // Feel free to change the delay (currently 5 seconds)
            start_job_polling(jobId, 5, job_progress_callback);
        } catch (error) {
            console.exception(error);
        }

        // You can use this to get a list of all jobs submitted by user
        // const job_list = await list_jobs(userId);
        // console.info("Current jobs", job_list);
    }

    // RUN BEFORE PAGE LOADS
    const pageLoadAuthVerification = async () => {
        console.info("Running pre-page load check");
        const user_auth_status = await fetch_user_auth_status();
        if (user_auth_status.is_authed) {
            console.info("User is correctly authenticated");
            setUsername(user_auth_status.username);
            setUserId(user_auth_status.userId);
            setAwsId(user_auth_status.awsId);
        } else {
            console.warn("User at welcome page but not logged in");
            navigate("/error");
        }
    };
    useEffect(() => {
        pageLoadAuthVerification();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                height="100vh"
                width="80vw"
                margin="auto auto auto auto"
                spacing={1}
            >
                <Grid item xs={6} height="100%">
                    <Stack
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            borderRadius: "1em",
                        }}
                        height="100%"
                    >
                        <InsightTitle />
                        <Avatar
                            sx={{
                                width: "6em",
                                height: "6em",
                                marginBottom: "1em",
                                marginTop: "1em",
                            }}
                        />
                        <Typography
                            variant="h6"
                            id="Username"
                            fontWeight="fontWeightMedium"
                        >
                            {username}
                        </Typography>
                        <Typography
                            variant="body1"
                            marginBottom="5em"
                            fontWeight="fontWeightLight"
                        >
                            Subscription: Premium
                        </Typography>
                        <BlackButton margin="1em" width="20rem">
                            View or edit profile
                        </BlackButton>
                        <br />
                        <BlackButton margin="1em" width="20rem">
                            View or edit subscription details
                        </BlackButton>
                        <BlackButton
                            margin="1em"
                            width="20rem"
                            onClick={() => logout()}
                        >
                            Logout
                        </BlackButton>
                    </Stack>
                </Grid>
                <Grid item xs={6} height="100%">
                    <Stack
                        justifyContent="center"
                        alignItems="center"
                        gap="1em"
                        height="100%"
                        display="flex"
                    >
                        <Paper elevation="6" sx={{ width: "60%" }}>
                            <Box
                                justifyContent="center"
                                alignItems="center"
                                padding="2.5em 1em"
                                // borderRadius="1em"
                                // boxSizing="border-box"
                                display="flex"
                                flexDirection="column"
                                onDrop={(e) => handle_drop(e)}
                                onDragOver={(e) => e.preventDefault()}
                            >
                                <input
                                    key="file_input"
                                    id="file"
                                    name="file"
                                    type="file"
                                    hidden
                                    ref={inputRef}
                                    onChange={handle_input}
                                />
                                <Typography
                                    variant="h5"
                                    fontWeight="fontWeightMedium"
                                    marginBottom="1em"
                                    align="center"
                                >
                                    Start a new InSight report
                                </Typography>
                                <Typography
                                    variant="body1"
                                    fontWeight="fontWeightLight"
                                    marginBottom="1em"
                                    align="center"
                                >
                                    <i>
                                        {fileName
                                            ? fileName
                                            : "To start a new report, upload your files by dragging and dropping into this area or clicking the button below."}
                                    </i>
                                </Typography>
                                {fileName ? (
                                    <TextFieldYellow
                                        placeholder="Product name"
                                        onChange={(e) =>
                                            setProductName(e.target.value)
                                        }
                                    />
                                ) : (
                                    ""
                                )}
                                {error ? (
                                    <Alert severity="error">{error}</Alert>
                                ) : (
                                    ""
                                )}
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <BlackButton
                                        onClick={() => inputRef.current.click()}
                                    >
                                        <span
                                            style={{ display: "inline-flex" }}
                                        >
                                            <CloudUploadIcon
                                                sx={{ marginRight: "0.25em" }}
                                            />{" "}
                                            Upload file
                                        </span>
                                    </BlackButton>
                                    {fileName ? (
                                        <Box
                                            sx={{ m: 1, position: "relative" }}
                                        >
                                            <BlackButton
                                                onClick={
                                                    success
                                                        ? () =>
                                                              navigate(
                                                                  "/dashboard"
                                                              )
                                                        : handle_upload
                                                }
                                                padding="auto"
                                                disabled={loading}
                                            >
                                                {success ? "View" : "Submit"}
                                            </BlackButton>
                                            {loading && (
                                                <CircularProgress
                                                    size={24}
                                                    sx={{
                                                        position: "absolute",
                                                        top: "50%",
                                                        left: "50%",
                                                        marginTop: "-12px",
                                                        marginLeft: "-12px",
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    ) : (
                                        ""
                                    )}
                                </Box>
                            </Box>
                        </Paper>
                        <Paper elevation="6" sx={{ width: "60%" }}>
                            <Box
                                justifyContent="center"
                                alignItems="center"
                                padding="2.5em 1em"
                                borderRadius="1em"
                                boxSizing="border-box"
                                display="flex"
                                flexDirection="column"
                            >
                                <Typography
                                    variant="h5"
                                    fontWeight="fontWeightMedium"
                                    marginBottom="1em"
                                    align="center"
                                >
                                    View a historic InSight report
                                </Typography>
                                <Typography
                                    variant="body1"
                                    fontWeight="fontWeightLight"
                                    marginBottom="1em"
                                    align="center"
                                >
                                    <i>
                                        You can access all past reports and
                                        download them from here.
                                    </i>
                                </Typography>
                                <BlackButton
                                    onClick={() => navigate("/history")}
                                    padding="auto"
                                >
                                    View history
                                </BlackButton>
                            </Box>
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default Welcome;
