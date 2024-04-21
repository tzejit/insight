import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import "./insight.css";

// This font is used in the landing page as well for "Ready... Set..."
const InsightTitleFontFamily = "Inter Tight";

function InsightTitle(props) {
    const should_animate = props.is_animated;
    return (
        <Stack justifyContent="center" alignItems="center">
            {should_animate ? (
                <Typography
                    color="black"
                    variant="h1"
                    fontWeight="fontWeightBold"
                    fontFamily={InsightTitleFontFamily}
                    margin="0.5rem"
                    sx={{
                        background:
                            "linear-gradient(to left, #000000, #000000, #000000, #000000, #000000, #fcc010)",
                        backgroundSize: "200% auto",
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        WebkitBackgroundClip: "text",
                        animation: "shine 5s linear infinite",
                        "@keyframes shine": {
                            "0%": {
                                backgroundPosition: "0% center",
                            },
                            "100%": {
                                backgroundPosition: "200% center",
                            },
                        },
                    }}
                >
                    InSight
                </Typography>
            ) : (
                <Typography
                    color="black"
                    variant="h1"
                    fontWeight="fontWeightBold"
                    fontFamily={InsightTitleFontFamily}
                    margin="0.5rem"
                    sx={{
                        background: "linear-gradient(to top, #000000, #434343)",
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        WebkitBackgroundClip: "text",
                    }}
                >
                    InSight
                </Typography>
            )}
        </Stack>
    );
}

export { InsightTitleFontFamily, InsightTitle };
