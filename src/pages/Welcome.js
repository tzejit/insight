import Grid from '@mui/material/Grid';
import { ThemeProvider } from '@mui/material/styles';
import { Typography, Avatar, Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import './landing.css'
import theme from '../components/themes/MainTheme';
import YellowButton from '../components/buttons/YellowButton';


function Welcome() {
  return (
    <ThemeProvider theme={theme}>
            <Grid container justifyContent="center" alignItems="center" height='100vh' padding='1em' spacing={1} >
                <Grid item xs={6} height='100%'>
                    <Stack justifyContent="center" alignItems="center" sx={{backgroundColor: 'yellow.main', borderRadius: '1em' }} height='100%'>
                        <Typography variant='h5' fontWeight='fontWeightMedium' marginBottom='1em'>Welcome to InSight!</Typography>
                        <Avatar sx={{ width: '6em', height: '6em', marginBottom: '1em' }}/>
                        <Typography variant='h6' fontWeight='fontWeightMedium' >Eva Smith</Typography>
                        <Typography variant='body1' marginBottom='5em' fontWeight='fontWeightLight'>Subscription: Premium</Typography>
                        <YellowButton marginBottom='1em' width="20rem">View or edit profile</YellowButton>
                        <YellowButton marginBottom='1em' width="20rem">View or edit Subscription details</YellowButton>

                    </Stack>
                </Grid>
                <Grid item xs={6} height='100%'>
                    <Stack justifyContent="space-evenly" alignItems="center" sx={{backgroundColor: 'yellow.main',  borderRadius: '1em'}} height='100%'>
                        <Box  width='70%' justifyContent="center" alignItems="center">
                            <Avatar sx={{ width: '3em', height: '3em', margin: '0 auto -1.5em auto'}}/>
                            <Box backgroundColor='blue.main' justifyContent="center" alignItems="center" padding='2.5em 1em' borderRadius='1em'  boxSizing= 'border-box'>
                                <Typography variant='h5' fontWeight='fontWeightMedium' marginBottom='1em' color='white' align='center'>Start a new InSight report</Typography>
                                <Typography variant='body1' fontWeight='fontWeightLight' marginBottom='1em' color='white'align='center'><i>To start a new report, upload your files by dragging and dropping into this area</i></Typography>
                            </Box>
                        </Box>
                        <Box width='70%' justifyContent="center" alignItems="center" >
                            <Avatar sx={{ width: '3em', height: '3em',  margin: '0 auto -1.5em auto'}}/>
                            <Box backgroundColor='blue.main' justifyContent="center" alignItems="center" padding='2.5em 1em' borderRadius='1em' boxSizing= 'border-box'>
                                <Typography variant='h5' fontWeight='fontWeightMedium' marginBottom='1em' color='white' align='center'>View a historic InSight report</Typography>
                            </Box>
                        </Box>
                        <YellowButton  width='70%'>Logout</YellowButton>
                    </Stack>
                </Grid>
            </Grid>
    </ThemeProvider>

  );
}

export default Welcome;
