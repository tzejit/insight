import Typography from '@mui/material/Typography';

function AnalyticsHeader(props) {
    return <Typography color="white" variant={props.variant} fontWeight='fontWeightMedium' textAlign='center'>{props.children}</Typography>
}

export default AnalyticsHeader;