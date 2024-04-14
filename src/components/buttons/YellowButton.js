import { Button } from '@mui/material';

function YellowButton(props) {
    return (
        <Button variant="contained" color="secondary" disableElevation sx={{ padding: '0.5em', borderRadius: '1em', width: props.width, margin: '0.5em' }} onClick={props.onClick} disabled={props.disabled}>
            {props.children}
        </Button>
    )

}

export default YellowButton;