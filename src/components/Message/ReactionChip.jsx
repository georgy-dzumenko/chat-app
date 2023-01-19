// import styled from "@emotion/styled";
import { Avatar, AvatarGroup, Chip, Tooltip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { getDatabase } from "firebase/database";
import { useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { removeWrongSymbols } from "../../utils/removeWrongSymbols";
import { setReactionForMessage } from "../../utils/setReactionForMessage";
import { messageStyles } from "./messageStyles";
import { styled } from '@mui/system'

export const ReactionChip = ({reaction, isMineReaction, i}) => {
    const db = getDatabase();
    const selectedChat = useSelector(state => state.chat.uid);
    const userData = useSelector(state => state.authReducer.data);
    const styles = messageStyles({});
    const ref = useRef(null);

    return (
        <Tooltip title={"Reaction of " + reaction[1].map(a => a.email).join(", ")} arrow>
            <Chip
                className="chip-animation-in"
                ref={ref}
                clickable
                onClick={() => {
                    if(isMineReaction) {
                        ref.current.classList.toggle("chip-animation-out");
                        setTimeout(() => {
                            setReactionForMessage(db, selectedChat, userData.email, i, "")
                        }, 200)
                    } else {
                        setReactionForMessage(db, selectedChat, userData.email, i, reaction[0])
                    }
                }}
                size="small"
                key={`reaction${i}${removeWrongSymbols(reaction[0])}${reaction[1]?.map(a => a.email)?.join("-")}`}
                avatar={
                    <AvatarGroup sx={styles.ReactionChipAvatarGroup} max={3}>
                        {
                            reaction[1].map(a => (
                                <Avatar
                                    sx={{width: 18, height: 18, fontSize: "10px", border: "1px solid !important"}}
                                    alt={a.email}
                                    src={"/asdfasdjlf"}
                                />
                            ))
                        }    
                    </AvatarGroup>
                }
                label={reaction[0]}
                variant={isMineReaction ? "auto" : "outlined"}
                sx={{...styles.ReactionChip, ...styles.Chip}}
            />
        </Tooltip>
    )
}