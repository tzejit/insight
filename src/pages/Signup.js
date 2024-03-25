import TextField from '@mui/material/TextField';
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

function Signup() {
  return (
    <ThemeProvider theme={theme}>
            <Stack justifyContent="center" alignItems="center">

                <Typography color='black' variant='h5' fontWeight='fontWeightMedium' margin='1em'>InSight</Typography>
                <TextField label="Email" variant="outlined" />
                <TextField label="Username" variant="outlined" />
                <TextField label="Password" variant="outlined" />
                <Button variant="contained"> Signup </Button>
                
            </Stack>
    </ThemeProvider>

  );
}

export default Signup;
