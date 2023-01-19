import { useSelector } from "react-redux";
import { messageStyling, messageStyles } from "./messageStyles";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
// import styled from "@emotion/styled";
import { styled } from '@mui/system'

export const DeletedMessage = ({message}) => {
    const userData = useSelector(state => state.authReducer.data);
    const classes = messageStyles({isMine: userData.email === message.user, withoutCorner: false});
    const isMine = userData.email === message.user;

    return (
        <Box
            sx={classes.messageContainer}
            sxcolor="text.main"
        >
            {/* {!isMine && <Box sx={{width: "40px"}}/>} */}
            <Box sx={classes.messageStyling} color="text.secondary">
                <DeleteRoundedIcon />
                Message was deleted.
            </Box>
        </Box>
    )
}