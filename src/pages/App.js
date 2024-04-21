import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { HashLink as Link } from "react-router-hash-link";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import { Typography } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import AppMenu from "../components/AppMenu";
import Analytics from "../components/Analytics";
import theme from "../components/themes/MainTheme";
import { do_sign_out, fetch_user_auth_status } from "../hooks/auth";
import "./app.css";
import { get_result, get_raw_result } from "../hooks/dataManagement";
import { list_jobs } from "../hooks/jobManagement";

function App() {
    const pdfRef = useRef(null);
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState("");
    const [results, setResults] = useState("");
    const [rawResults, setRawResults] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();

    const handleDownloadPDF = () => {
        html2canvas(pdfRef.current).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF();

            const width = pdf.internal.pageSize.getWidth();
            const height = pdf.internal.pageSize.getHeight();
            const widthRatio = width / canvas.width;
            const heightRatio = height / canvas.height;
            const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

            pdf.addImage(
                imgData,
                "PNG",
                0,
                0,
                canvas.width * ratio,
                canvas.height * ratio
            );
            pdf.save("downloaded-file.pdf");
        });
    };

    // RUN BEFORE PAGE LOADS
    const pageLoadAuthVerification = async () => {
        console.info("Running pre-page load check");
        const user_auth_status = await fetch_user_auth_status();
        if (user_auth_status.is_authed) {
            setUsername(user_auth_status.username);
            setUserId(user_auth_status.userId);
        } else {
            console.warn("User at app but not logged in");
            navigate("/error");
        }
    };
    useEffect(() => {
        async function fetchResult() {
            await pageLoadAuthVerification();
            let id = searchParams.get("id");
            if (!id) {
                const latestJob = await list_jobs(userId);
                id = latestJob[0].id;
            }
            let res = await get_result(id);
            let rawres = await get_raw_result(id);
            setResults(JSON.parse(res));
            setRawResults(JSON.parse(rawres));
        }
        fetchResult();
    }, []);

    const logout = async () => {
        await do_sign_out();
        navigate("/");
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box>
                <Grid container spacing={1} padding="2em 1em">
                    <Grid
                        item
                        xs={3}
                        sx={{
                            position: "sticky",
                            top: "1em",
                            alignSelf: "start",
                        }}
                    >
                        <AppMenu
                            downloadFunc={handleDownloadPDF}
                            logoutFunc={logout}
                            username={username}
                        >
                            <Box
                                height="inherit"
                                backgroundColor="secondary"
                                alignItems="center"
                                padding="0.5em 1em"
                                borderRadius="0.5em"
                                boxSizing="border-box"
                                width="90%"
                                margin="0.5em 0em"
                            >
                                <Box>
                                    <Typography variant="h6">
                                        Navigation pane
                                    </Typography>
                                </Box>
                                <Box>
                                    <Link
                                        to="/dashboard#reportoverview"
                                        className="black"
                                    >
                                        <Typography fontWeight="fontWeightMedium">
                                            Report and data overview
                                        </Typography>
                                    </Link>
                                </Box>

                                <ul>
                                    <li>
                                        <Link
                                            to="/dashboard#kwsentiment"
                                            className="black"
                                        >
                                            Keyword sentiment
                                        </Link>
                                    </li>
                                </ul>
                                <Box>
                                    <Link
                                        to="/dashboard#productselection"
                                        className="black"
                                    >
                                        <Typography fontWeight="fontWeightMedium">
                                            Product selection
                                        </Typography>
                                    </Link>
                                </Box>
                                <ul>
                                    <li>
                                        <Link
                                            to="/dashboard#positivekw"
                                            className="black"
                                        >
                                            Top 5 positive keywords
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/dashboard#negativekw"
                                            className="black"
                                        >
                                            Top 5 negative keywords
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/dashboard#neutralkw"
                                            className="black"
                                        >
                                            Top 5 neutral keywords
                                        </Link>
                                    </li>
                                    {/* <li>
                                        <Link
                                            to="/dashboard#positiveevaluation"
                                            className="black"
                                        >
                                            <Typography>
                                                Evaluation criteria for positive
                                                reviews
                                            </Typography>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/dashboard#negativeevaluation"
                                            className="black"
                                        >
                                            <Typography>
                                                Evaluation criteria for negative
                                                reviews
                                            </Typography>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/dashboard#positivequalitative"
                                            className="black"
                                        >
                                            <Typography>
                                                Qualitative review for positive
                                                sentiment
                                            </Typography>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/dashboard#negativequalitative"
                                            className="black"
                                        >
                                            <Typography>
                                                Qualitative review for negative
                                                sentiment
                                            </Typography>
                                        </Link>
                                    </li> */}
                                </ul>
                                {/* <Box>
                                    <Link
                                        to="/dashboard#recommendation"
                                        className="black"
                                    >
                                        <Typography fontWeight="fontWeightMedium">
                                            Recommendation
                                        </Typography>
                                    </Link>
                                </Box> */}
                            </Box>
                        </AppMenu>
                    </Grid>
                    <Grid item xs={9}>
                        <Analytics
                            refProp={pdfRef}
                            data={results}
                            rawData={rawResults}
                        />
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    );
}

export default App;
