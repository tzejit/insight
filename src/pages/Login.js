import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import InsightTitle from '../components/typography/InsightTitle';
import BlackButton from '../components/buttons/BlackButton';
import TextFieldYellow from '../components/inputs/TextFieldYellow';

const theme = createTheme({ 
    palette: {  primary: {main: '#f2f2f2' },
                yellow: {main: '#FBD542', secondary: '#FDE89D' }, 
                grey: {main: '#252f3f'},
                brown: {main: '#420D0D'},
                black: {main: '#06040A', contrastText: '#ffffff'}},
    typography: {
        button: {
          textTransform: 'none',
          flexDirection: "column"
        }
      },
})

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function loginApiCall() {
    let res = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 'username': username, 'password':password }),
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
                    <Typography color='black' variant='body1' fontWeight='fontWeightMedium' align="left">Username</Typography>
                </Box>
                <TextFieldYellow onChange={(e)=>setUsername(e.target.value)} />
                <Box width="100%"> 
                    <Typography color='black' variant='body1' fontWeight='fontWeightMedium' align="left">Password</Typography>
                </Box>
                <TextFieldYellow onChange={(e)=>setPassword(e.target.value)} />
                {error ? <Alert severity="error">{error}</Alert>: ''}
            </Stack>
            <BlackButton onClick={loginApiCall}>  
                Login 
            </BlackButton>
        </Box>
    </ThemeProvider>

  );
}

export default Login;
