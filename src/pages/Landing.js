import Grid from '@mui/material/Grid';
import { Link } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import './landing.css'
import InsightTitle from '../components/typography/InsightTitle';
import BlackButton from '../components/buttons/BlackButton';

const theme = createTheme({ 
    palette: {  primary: {main: '#f2f2f2' },
                yellow: {main: '#FBD542', transparent: '#ffc00033' }, 
                grey: {main: '#252f3f'},
                brown: {main: '#420D0D'},
                black: {main: '#06040A'}},
    typography: {
        button: {
          textTransform: 'none',
          flexDirection: "column",
        }
      },
})

function Landing() {
  return (
    <ThemeProvider theme={theme}>
        <Box sx={{backgroundColor: 'yellow.main' }} height='100vh' width='100vw' display="flex" justifyContent="center" alignItems="center">
            <Stack justifyContent="center" alignItems="center">
                <Typography color='black' variant='h3' fontWeight='fontWeightMedium' margin='1rem'>Ready</Typography>
                <Typography color='black' variant='h3' fontWeight='fontWeightMedium' margin='1rem'>Set</Typography>
                <InsightTitle/>

                <Grid container spacing='5em' justifyContent="center" alignItems="center" padding='5em'>
                    <Grid item xs='auto'>
                        <Link to="login">
                            <BlackButton>Login</BlackButton>
                        </Link>
                    </Grid>
                    <Grid item xs='auto'>
                        <Link to="signup">
                            <BlackButton>Sign up</BlackButton>
                        </Link>                    
                    </Grid>
                </Grid>
            </Stack>
        </Box>

    </ThemeProvider>

  );
}

export default Landing;
