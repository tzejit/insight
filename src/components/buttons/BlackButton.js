import { Button } from '@mui/material';

function BlackButton(props) {
    return(
    <Button variant="contained" color="black" disableElevation sx={{ padding:'0.7em 2em', borderRadius: '1em'}} onClick={props.onClick}> 
        {props.children}
    </Button>
    ) 

}

export default BlackButton;