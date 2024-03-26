import TextField from '@mui/material/TextField';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Button, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';



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
            <Stack justifyContent="center" alignItems="center">

                <Typography color='black' variant='h5' fontWeight='fontWeightMedium' margin='1em'>InSight</Typography>
                <TextField label="Username" variant="outlined" onChange={(e)=>setUsername(e.target.value)}/>
                <TextField label="Password" variant="outlined" onChange={(e)=>setPassword(e.target.value)}/>
                <Button variant="contained" onClick={loginApiCall}> Login </Button>
                {error ? <Alert severity="error">{error}</Alert>: ''}
            </Stack>
    </ThemeProvider>

  );
}

export default Login;
