import { ThemeProvider } from '@mui/material/styles';
import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import InsightTitle from '../components/typography/InsightTitle';
import BlackButton from '../components/buttons/BlackButton';
import TextFieldYellow from '../components/inputs/TextFieldYellow';
import theme from '../components/themes/MainTheme';
import authenticate from '../hooks/authenticate';

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    async function loginApiCall() {
        try {
            await authenticate(username, password)
            setUsername('')
            setPassword('')
            navigate('/welcome')
        } catch(error) {
            console.log(error)
            setError(error.message)
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ backgroundColor: 'yellow.main', flexDirection: 'column' }} height='100vh' width='100vw' display="flex" justifyContent="space-evenly" alignItems="center">
                <InsightTitle />
                <Stack justifyContent="center" alignItems="center" spacing={2}>
                    <Box width="100%">
                        <Typography color='black' variant='body1' fontWeight='fontWeightMedium' align="left">Username</Typography>
                    </Box>
                    <TextFieldYellow onChange={(e) => setUsername(e.target.value)} />
                    <Box width="100%">
                        <Typography color='black' variant='body1' fontWeight='fontWeightMedium' align="left">Password</Typography>
                    </Box>
                    <TextFieldYellow onChange={(e) => setPassword(e.target.value)} type="password"/>
                    {error ? <Alert severity="error">{error}</Alert> : ''}
                </Stack>
                <BlackButton onClick={loginApiCall}>
                    Login
                </BlackButton>
            </Box>
        </ThemeProvider>

    );
}

export default Login;
