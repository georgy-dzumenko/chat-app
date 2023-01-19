import { AppBar, Avatar, Box, CircularProgress, Divider, IconButton, InputBase, Paper, Toolbar, Typography } from "@mui/material";
import { child, get, getDatabase, ref, set } from "firebase/database";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { removeWrongSymbols } from "../../utils/removeWrongSymbols";
import { selectChat, setChatData } from "../../redux/chat";
import { addToChatLists } from "../../utils/addToChatLists";
import { SendMessageInput } from "../SendMessageInput/SendMessageInput";
import { Message } from "../Message/Message";
import { makeStyles } from "@mui/styles";
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { maxWidth } from "@mui/system";
import { useEffect } from "react";

const useStyles = makeStyles(theme => ({
    TopBar: {
        display: "block",
        width: "100%",
        background: "linear-gradient(8deg, #012e30, #001a1c)",
    },
    BackButton: {
        display: "none",
        [theme.breakpoints.down('sm')]: {
            display: "block",
        },
    }
}))

export const ChatContent = ({setOpened}) => {
    const userData = useSelector(state => state.authReducer?.data)
    const classes = useStyles();
    const db = getDatabase();
    const dbRef = ref(db);
    const messages = useSelector(state => state.chat.messages);
    const [newMessage, setNewMessage] = useState("");
    const friendData = useSelector(state => state.chat.friendData);
    const dispatch = useDispatch();
    const selectedChat = useSelector(state => state.chat.uid);
    const messagesToDisplay = [...messages].sort(() => -1);
    
    let [messagesSplittedToColumns, setMessagesSplittedToColumns] = useState([[]]);
    
    useEffect(() => {
        let newValue = [[]];
        for(let i = 0; i < messagesToDisplay.length; i++) {
            if(messagesToDisplay[i].user === messagesToDisplay[i - 1]?.user) {
                newValue[newValue.length - 1]?.push({...messagesToDisplay[i], i: messagesToDisplay.length - i - 1})
            } else {
                newValue.push([{...messagesToDisplay[i], i: messagesToDisplay.length - i - 1}]);
            }
        }

        newValue.map(a => a.reverse())
        setMessagesSplittedToColumns(newValue)
    }, [messages])
    // const lorem = messages.reverse();

    return (
        <>
            <Box className={classes.TopBar}>
                <AppBar position="static">
                    <Toolbar>
                        <Box
                            className={classes.BackButton}
                        >
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 0.5 }}
                                onClick={() => {
                                    dispatch(setChatData({}))
                                    setOpened(true)
                                }}
                            >
                                <ArrowBackRoundedIcon />
                            </IconButton>
                        </Box>
                        <Box sx={{
                            marginRight: 2
                        }}>
                            <Avatar alt={friendData?.email} src="/asdfasdf"/>
                        </Box>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            {friendData?.email}
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
            <Box sx={{
                marginTop: "auto !important",
                height: "max-content",
                overflowY: "scroll",
                overflowX: "hidden",
                display: "flex",
                padding: "15px 20px",
                flexDirection: "column-reverse",
            }}>
                {messagesSplittedToColumns?.map((column) => (column.length > 0 ?
                    <Box
                        sx={{
                            display: "flex",
                            width: "max-content",
                            alignItems: column[0]?.user === userData.email ? "flex-end" : "flex-start",
                            margin: "10px 0",
                            marginLeft: column[0]?.user === userData.email ? "auto" : "-13px",
                            position: "relative",
                            maxWidth: "100%"
                        }}
                    >
                        {column[0]?.user !== userData.email &&
                            <Avatar
                                sx={{marginBottom: "15px", position: "sticky", top: "calc(100% - 40px)"}}
                                alt={friendData?.email}
                                src="/adslfjasdf"
                            />
                        }
                        <Box
                            sx={{
                                display: "flex",
                                width: "max-content",
                                flexDirection: "column",
                                alignItems: column[0]?.user === userData.email ? "flex-end" : "flex-start",
                                margin: "10px 0",
                                marginLeft: column[0]?.user === userData.email ? "auto" : "0",
                                // position: "relative"
                            }}
                        >
                            {column.map((message, indexInCol) => (
                                <Message
                                    message={message}
                                    i={message.i}
                                    isLastInColumn={column.length - 1 === indexInCol}
                                    isFirstInColumn={indexInCol === 0}
                                />
                            ))}
                        </Box>
                    </Box>
                : ""))}
            </Box>
            <Box sx={{
                padding: "15px 15px",
                paddingTop: "0",
            }}>
                <SendMessageInput/>
            </Box>
        </>
    )
}

export const Chat = (props) => {
    const loading = useSelector(state => state.chat.loading);
    return (loading ?
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", flex: "1", flexDirection: "column"}}>
            <CircularProgress color="primary" size="100px"/>
        </Box>
        :
        <ChatContent {...props} /> 
    )
}