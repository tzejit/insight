import { ThemeProvider } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Alert from '@mui/material/Alert';
import InsightTitle from '../components/typography/InsightTitle';
import TextFieldYellow from '../components/inputs/TextFieldYellow';
import BlackButton from '../components/buttons/BlackButton';
import theme from '../components/themes/MainTheme';



function Signup() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    async function signupApiCall() {
        let res = await fetch('http://127.0.0.1:5000/signup', {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          })
        res = await res.json()
        if (res.message === 'success') {
            localStorage.setItem('jwt-token', res.token)
            setUsername('')
            setPassword('')
            navigate('/dashboard')
          } else {
            setError(res.message)
          }
      }
  return (
    <ThemeProvider theme={theme}>
        <Box sx={{backgroundColor: 'yellow.main', flexDirection: 'column' }} height='100vh' width='100vw' display="flex" justifyContent="space-evenly" alignItems="center">
            <InsightTitle/>
            <Stack justifyContent="center" alignItems="center" spacing={2}>
                <Box width="100%"> 
                    <Typography color='black' variant='body1' fontWeight='fontWeightMedium' align="left">Email</Typography>
                </Box>
                <TextFieldYellow/>
                <Box width="100%"> 
                    <Typography color='black' variant='body1' fontWeight='fontWeightMedium' align="left">Username</Typography>
                </Box>
                <TextFieldYellow onChange={(e)=>setUsername(e.target.value)}/>
                <Box width="100%"> 
                    <Typography color='black' variant='body1' fontWeight='fontWeightMedium' align="left">Password</Typography>
                </Box>
                <TextFieldYellow  onChange={(e)=>setPassword(e.target.value)}/>
                {error ? <Alert severity="error">{error}</Alert>: ''}
            </Stack>
            <BlackButton onClick={signupApiCall}>Signup</BlackButton>
        </Box>
    </ThemeProvider>

  );
}

export default Signup;
