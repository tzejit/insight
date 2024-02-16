import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

function GraphTitle(props) {
    return(
    <Box>
        <Typography color="brown.main" variant={props.variant} fontWeight='fontWeightMedium' paddingLeft='0.5em'>{props.children}</Typography>
    </Box>
    ) 

}

export default GraphTitle;