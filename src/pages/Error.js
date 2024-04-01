import { ThemeProvider } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import theme from '../components/themes/MainTheme';


function Error() {
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ backgroundColor: 'yellow.main' }} height='100vh' width='100vw' display="flex" justifyContent="center" alignItems="center">
                <Typography color='black' variant='h3' fontWeight='fontWeightMedium' margin='1rem'>You are not logged in.</Typography>
            </Box>
        </ThemeProvider>

    );
}

export default Error;
