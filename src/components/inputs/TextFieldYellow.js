import { TextField } from "@mui/material";

function TextFieldYellow(props) {
    return (
        <TextField
            variant="outlined"
            size="small"
            onChange={props.onChange}
            type={props.type}
            placeholder={props.placeholder}
            id={props.id}
            sx={{
                "& .MuiOutlinedInput-root": {
                    backgroundColor: "yellow.secondary",
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "yellow.secondary",
                    },
                },
            }}
        />
    );
}

export default TextFieldYellow;
