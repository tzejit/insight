import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useRef, useState } from 'react';


function Menu({downloadFunc}) {

    const inputRef = useRef(null)
    const [fileName, setFileName] = useState("")
  return (
    <Stack
    direction="column"
    spacing={2}
    >   
        <input key="file_input" id="file" name="file" type="file" hidden ref={inputRef} onChange={()=> {setFileName(inputRef.current.value.split("\\").slice(-1))}}/>
        <Button key="upload" variant="contained" disableElevation onClick={()=>inputRef.current.click()}><b>Upload customer reviews</b><br/><i>{fileName ? fileName: "Select file or drag and drop"}</i></Button>
        <Button key="download" variant="contained" disableElevation onClick={downloadFunc}><b>Download report as PDF</b></Button>
        <Button key="send" variant="contained" disableElevation><b>Send PDF report</b></Button>
        <hr/>
        <Button key="connect" variant="contained" disableElevation><b>Connect to Amazon seller account</b></Button>
        <hr/>
        <Button key="logout" variant="contained" disableElevation><b>Logout</b></Button>

    </Stack>
  );
}

export default Menu;