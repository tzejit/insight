import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Grid from "@mui/material/Grid";
import { ThemeProvider } from "@mui/material/styles";
import { Typography, Box } from "@mui/material";
import Stack from "@mui/material/Stack";

import AppMenu from "../components/AppMenu";
import theme from "../components/themes/MainTheme";
import BlackButton from "../components/buttons/BlackButton";
import AppTable from "../components/graphs/AppTable";
import YellowButton from "../components/buttons/YellowButton";
import { do_sign_out, fetch_user_auth_status } from "../hooks/auth";
import "./landing.css";
import {
    get_job,
    list_jobs,
} from "../hooks/jobManagement";

function History() {
    const navigate = useNavigate();
    const [jobList, setJobList] = useState(null);

    // RUN BEFORE PAGE LOADS
    useEffect(() => {
        async function fetchHistory() {
            console.info("Running pre-page load check");
            const user_auth_status = await fetch_user_auth_status();
            if (!user_auth_status.is_authed) {
                console.info("User at History but not logged in");
                navigate("/error");
            } else {
                const userId = user_auth_status.userId;
                const jobs = await list_jobs(userId);
                const tempJobList = []
                for (let e in jobs){
                    let job = await get_job(jobs[e].id);
                    tempJobList.push({date: job.createdAt, title: job.job_name, file: job.file_id, name: job.job_config.product_name, id:jobs[e].id})
                }

                setJobList(tempJobList)
            } 
        }
        fetchHistory()
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
            >
                <Grid item xs={3} height="100%">
                    <AppMenu>
                        <YellowButton width="90%">Delete report</YellowButton>
                        <Box height="0.5em"></Box>
                        <BlackButton width="90%">
                            Generate new InSight report
                        </BlackButton>
                    </AppMenu>
                </Grid>
                <Grid item xs={9} height="100%">
                    <Stack alignItems="center" height="100%" spacing={2}>
                        <Box
                            width="100%"
                            justifyContent="center"
                            alignItems="center"
                            sx={{
                                backgroundColor: "grey.main",
                                borderRadius: "0.5em",
                                padding: "0.2em 0",
                            }}
                        >
                            <Typography
                                variant="h5"
                                fontWeight="fontWeightMedium"
                                align="center"
                            >
                                Overview of past generated InSight reports
                            </Typography>
                        </Box>
                        <Box
                            width="100%"
                            height="100%"
                            justifyContent="center"
                            alignItems="center"
                            sx={{
                                backgroundColor: "yellow.main",
                                borderRadius: "0.5em",
                                boxSizing: "border-box",
                                padding: "1em",
                            }}
                        >
                            <Box
                                height="inherit"
                                backgroundColor="yellow.secondary"
                                alignItems="center"
                                padding="2.5em 1em"
                                borderRadius="0.5em"
                                boxSizing="border-box"
                            >
                                <AppTable rows={jobList}/>
                            </Box>
                        </Box>
                    </Stack>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default History;
