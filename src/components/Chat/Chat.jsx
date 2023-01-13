import { Box, CircularProgress, Divider, IconButton, InputBase, Paper } from "@mui/material";
import { child, get, getDatabase, ref, set } from "firebase/database";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { removeWrongSymbols } from "../../utils/removeWrongSymbols";
import { selectChat } from "../../redux/chat";
import { addToChatLists } from "../../utils/addToChatLists";

export const Chat = ({loading}) => {
    const userData = useSelector(state => state.authReducer?.data)
    const db = getDatabase();
    const dbRef = ref(db);
    const messages = useSelector(state => state.chat.messages);
    const [newMessage, setNewMessage] = useState("");
    const friendData = useSelector(state => state.chat.friendData);
    const dispatch = useDispatch();
    const selectedChat = useSelector(state => state.chat.uid);

    console.log("userdata", selectedChat)

    return (
        <>
            <Box sx={{display: "flex", flex: "1", flexDirection: "column"}}>
                {loading &&
                    <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", flex: "1", flexDirection: "column"}}>
                        <CircularProgress color="primary" size="100px"/>
                    </Box>
                }
                {messages?.map((a) => (
                    <Box color="text.main">
                        {`${a.user}: ${a.content}`}
                    </Box>
                ))}
            </Box>
            <Paper
                color="inputPaper.main"
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "100%" }}
            >
                <InputBase
                    color="text.main"
                    // style={{background: "rgb(100, 100, 100)"}}
                    sx={{ ml: 1, flex: 1, color: "text.main" }}
                    placeholder="Any message"
                    onChange={(event) => {
                        setNewMessage(event.target.value)
                    }}
                    value={newMessage}
                    // inputProps={{ 'aria-label': 'search google maps' }}
                />
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <IconButton
                    onClick={() => {
                        let newSelectedChat = `${userData.uid}&${friendData.uid}`;
                        if(!selectedChat) {
                            get(child(dbRef, newSelectedChat)).then((snapshot) => {
                                if(!snapshot.val()) {

                                    newSelectedChat = `${friendData.uid}&${userData.uid}`;
                                    get(child(dbRef, `${newSelectedChat}`)).then((resp) => {
                                        set(ref(db, `${newSelectedChat}`), {
                                            ...resp.val(),
                                        });
                                    })
                                    // get(child(dbRef, newSelectedChat)).then((snapshot2) => {
                                    //     if(!snapshot2.val()) {
                                    //     }
                                    // })
                                }
                                get(child(dbRef, `${newSelectedChat}/messages`)).then((resp) => {
                                    console.log(resp.val())
                                    set(ref(db, `${newSelectedChat}/messages/${resp?.val()?.length || 0}`), {
                                        user: userData.email,
                                        content: newMessage
                                    });
                                    dispatch(selectChat(newSelectedChat))
                                })
                            })
                        } else {
                            set(ref(db, `${selectedChat}/messages/${messages?.length || 0}`), {
                                user: userData.email,
                                content: newMessage
                            });
                            newSelectedChat = selectedChat
                        }
                    }}
                    color="primary"
                    sx={{ p: '10px' }}
                    aria-label="directions"
                >
                    <SendRoundedIcon />
                </IconButton>
            </Paper>
        </>
    )
}