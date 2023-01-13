import { AppBar, CircularProgress, Divider, Grid, IconButton, Input, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper, Toolbar, Typography } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { ButtonCTA } from "../ButtonCTA/ButtonCTA"
import { getDatabase, ref, set, get, child, onValue, push } from "firebase/database";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { getAuth, signOut } from "firebase/auth";
import { InputCTA } from "../InputCTA/InputCTA";
import { setAuth } from "../../redux/auth";
import { selectChat, setChatData, setFriendData } from "../../redux/chat";
import { Chat } from "../Chat/Chat";
import { removeWrongSymbols } from "../../utils/removeWrongSymbols";
import { addToChatLists } from "../../utils/addToChatLists";
import MenuIcon from '@mui/icons-material/Menu';
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(theme => ({
    TopBar: {
        display: "none",
        width: "100%",
        [theme.breakpoints.down('sm')]: {
            display: "block"
        },
    },
    Navigation: {
        transform: "translate(0)",
        [theme.breakpoints.down('sm')]: {
            position: "absolute",
            transition: "0.1s ease",
            transform: "translate(-100%)",
            height: "100vh",
            marginTop: "-56px",
            // flex: "1"
            width: "80%",
            zIndex: "10"
        },
    },
}))

const MainContent = () => {
    const userData = useSelector(state => state.authReducer?.data)
    const db = getDatabase();
    const dbRef = ref(db);
    const [isOpened, setOpened] = useState(false)
    let classes = useStyles({isOpened})
    const chatData = useSelector(state => state.chat);
    const messages = useSelector(state => state.chat.messages);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState("");
    const [friendEmail, setFriendEmail] = useState("");
    const friendData  = useSelector(state => state.chat.friendData);
    const selectedChat = useSelector(state => state.chat.uid);
    const dispatch = useDispatch();

    console.log("userdata", selectedChat)

    useEffect(() => {
        if(selectedChat) {
            const messagesRef = ref(db, `${selectedChat}`);
            onValue(messagesRef, (snapshot) => {
                const data = snapshot.val();
                dispatch(setChatData({...chatData, ...data, messages: data.messages, uid: selectedChat}));
                setLoading(false)
            });
            onValue(ref(db, `users/${removeWrongSymbols(userData.email)}`), (snapshot) => {
                const data = snapshot.val();
                let result = [];
                (async () => {
                    await data.chats.forEach((a) => {
                        // console.log("a", a)
                        get(child(dbRef, a)).then((chatObject) => {
                            let email = chatObject.val().users?.find((b) => b !== userData.email);
                            console.log("chatObject", a)
                            result = [...result, {
                                uid: a,
                                email
                            }]
                            console.log("result", result)
                            dispatch(setAuth({...userData, userData: {...data, chats: result}}));
                        })
                    })
                })()

            });
        }
    }, [friendData, selectedChat])

    return <>
        <Box display={{height: "100vh", display: "flex", flexDirection: "column"}}>
            <Box className={classes.TopBar}>
                <AppBar position="static">
                    <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => setOpened(!isOpened)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Chatapp
                    </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
            <Box display={{display: "flex", flex: "1"}}>
                <Box
                    className={classes.Navigation}
                    sx={{transform: isOpened && "translate(0)", translate: "0.2s ease"}}
                >
                    <Paper
                        color="inputPaper.main"
                        component="form"
                        sx={{
                            height: "100%",
                            width: "100%",
                        }}
                    >
                        <Paper
                            color="inputPaper.main"
                            component="form"
                            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "100%" }}
                        >
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}
                                onClick={() => setOpened(!isOpened)}
                            >
                                <MenuIcon />
                            </IconButton>
                            <InputCTA onChange={(event) => setFriendEmail(event.target.value)} value={friendEmail} label="email"></InputCTA>
                            <ButtonCTA onClick={() => {
                                get(child(dbRef, `users/${removeWrongSymbols(friendEmail)}`)).then((userSnapshot) => {
                                    if (userSnapshot.exists()) {
                                        console.log("usersnap", friendEmail, userSnapshot.val().uid, userData.email, userData.uid)
                                        dispatch(setFriendData(userSnapshot.val()));
                                        let newSelectedChat = `${userData.uid}&${userSnapshot.val().uid}`;
                                        get(child(dbRef, newSelectedChat)).then((snapshot2) => {
                                            if(snapshot2.val()) {
                                                newSelectedChat = `${userData.uid}&${userSnapshot.val().uid}`;
                                                return;
                                            }
                                            newSelectedChat = `${userSnapshot.val().uid}&${userData.uid}`;

                                            set(ref(db, `${newSelectedChat}/users`), [userData.email, friendEmail]);
                                            dispatch(selectChat(newSelectedChat))
                                            addToChatLists(db, userData, userSnapshot.val(), newSelectedChat);
                                        })
                                        
                                    } else {
                                        console.log("No data available");
                                    }
                                })
                            }}>FIND</ButtonCTA>
                        </Paper>
                        <List
                            sx={{ width: '100%', flex: "1", bgcolor: 'background.paper' }}
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                        >
                            <Divider/>
                            {
                                <>
                                    {userData?.userData?.chats?.map(({uid, email}) => <>
                                        <ListItemButton selected={uid === selectedChat} onClick={() => dispatch(selectChat(uid))} sx={{color: "text.main", width: "100%", height: "70px", marginTop: "2px"}}>
                                            <ListItemText fontSize={20} style={{fontSize: 25, color: "text.main"}} primary={email} secondary="Jan 9, 2014"/>
                                        </ListItemButton>
                                        <Divider/>
                                    </>)}
                                </>

                            }
                        </List>
                        <ButtonCTA onClick={() => {
                            signOut(getAuth())
                            dispatch(setAuth({}))
                        }} color="primary" variant='contained'>
                            Sign out
                        </ButtonCTA>
                        <ButtonCTA color="primary" variant='contained' href="/auth">
                            Sign in
                        </ButtonCTA>
                        <ButtonCTA color="primary" variant='contained' href="/register">
                            Register
                        </ButtonCTA>
                    </Paper>
                </Box>
                <Box sx={{flex: "1", boxSizing: "border-box", maxHeight: "100vh", flex: "1", display: "flex", flexDirection: "column", padding: "15px 15px"}} xs={7}>
                    <Chat/>
                </Box>
            </Box>
        </Box>
    </>
}

export const Main = () => {
    const userData = useSelector(state => state.authReducer?.data)

    return userData.email ?
        <MainContent/>
        :
        <CircularProgress size="100" color="primary"/>
}
