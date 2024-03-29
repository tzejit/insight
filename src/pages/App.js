import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Menu from '../components/AppMenu';
import Analytics from '../components/Analytics';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import theme from '../components/themes/MainTheme';

function App() {
    const pdfRef = useRef(null)
    const [token, setToken] = useState('')
    const navigate = useNavigate();

    const handleDownloadPDF = () => {
        html2canvas(pdfRef.current).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();

            const width = pdf.internal.pageSize.getWidth();
            const height = pdf.internal.pageSize.getHeight();
            const widthRatio = width / canvas.width;
            const heightRatio = height / canvas.height;
            const ratio = widthRatio > heightRatio ? heightRatio : widthRatio

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width * ratio, canvas.height * ratio);
            pdf.save('downloaded-file.pdf'); 
        });
    };

    // To update once dashboard endpoint is out
    useEffect(() => {
        async function fetchData() {
            const token = localStorage.getItem('jwt-token')
            setToken(token)
            let res = await fetch('http://127.0.0.1:5000/auth_api', {
            mode:'cors',
            headers: {
                'jwt-token': token,
            },
            })
            res = await res.json() 
        }

        // fetchData()
        setToken("a")

      }, [])

    const logout = () => {
        setToken('')
        localStorage.removeItem('jwt-token')
        navigate('/')

    }
    
    if (!token) {
        return (
            <ThemeProvider theme={theme}>
            <Box>
                <Typography color='grey.main' variant='h5' fontWeight='fontWeightMedium' margin='1em'>You are not logged in</Typography>
            </Box>
        </ThemeProvider>
        )
    }

  return (
    <ThemeProvider theme={theme}>
        <Box>
            <Typography color='grey.main' variant='h5' fontWeight='fontWeightMedium' margin='1em'>Welcome to InSight!</Typography>
            <Grid container spacing={2}>
                <Grid item xs={2} sx={{position: 'sticky', top: 0, alignSelf: 'start', marginLeft:'1vw'}}>
                    <Menu downloadFunc={handleDownloadPDF} logoutFunc={logout}/>
                </Grid>
                <Grid item xs='auto'>
                    <Divider orientation="vertical"/>
                </Grid>
                <Grid item xs={9}>
                    <Analytics refProp={pdfRef}/>
                </Grid>
            </Grid>
        </Box>
    </ThemeProvider>

  );
}

export default App;
