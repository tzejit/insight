import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import { ThemeProvider } from "@mui/material/styles";
import { Typography, Avatar, Box } from "@mui/material";
import Stack from "@mui/material/Stack";
import CircularProgress from '@mui/material/CircularProgress';


// import { v4 as uuidv4 } from "uuid";

import "./landing.css";
import theme from "../components/themes/MainTheme";
import YellowButton from "../components/buttons/YellowButton";
import BlackButton from "../components/buttons/BlackButton";

import TextFieldYellow from "../components/inputs/TextFieldYellow";
import {
    submit_job,
    get_job,
    start_job_polling,
    list_jobs,
} from "../hooks/jobManagement";
import {
    upload_file,
    get_result,
    get_result_url,
} from "../hooks/dataManagement";
import { fetch_auth, fetch_user_auth_status, do_sign_out } from "../hooks/auth";

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
        if (productName === '') {
            setError('Product name is empty');
            return
        }
        setError('');

        try {
            // File upload does NOT automatically trigger a processing job
            // Refer to submit_job below
            setLoading(true);
            await upload_file(fileId, file);
            
            // Create a callback for the job status subscription later on
            // TODO: (medium) Change this to show the user the status of the job
            const job_progress_callback = (data) => {
                if (data == "COMPLETED" || data == "FAILED") {
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
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                height="100vh"
                padding="1em"
                spacing={1}
                backgroundColor="blue.main"
            >
                <Grid item xs={6} height="100%">
                    <Stack
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            backgroundColor: "yellow.secondary",
                            borderRadius: "1em",
                        }}
                        height="100%"
                    >
                        <Typography
                            variant="h5"
                            fontWeight="fontWeightMedium"
                            marginBottom="1em"
                        >
                            Welcome to InSight!
                        </Typography>
                        <Avatar
                            sx={{
                                width: "6em",
                                height: "6em",
                                marginBottom: "1em",
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
                        <BlackButton marginBottom="1em" width="20rem">
                            View or edit profile
                        </BlackButton>
                        <br/>
                        <BlackButton marginBottom="1em" width="20rem">
                            View or edit Subscription details
                        </BlackButton>
                    </Stack>
                </Grid>
                <Grid item xs={6} height="100%">
                    <Stack
                        justifyContent="space-evenly"
                        alignItems="center"
                        sx={{
                            backgroundColor: "yellow.secondary",
                            borderRadius: "1em",
                        }}
                        height="100%"
                    >
                        <Box
                            width="70%"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Avatar
                                sx={{
                                    width: "3em",
                                    height: "3em",
                                    margin: "0 auto -1.5em auto",
                                }}
                            />
                            <Box
                                backgroundColor="blue.main"
                                justifyContent="center"
                                alignItems="center"
                                padding="2.5em 1em"
                                borderRadius="1em"
                                boxSizing="border-box"
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
                                    color="white"
                                    align="center"
                                >
                                    Start a new InSight report
                                </Typography>
                                <Typography
                                    variant="body1"
                                    fontWeight="fontWeightLight"
                                    marginBottom="1em"
                                    color="white"
                                    align="center"
                                >
                                    <i>
                                        {fileName
                                            ? fileName
                                            : "To start a new report, upload your files by dragging and dropping into this area or clicking the button below"}
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
                                {error ? <Alert severity="error">{error}</Alert> : ""}
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <YellowButton
                                        onClick={() => inputRef.current.click()}
                                        padding="auto"
                                    >
                                        Upload
                                    </YellowButton>
                                    {fileName ? (
                                        <Box sx={{ m: 1, position: 'relative' }}>
                                            <YellowButton
                                                onClick={success ? () => navigate('/dashboard') : handle_upload}
                                                padding="auto"
                                                disabled={loading}
                                            >
                                                {success ? 'View' : 'Submit'}
                                            </YellowButton>
                                            {loading && (
                                                <CircularProgress
                                                    size={24}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        marginTop: '-12px',
                                                        marginLeft: '-12px',
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    ) : (
                                        ""
                                    )}

                                </Box>
                            </Box>
                        </Box>
                        <Box
                            width="70%"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Avatar
                                sx={{
                                    width: "3em",
                                    height: "3em",
                                    margin: "0 auto -1.5em auto",
                                }}
                            />
                            <Box
                                backgroundColor="blue.main"
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
                                    color="white"
                                    align="center"
                                >
                                    View a historic InSight report
                                </Typography>
                                <Box>
                                    <YellowButton
                                        onClick={() => navigate("/history")}
                                        padding="auto"
                                    >
                                        View history
                                    </YellowButton>
                                </Box>
                            </Box>
                        </Box>
                        <BlackButton width="70%" onClick={() => logout()}>
                            Logout
                        </BlackButton>
                    </Stack>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default Welcome;
