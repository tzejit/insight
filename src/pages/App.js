import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Menu from '../components/Menu';
import Analytics from '../components/Analytics';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef } from 'react';

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

function App() {
    const pdfRef = useRef(null)
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

  return (
    <ThemeProvider theme={theme}>
        <Box>
            <Typography color='grey.main' variant='h5' fontWeight='fontWeightMedium' margin='1em'>Welcome to InSight!</Typography>
            <Grid container spacing={2}>
                <Grid item xs={2} sx={{position: 'sticky', top: 0, alignSelf: 'start', marginLeft:'1vw'}}>
                    <Menu downloadFunc={handleDownloadPDF}/>
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
