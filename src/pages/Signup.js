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
import { CognitoUser, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import userpool from '../components/userpool';


function Signup() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [error, setError] = useState('')
    const [showOtp, setShowOtp] = useState(false)


    function signupApiCall() {
        const attributeList = []
        attributeList.push(
            new CognitoUserAttribute({
                Name: 'email',
                Value: email,
            })
        )
        userpool.signUp(username, password, attributeList, null, (err, data) => {
            if (err) {
                setError(err.message)
            } else {
                setShowOtp(true)
                setError('')
            }
        });
    }

    function otpApiCall() {
        const user = new CognitoUser({
            Username: username,
            Pool: userpool,
        });
        user.confirmRegistration(otp, true, (err, data) => {
            if (err) {
                setError(err.message)
            } else {
                navigate('/login')
            }
        });
    }
    return (
        <ThemeProvider theme={theme}>
            {showOtp ?
                <Box sx={{ backgroundColor: 'yellow.main', flexDirection: 'column' }} height='100vh' width='100vw' display="flex" justifyContent="space-evenly" alignItems="center">
                    <InsightTitle />
                    <Stack justifyContent="center" alignItems="center" spacing={2}>
                        <Box width="100%">
                            <Typography color='black' variant='body1' fontWeight='fontWeightMedium' align="left">Enter verification code sent to {email}</Typography>
                        </Box>
                        <TextFieldYellow onChange={(e) => setOtp(e.target.value)} />
                        {error ? <Alert severity="error">{error}</Alert> : ''}
                    </Stack>
                    <BlackButton onClick={otpApiCall}>Verify</BlackButton>
                </Box>
                :
                <Box sx={{ backgroundColor: 'yellow.main', flexDirection: 'column' }} height='100vh' width='100vw' display="flex" justifyContent="space-evenly" alignItems="center">
                    <InsightTitle />
                    <Stack justifyContent="center" alignItems="center" spacing={2}>
                        <Box width="100%">
                            <Typography color='black' variant='body1' fontWeight='fontWeightMedium' align="left">Email</Typography>
                        </Box>
                        <TextFieldYellow onChange={(e) => setEmail(e.target.value)} />
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
                    <BlackButton onClick={signupApiCall}>Signup</BlackButton>
                </Box>
            }

        </ThemeProvider>

    );
}

export default Signup;
