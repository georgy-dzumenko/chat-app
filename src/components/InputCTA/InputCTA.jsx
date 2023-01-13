import { Button, Input, TextField } from "@mui/material"
import { makeStyles, styled } from "@mui/styles"

// export const InputCTA = styled(TextField)(() => ({
//     input: {
//         color: "#fff"
//     }
// }));

// const options = {
//     root: {
//         borderRadius: "5px",
//         bgcolor: "green",
//         overflow: "hidden",
//         marginBottom: "10px",
//     },
//     input: {
//         borderRadius: "10px",
//         padding: "10px 15px",
//         fontSize: "18px",
//         color: 'textInput.color'
//     }
// };

const useStyles = makeStyles(() => ({
    root: {
        '& $disabled': {
            borderColor: 'orange'
        }
    },
    disabled: {

    }
}))

export const InputCTA = ({...props}) => {
    // const classes = useStyles();

    const classes = {
        root: {
            '&$disabled $notchedOutline': {
                borderColor: 'orange'
            }
        },
        disabled: {},
        notchedOutline: {}
    }

    return (
        <TextField
            // disabled
            variant='outlined'
            label='Text Field 1'
            sx={{
                marginBottom: "10px",
                border: "10px",
                color: "#fff",
                padding: "6px 0",
                input: {
                    color: "#fff",
                    padding: "10px 15px",
                },
                "& .MuiInputLabel-root": {
                    color: '#78a85d',
                },
                "& .MuiOutlinedInput-root": {
                    "& > fieldset": {
                        border: "3px solid #78a85d",
                        transition: "0.1s ease",
                    },
                },
                "& .MuiOutlinedInput-root:hover": {
                    "& > fieldset": {
                        borderColor: "#1b7a35",
                        transition: "0.1s ease",
                    }
                },
                "& .MuiOutlinedInput-root.Mui-focused": {
                    "& > fieldset": {
                        border: "2px solid",
                        borderColor: "#1b7a35",
                    }
                  }
            }}
            InputProps={{disableUnderline: true}}
            {...props}
        />
    )
}