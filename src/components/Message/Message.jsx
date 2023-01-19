import { Avatar, AvatarGroup, Box, Chip, Divider, IconButton, Slide, Tooltip } from "@mui/material"
import { makeStyles } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import messageCorner from "../../images/messageCorner.svg"
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { borderRadius } from "@mui/system";
import { useRef, useState } from "react";
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { child, get, getDatabase, ref, set } from "firebase/database";
import { selectMessage, setIsReplyTo, setMode } from "../../redux/chat";
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import { deleteMessage } from "../../utils/deleteMessage";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import { setReactionForMessage } from "../../utils/setReactionForMessage";
import { useEffect } from "react";
import { removeWrongSymbols } from "../../utils/removeWrongSymbols";
import { emojiRegExp } from "../../utils/emojiRegExp";
// import { EmojiMessage } from "./EmojiMessage";
import { Reaction } from "./Reaction";
import { ReactionBoard } from "./ReactionBoard";
import { ReactionChip } from "./ReactionChip";
import { messageStyles } from "./messageStyles";
import { DeletedMessage } from "./DeletedMessage";
// import styled from "@emotion/styled";
import { styled } from '@mui/system'

const selectForReply = (i) => dispatch => {
    dispatch(setIsReplyTo(i));
    dispatch(setMode("reply"))
}

const MessageWithContent = ({message, i, isLastInColumn, isFirstInColumn}) => {
    const [displayMenuButton, setDisplayMenuButton] = useState(false);
    const [isMenuActive, setMenuActive] = useState(false);
    const userData = useSelector(state => state.authReducer.data);
    const isMine = userData.email === message.user;
    const isEmoji = emojiRegExp.test(message.content);
    const selectedChat = useSelector(state => state.chat.uid);
    const selectedMessage = useSelector(state => state.chat.selectedMessage);
    const messages = useSelector(state => state.chat.messages);
    const db = getDatabase();
    const dbRef = ref(db);
    const dispatch = useDispatch();
    const messageDate = new Date(message.date);
    const [isReactionBoardOpened, openReactionBoard] = useState(false)
    const [reactions, setReactions] = useState([])
    const styles = messageStyles({isMine, displayMenuButton, isLastInColumn, isEmoji});

    const setEditMode = (i) => {
        dispatch(setMode("edit"));
        dispatch(selectMessage(i));
    }

    useEffect(() => {
        if(message.reactions && message.reactions?.length !== 0) {
            let result = Object.entries(message.reactions);
    
            (async () => {
                result = result.reduce((prev, cur) => {
                    const temp = prev;
                    temp[cur[1]] = [...(temp[cur[1]] || []), cur[0]];
                    return temp;
                }, {})

                result = Object.entries(result);

                for(let i = 0; i < result.length; i++) {
                    if(result[i][0]) {
                        for(let j = 0; j < result[i][1].length; j++) {
                            const userInfo = await get(child(dbRef, `users/${removeWrongSymbols(result[i][1][j])}`))
                            result[i][1][j] = userInfo?.val();
                        }
                    } else {
                        result[i] = "none";
                    }
                }
                setReactions(result);
            })()
        }
        
        
    }, [message])


    return (
        <Box
            key={"m-" + i}
            sx={styles.messageContainer}
            onMouseEnter={() => {
                setDisplayMenuButton(true)
            }}
            onMouseLeave={() => {
                setDisplayMenuButton(false)
                setMenuActive(false)
            }}
            id={"m-" + i}
        >
            <Box
                onMouseLeave={() => {
                    setMenuActive(false);
                    openReactionBoard(false);
                }}
                sx={styles.MenuButton}
            >
                {isReactionBoardOpened ?
                    <>
                        <ReactionBoard onClick={() => {
                            setMenuActive(false);
                            openReactionBoard(false);
                        }} messageI={i}/>
                    </>
                :
                    isMine ?
                        (isMenuActive ?
                            (
                                    <>
                                        <IconButton onClick={() => setEditMode(i)} size="small" sx={{color: "text.main"}}>
                                            <EditRoundedIcon />
                                        </IconButton>
                                        <IconButton onClick={() => deleteMessage(db, selectedChat, i)} size="small" sx={{color: "text.main"}}>
                                            <DeleteRoundedIcon />
                                        </IconButton>
                                        <IconButton size="small" sx={{color: "text.main"}}>
                                            <InfoRoundedIcon />
                                        </IconButton>
                                    </>
                            )
                            :
                                <>
                                    <IconButton onClick={() => openReactionBoard(true)} size="small" sx={{color: "text.main"}}>
                                        <AddReactionIcon/>
                                    </IconButton>
                                    <IconButton onClick={() => dispatch(selectForReply(i))} size="small" sx={{color: "text.main"}}>
                                        <ReplyRoundedIcon />
                                    </IconButton>
                                    <IconButton onClick={() => setMenuActive(true)} size="small" sx={{color: "text.main"}}>
                                        <MoreVertOutlinedIcon />
                                    </IconButton>
                                </>
                        )
                    :
                        <>
                            <IconButton onClick={() => openReactionBoard(true)} size="small" sx={{color: "text.main"}}>
                                <AddReactionIcon/>
                            </IconButton>
                            <IconButton onClick={() => dispatch(selectForReply(i))} size="small" sx={{color: "text.main"}}>
                                <ReplyRoundedIcon />
                            </IconButton>
                            <IconButton size="small" sx={{color: "text.main"}}>
                                <InfoRoundedIcon />
                            </IconButton>
                        </>
                }
            </Box>
            <Box
                sx={styles.messageStyling}
                color="text.main"
            >
                {typeof message.isReplyTo === "number" &&
                    <Box
                        onClick={() => {
                            document.querySelector("#m-" + message.isReplyTo).scrollIntoView({behavior: "smooth", block: "center"})
                            document.querySelector("#m-" + message.isReplyTo).classList.toggle("highlight-message")
                            document.querySelector("#m-" + message.isReplyTo).onanimationend = (
                                () => document.querySelector("#m-" + message.isReplyTo).classList.toggle("highlight-message")
                            )
                        }}
                        sx={styles.replyStyling}
                    >
                        {messages[message.isReplyTo]?.status === "deleted" ?
                                <>
                                    {messages[message.isReplyTo]?.user}
                                    <ReplyRoundedIcon />
                                    <br/>
                                    <div style={{display: "flex", alignContent: "center", paddingRight: "10px"}}>
                                        <DeleteRoundedIcon /> This message was deleted
                                    </div>
                                </>
                            :
                                <>
                                    {messages[message.isReplyTo]?.user}
                                    <ReplyRoundedIcon />
                                    <br/>
                                    {messages[message.isReplyTo]?.content}
                                </>
                        }
                    </Box>
                }
                {`${message.content}`}
                <Box sx={styles.ChipsBlock}>
                    <br/>
                    {reactions.map((r) => {
                        const isMineReaction = (r === "none" ? [[], []] : r)[1].some(a => a.uid === userData.uid);
                        let id;
                        return (
                            r === "none" ? <></> :
                            <ReactionChip reaction={r} isMineReaction={isMineReaction} i={i} />
                        )
                    })}
                    {message.status === "edited" &&
                        <Chip
                            className="chip-animation-in"
                            icon={<EditRoundedIcon color="text.secondary"/>}
                            size="small"
                            label={"edited"}
                            sx={styles.Chip}
                        />
                    }
                    <Chip
                        className="chip-animation-in"
                        size="small"
                        label={
                            !isNaN(messageDate.getHours()) ?
                                `${
                                    `${messageDate.getHours()}`.length == 1 ? `0${messageDate.getHours()}` : messageDate.getHours()}:${
                                    `${messageDate.getMinutes()}`.length == 1 ? `0${messageDate.getMinutes()}` : messageDate.getMinutes()
                                }`
                            : "??:??"
                        }
                        sx={styles.Chip}
                    />
                </Box>
            </Box>
        </Box>
    )
}

export const Message = (props) => (props.message.status === "deleted" ?
    <DeletedMessage {...props}/>
    :
    (
        <MessageWithContent {...props}/>
    )
)
