import { TextField } from '@mui/material';

function TextFieldYellow(props) {
    return(
    <TextField
    variant="outlined" size="small"
    onChange={props.onChange}
    sx={{
        "& .MuiOutlinedInput-root": {
            backgroundColor: "yellow.secondary",
            "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "yellow.secondary",
            }
        }}}/>
    ) 

}

export default TextFieldYellow;