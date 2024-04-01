import { Typography, Stack, Avatar } from '@mui/material';
import YellowButton from './buttons/YellowButton';

function AppMenu(props) {

    return (
        <Stack
            direction="column"
            justifyContent="top" alignItems="center" sx={{ backgroundColor: 'yellow.main', borderRadius: '1em', paddingTop: '2em', boxSizing: 'border-box' }} height='inherit'
        >
            <Avatar sx={{ width: '3.5em', height: '3.5em' }} />
            <Typography variant='h6' fontWeight='fontWeightMedium' marginBottom='1em' >{props.username}</Typography>
            <YellowButton marginBottom='1em' width='90%' onClick={props.downloadFunc}>Download report as PDF</YellowButton>
            <YellowButton marginBottom='1em' width='90%'>Email PDF report</YellowButton>
            {props.children}

        </Stack>
    );
}

export default AppMenu;