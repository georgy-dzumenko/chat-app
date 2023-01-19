import { Chip, Divider, IconButton, InputBase, Paper, Typography } from "@mui/material";
import { child, get, getDatabase, ref, set } from "firebase/database";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectChat, selectMessage, setIsReplyTo, setMode } from "../../redux/chat";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useEffect } from "react";
import { deleteMessage } from "../../utils/deleteMessage";
import { useFocus } from "../../redux/useFocus";
import { replyToMessage } from "../../utils/replyToMessage";
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import SentimentSatisfiedAltRoundedIcon from '@mui/icons-material/SentimentSatisfiedAltRounded';
import { emojiRegExp } from "../../utils/emojiRegExp";

const cencelEditing = () => dispatch => {
    dispatch(selectMessage(null))
    dispatch(setMode(null))
}

const cencelReply = () => dispatch => {
    dispatch(setIsReplyTo(null))
    dispatch(setMode(null))
}

const editMessage = (db, selectedChat, i, newContent) => dispatch => {
    set(ref(db, `${selectedChat}/messages/${i}/content`), newContent)
    set(ref(db, `${selectedChat}/messages/${i}/status`), "edited");
    dispatch(cencelEditing())
}

const useStyles = makeStyles(theme => ({
    messageContainer: {
        // marginLeft: "70px",
        // maxWidth: "400px",
        // width: '100%',
        color: theme.palette.text.main,
        width: "calc(100% - 20px)",
        textShadow: "#000 1px 0 3px",
        wordBreak: "break-all",
        background: "linear-gradient(130deg, #0c3818, #135c27)",
        boxShadow: "inset 1px 0 2px 1px #135c27",
        padding: "10px",
        borderRadius: "20px 20px 0 0",
        display: "flex",
        justifyContent: "space-between"
    },
    EmojiFromEmojiBoard: {
        "&:hover": {
            // transform: "scale(1.2)",
            transition: "0.1s ease",
            boxShadow: "inset 0 0 5px 1px #fff",
            borderRadius: "50%",
            textShadow: "0 0 0 5px black",
        }
    }
}))

const sendMessage = (db, selectedChat, i, data) => {
    const date = new Date();
    set(ref(db, `${selectedChat}/messages/${i || 0}`), {
        ...data,
        date: date.toJSON(),
    });
}

const emojis = [
    {
        title: "Hands & Gestures",
        content: [
            "👋🏻", "🤚🏻", "🖐🏻", "✋🏻", "🖖🏻", "👌🏻", "🤌🏻", "🤏🏻",
            "✌🏻", "🤞🏻", "🤟🏻", "🤘🏻", "🤙🏻", "👈🏻", "👉🏻", "👆🏻",
            "🖕🏻", "👇🏻", "☝🏻", "👍🏻", "👎🏻", "✊🏻", "👊🏻", "🤛🏻",
            "🤜🏻", "👏🏻", "🙌🏻", "👐🏻", "🤲🏻", "🤝🏻", "🙏🏻", "✍🏻",
            "💅🏻", "🤳🏻"
        ],
    },
    {
        title: "Faces & Emotions",
        content: [
            "😀", "😁", "😆", "🤣", "😅", "🤬", "😅", "😂",
            "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩",
            "😘", "😗", "😚", "😙", "😋", "😛", "😜", "🤪",
            "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨",
            "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥",
            "😌", "😪", "😪", "🤤", "😴", "😷", "🤒", "🤕",
            "🤢", "🤮", "🤧", "🥵", "🥶", "🥴", "😵‍💫", "🤯",
            "🤠", "🥳", "🥸", "😎", "🤓", "🧐", "😕", "😟",
            "🙁", "☹️", "😮", "😯", "😳", "🥺", "😦", "😧",
            "😨", "😰", "😥", "😢", "😭", "😱", "😖", "😣",
            "😞", "😓", "😩", "😫", "🥱", "😤", "😡", "🤬",
            "😈", "👿", "💀", "☠️", "💩", "🤡", "👹", "👺",
            "👻", "👽", "👾", "🤖", "😺", "😸", "😹", "😻",
            "😼", "😽", "🙀", "😿", "😾", "🙈", "🙉", "🙊",
            
        ]
    },
    {
        title: "Body",
        content: [
            "💪🏻", "🦾", "🦵🏻", "🦿", "🦶🏻", "👂🏻", "👃🏻", "🧠",
            "🫀", "🫁", "🦷", "🦴", "👀", "👁️", "👅", "👄",  
        ],
    },
    {
        title: "People",
        content: [
            "👶🏻", "🧒🏻", "👦🏻", "👧🏻", "🧑🏻", "👨🏻", "🧔🏻", "🧔🏻‍♂️",
            "🧔🏻‍♀️", "👨🏻‍🦱", "👨🏻‍🦲", "👩🏻", "👩🏻", "🧑🏻‍🦱", "👩🏻‍🦲", "🧑🏻‍🦲",
            "🧓🏻", "👴🏻", "👵🏻", "🙍🏻", "🙍🏻‍♂️", "🙍🏻‍♀️", "🙎🏻", "🙎🏻‍♂️",
            "🙎🏻‍♀️", "🙅🏻", "🙅🏻‍♂️", "🙅🏻‍♀️", "🙆🏻", "🙆🏻‍♂️", "🙆🏻‍♀️", "💁🏻",
            "💁🏻‍♂️", "💁🏻‍♀️", "🙋🏻", "🙋🏻‍♂️", "🙋🏻‍♀️", "🧏🏻", "🧏🏻‍♂️", "🧏🏻‍♀️",
            "🙇🏻", "🙇🏻‍♂️", "🙇🏻‍♀️", "🤦🏻", "🤦🏻‍♂️", "🤦🏻‍♀️", "🤷🏻", "🤷🏻‍♂️",
            "🤷🏻‍♀️" 
        ],
    },
    {
        title: "Jobs",
        content: [
            "🧑🏻‍⚕️", "👨🏻‍⚕️", "👩🏻‍⚕️", "🧑🏻‍🎓", "👨🏻‍🎓", "👩🏻‍🎓", "🧑🏻‍🏫", "👨🏻‍🏫",
            "👩🏻‍🏫", "🧑🏻‍⚖️", "👨🏻‍⚖️", "👩🏻‍⚖️", "🧑🏻‍🌾", "👨🏻‍🌾", "👩🏻‍🌾", "🧑🏻‍🍳",
            "👨🏻‍🍳", "👩🏻‍🍳", "🧑🏻‍🔧", "👨🏻‍🔧", "👩🏻‍🔧", "🧑🏻‍🏭", "👨🏻‍🏭", "👩🏻‍🏭",
            "🧑🏻‍💼", "👨🏻‍💼", "👩🏻‍💼", "🧑🏻‍🔬", "👨🏻‍🔬", "👩🏻‍🔬", "🧑🏻‍💻", "👨🏻‍💻",
            "👩🏻‍💻"
        ],
    },
    {
        title: "Love",
        content: [
            "💋", "💌", "💘", "💝", "💖", "💗", "💓", "💞",
            "💕", "💟", "❣️", "💔", "❤️‍🔥", "❤️‍🩹", "❤️", "💛",
            "💙"
        ]
    },
    {
        title: "Just Things :)",
        content: [
            "💯", "💢", "💥", "💫", "💦", "💨", "🕳️", "💣",
            "💬", "👁️‍🗨️", "🗨️", "🗯️", "💭", "💤"
        ]
    }
]

export const SendMessageInput = () => {
    const [newMessage, setNewMessage] = useState();
    // const inputRef = useRef(null);
    const [inputRef, setInputFocus] = useFocus()
    const db = getDatabase();
    const dbRef = ref(db);
    const userData = useSelector(state => state.authReducer?.data);
    const friendData = useSelector(state => state.chat.friendData);
    const dispatch = useDispatch();
    const selectedChat = useSelector(state => state.chat.uid);
    const isReplyTo = useSelector(state => state.chat.isReplyTo);
    const selectedMessage = useSelector(state => state.chat.selectedMessage);
    const mode = useSelector(state => state.chat.mode);
    const classes = useStyles();
    const messages = useSelector(state => state.chat.messages);
    const [isEmojiBoardOpened, setEmojiBoardOpened] = useState(false);

    useEffect(() => {
        if(mode === "edit") {
            setNewMessage(messages[selectedMessage].content)
        }
        setInputFocus()
    }, [mode])

    return (
        <>
            {mode === "reply" &&
                <Box className={classes.messageContainer}>
                    {messages[isReplyTo]?.content}
                    <Chip
                        icon={<ReplyRoundedIcon/>}
                        sx={{color: "text.main", marginLeft: "auto"}}
                        label="You are replaying to message"
                        onDelete={() => {
                            dispatch(cencelReply())
                            setNewMessage("")
                        }}
                    ></Chip>
                    {/* <IconButton */}
                </Box>
            }
            {mode === "edit" &&
                <Box className={classes.messageContainer}>
                    {messages[selectedMessage]?.content}
                    <Chip
                        icon={<EditRoundedIcon/>}
                        sx={{color: "text.main", marginLeft: "auto"}}
                        label="Edit message"
                        onDelete={() => {
                            dispatch(cencelEditing())
                            setNewMessage("")
                        }}
                    ></Chip>
                    {/* <IconButton */}
                </Box>
            }
            <Paper
                color="inputPaper.main"
                component="form"
                sx={{ position: "absolute", p: '2px 4px', display: 'flex', alignItems: 'center', width: "calc(100% - 35px)", boxSizing: "border-box" }}
                >
                <InputBase
                    color="text.main"
                    sx={{ ml: 1, flex: 1, color: "text.main" }}
                    placeholder="Any message"
                    onChange={(event) => {
                        setNewMessage(event.target.value)
                    }}
                    inputProps={{
                        ref: inputRef
                    }}
                    autoFocus={true}
                    value={newMessage}
                />
                <Divider sx={{ height: 28, m: 0.5,  }} color="#444" orientation="vertical" />
                <Box
                    onMouseEnter={() => {setEmojiBoardOpened(true)}}
                    onMouseLeave={() => {setEmojiBoardOpened(false)}}
                    sx={{position: "relative"}}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            transition: "0.2s ease",
                            opacity: isEmojiBoardOpened ? "1" : "0",
                            // transform: ,
                            // display: isEmojiBoardOpened ? "flex" : "none",
                            width: "max-content",
                            maxWidth: "220px",
                            transformOrigin: "bottom right",
                            transform: isEmojiBoardOpened ? "translate(calc(-100% + 60px), calc(-100% + 50px)) scale(1)" : "translate(calc(-100% + 40px), -100%) scale(0)",
                            zIndex: "10",
                            padding: "10px",
                            borderRadius: "10px",
                            fontSize: "23px",
                            background: "linear-gradient(45deg, #012e30, #001a1c)",
                            boxShadow: "inset -1px 0 0 1px #012e30",
                            maxHeight: "400px",
                            overflowY: "scroll"
                        }}
                    >
                        {emojis.map((a) => {
                            return (
                                <>
                                    <Typography sx={{width: "100%", textAlign: "center"}} color="text.main">{a.title}</Typography>
                                    <Box>
                                        {
                                            a.content.map(a => (
                                                <Box
                                                    sx={{
                                                        cursor: "pointer",
                                                        display: "inline",
                                                        "user-select": "none",
                                                        height: "20px",
                                                        width: "20px",
                                                    }}
                                                    className={classes.EmojiFromEmojiBoard}
                                                    onClick={() => {
                                                        setNewMessage(prev => `${prev ? prev : ""}${a}`)
                                                        setInputFocus()
                                                    }}
                                                >
                                                    {a}
                                                </Box>
                                            ))
                                        }
                                    </Box>
                                </>
                            )    
                        })}   
                    </Box>
                    <IconButton
                        color="primary"
                        sx={{ p: '10px' }}
                        aria-label="directions"
                    >
                        <SentimentSatisfiedAltRoundedIcon />
                    </IconButton>
                </Box>
                <IconButton
                    disabled={mode === "edit" ? false : !newMessage}
                    onClick={() => {
                        let newSelectedChat = `${userData.uid}&${friendData.uid}`;
                        if(!mode) {
                            if(newMessage) {
                                if(!selectedChat) {
                                    get(child(dbRef, newSelectedChat)).then((snapshot) => {
                                        if(!snapshot.val()) {
                                            
                                            newSelectedChat = `${friendData.uid}&${userData.uid}`;
                                            get(child(dbRef, `${newSelectedChat}`)).then((resp) => {
                                                set(ref(db, `${newSelectedChat}`), {
                                                    ...resp.val(),
                                                });
                                            })
                                        }
                                        get(child(dbRef, `${newSelectedChat}/messages`)).then((resp) => {
                                            sendMessage(db, newSelectedChat, resp?.val()?.length, {
                                                user: userData.email,
                                                content: newMessage
                                            });
                                        })
                                    })
                                } else {
                                    sendMessage(db, selectedChat, messages?.length, {
                                        user: userData.email,
                                        content: newMessage
                                    });
                                    newSelectedChat = selectedChat
                                }
                            }
                        } else if(mode === "edit") {
                            if(!newMessage) {
                                deleteMessage(db, selectedChat, selectedMessage);
                                dispatch(cencelEditing())
                            } else {
                                dispatch(editMessage(db, selectedChat, selectedMessage, newMessage))
                            }
                        } else if(mode === "reply") {
                            replyToMessage(db, selectedChat, messages.length, newMessage, userData.email, isReplyTo)
                            dispatch(setIsReplyTo(null))
                            dispatch(setMode(null))
                        }

                        setNewMessage("")
                    }}
                    color="primary"
                    sx={{ p: '10px' }}
                    type="submit"
                    aria-label="directions"
                >
                    {mode === "edit" ?
                    <CheckRoundedIcon/>
                    : <SendRoundedIcon />}
                </IconButton>
            </Paper>
        </>
    )
}