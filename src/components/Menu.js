import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';



function Menu() {
  return (
    <Stack
    direction="column"
    spacing={2}
    >   
        <Button key="one" variant="contained" disableElevation><b>Upload customer reviews</b><br/><i>Select file or drag and drop</i></Button>
        <Button key="two" variant="contained" disableElevation><b>Download report as PDF</b></Button>
        <Button key="three" variant="contained" disableElevation><b>Send PDF report</b></Button>
        <hr/>
        <Button key="three" variant="contained" disableElevation><b>Connect to Amazon seller account</b></Button>
        <hr/>
        <Button key="three" variant="contained" disableElevation><b>Logout</b></Button>

    </Stack>
  );
}

export default Menu;