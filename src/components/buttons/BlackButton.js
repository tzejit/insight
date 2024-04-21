import { Button } from "@mui/material";

function BlackButton(props) {
    return (
        <Button
            variant="contained"
            color="black"
            sx={{
                padding: "0.7em 1em",
                margin: "0.5em",
                // borderRadius: "1em",
                "&:hover": {
                    backgroundColor: "#fcc010",
                    color: "#101010",
                },
                width: props.width,
            }}
            onClick={props.onClick}
        >
            {props.children}
        </Button>
    );
}

export default BlackButton;

// .btn-grad {
//     background-image: linear-gradient(to right, #2b5876 0%, #4e4376  51%, #2b5876  100%);
//     margin: 10px;
//     padding: 15px 45px;
//     text-align: center;
//     text-transform: uppercase;
//     transition: 0.5s;
//     background-size: 200% auto;
//     color: white;
//     box-shadow: 0 0 20px #eee;
//     border-radius: 10px;
//     display: block;
//   }

//   .btn-grad:hover {
//     background-position: right center; /* change the direction of the change here */
//     color: #fff;
//     text-decoration: none;
//   }
