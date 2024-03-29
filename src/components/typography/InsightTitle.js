import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import './insight.css'
function InsightTitle(props) {
    return(
    <Stack justifyContent="center" alignItems="center">

        <div className='rectangle'>
            <Typography color='black' variant='h3' fontWeight='fontWeightMedium' margin='1rem' sx={{ fontStyle: 'italic' }}>InSight</Typography>
        </div>
        <div className='rectangle2'/>    
    </Stack>
    ) 

}

export default InsightTitle;