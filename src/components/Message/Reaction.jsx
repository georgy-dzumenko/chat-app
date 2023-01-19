// import styled from "@emotion/styled";
import { IconButton } from "@mui/material";
import { makeStyles, styled } from "@mui/styles";
import { getDatabase } from "firebase/database";
import { useState } from "react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { setReactionForMessage } from "../../utils/setReactionForMessage";
import { messageStyles } from "./messageStyles";

export const Reaction = ({messageI, reaction, onClick}) => {
    const db = getDatabase();
    const selectedChat = useSelector(state => state.chat.uid);
    const userEmail = useSelector(state => state.authReducer.data.email);
    const styles = messageStyles({});

    return (
        <IconButton
            onClick={() => {
                setReactionForMessage(db, selectedChat, userEmail, messageI, reaction);
                onClick();
            }}
            size="small"
            sx={styles.Reaction}
        >
            {reaction}
        </IconButton>
    )
}
