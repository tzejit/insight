import Grid from '@mui/material/Grid';
import { Link } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Button, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';

const theme = createTheme({ 
    palette: {  primary: {main: '#f2f2f2' },
                yellow: {main: '#ffc000', transparent: '#ffc00033' }, 
                grey: {main: '#252f3f'},
                brown: {main: '#420D0D'}},
    typography: {
        button: {
          textTransform: 'none',
          flexDirection: "column"
        }
      }
})

function Landing() {
  return (
    <ThemeProvider theme={theme}>
            <Stack   justifyContent="center"
  alignItems="center">
                <Typography color='black' variant='h5' fontWeight='fontWeightMedium' margin='1em'>Ready</Typography>
                <Typography color='black' variant='h5' fontWeight='fontWeightMedium' margin='1em'>Set</Typography>
                <Typography color='black' variant='h5' fontWeight='fontWeightMedium' margin='1em'>InSight!</Typography>

                <Grid container spacing={2}   justifyContent="center"
  alignItems="center">
                    <Grid item xs='auto'>
                        <Link to="login">
                            <Button variant="contained"> 
                                Login
                            </Button>
                        </Link>
                    </Grid>
                    <Grid item xs='auto'>
                        <Link to="signup">
                            <Button variant="contained"> 
                                Signup
                            </Button>
                        </Link>                    
                    </Grid>
                </Grid>
            </Stack>
    </ThemeProvider>

  );
}

export default Landing;
