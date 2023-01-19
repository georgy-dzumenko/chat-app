import { Avatar, CircularProgress, Divider, Grid, IconButton, Input, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper, Toolbar, Typography } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { ButtonCTA } from "../ButtonCTA/ButtonCTA"
import { getDatabase, ref, set, get, child, onValue, push } from "firebase/database";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { getAuth, signOut } from "firebase/auth";
import { InputCTA } from "../InputCTA/InputCTA";
import { setAuth } from "../../redux/auth";
import { selectChat, setChatData, setFriendData, setLoading } from "../../redux/chat";
import { Chat } from "../Chat/Chat";
import { removeWrongSymbols } from "../../utils/removeWrongSymbols";
import { addToChatLists } from "../../utils/addToChatLists";
import MenuIcon from '@mui/icons-material/Menu';
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

const useStyles = makeStyles(theme => ({
    Navigation: {
        transform: "translate(0)",
        [theme.breakpoints.down('sm')]: {
            position: "absolute",
            transition: "0.1s ease",
            transform: "translate(-100%)",
            height: "100vh",
            // flex: "1"
            width: "100%",
            zIndex: "10"
        },
    },
    itemListSelected: {
        background: "#fff"
    },
    '@global': {
        ".chip-animation-in": {
            animation: "$chip-animation-in 0.2s"
        },
        ".chip-animation-out": {
            transition: "0.2s ease",
            opacity: 0
        },
        ".highlight-message": {
            animation: "$myEffect 2s"
        },
        "@keyframes chip-animation-in": {
            "0%": {
                transform: "scale(0)"
            },
            "100%": {
                transform: "scale(1)"
            }
        },
        "@keyframes myEffect": {
            "0%": {
            //   opacity: 0,
                borderRadius: "20px",
                background: "none",
                boxShadow: "0 0 0 0 #fff"
            },
            "25%": {
                borderRadius: "20px",
                background: "#fff",
                boxShadow: "0 0 10px 0 #fff"
            },
            "100%": {
                borderRadius: "20px",
                background: "none",
                boxShadow: "0 0 0 0 #fff"
            }
        },
        '*::-webkit-scrollbar': {
          width: '0.4em'
        },
        '*::-webkit-scrollbar-track': {
          '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '*::-webkit-scrollbar-thumb': {
          background: 'linear-gradient(0deg, #135c27, #135c27, #78a85d)',
          borderRadius: "3px"
        },
        '*::selection': {
            display: "inline-block",
            background: "#fff",
            borderRadius: "3px",
            color: theme.palette.primary.main,
            textShadow: "#000 0 0 0",
            transition: "0.3s ease"
        }
      }
}))

const MainContent = () => {
    const userData = useSelector(state => state.authReducer?.data)
    const db = getDatabase();
    const dbRef = ref(db);
    const [isOpened, setOpened] = useState(true)
    let classes = useStyles({isOpened})
    const chatData = useSelector(state => state.chat);
    const messages = useSelector(state => state.chat.messages);
    const [newMessage, setNewMessage] = useState("");
    const [friendEmail, setFriendEmail] = useState("");
    const friendData  = useSelector(state => state.chat.friendData);
    const selectedChat = useSelector(state => state.chat.uid);
    const dispatch = useDispatch();

    useEffect(() => {
        if(selectedChat) {
            const messagesRef = ref(db, `${selectedChat}`);
            onValue(messagesRef, (snapshot) => {
                const data = snapshot.val();

                if(!data) {
                    dispatch(setChatData({}))
                    return
                }

                dispatch(setChatData({...chatData, ...data, messages: data.messages, uid: selectedChat}));
            });
            dispatch(setLoading(false))
        }
        onValue(ref(db, `users/${removeWrongSymbols(userData.email)}`), (snapshot) => {
            const data = snapshot.val();
            let result = [];
            (async () => {
                await data.chats.forEach((a) => {
                    get(child(dbRef, a)).then((chatObject) => {
                        let email = chatObject.val()?.users?.find((b) => b !== userData.email);
                        result = [...result, {
                            uid: a,
                            email
                        }]
                        dispatch(setAuth({...userData, userData: {...data, chats: result}}));
                    })
                })
            })()

        });
    }, [friendData, selectedChat])

    useEffect(() => {
        dispatch(setLoading(!selectedChat))
    }, [])

    return <>
        <Box display={{height: "100vh", overflowY: "hidden", display: "flex", flexDirection: "column"}}>
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
                            display: "flex",
                            flexDirection: "column"
                        }}
                    >
                        <Paper
                            color="inputPaper.main"
                            component="form"
                            sx={{ p: '2px 4px', display: "felx", alignItems: 'center', width: "100%" }}
                        >
                            <InputCTA onChange={(event) => setFriendEmail(event.target.value)} value={friendEmail} label="email"></InputCTA>
                            <ButtonCTA onClick={() => {
                                get(child(dbRef, `users/${removeWrongSymbols(friendEmail)}`)).then((userSnapshot) => {
                                    if (userSnapshot.exists()) {
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
                            component="nav"
                            sx={{ width: '100%', flex: "1", bgcolor: 'background.paper' }}
                            aria-labelledby="nested-list-subheader"
                        >
                            <Divider color="#444"/>
                            {
                                <>
                                    {userData?.userData?.chats?.map(({uid, email}) => <>
                                        <ListItemButton
                                            selected={uid === selectedChat}
                                            onClick={() => {
                                                dispatch(selectChat(uid))
                                                dispatch(setLoading(true))
                                                dispatch(setFriendData({uid, email}));
                                                setOpened(false)
                                            }}
                                            // color="secondary"
                                            sx={{
                                                width: "100%",
                                                height: "70px",
                                                "&.Mui-selected": {
                                                    backgroundColor: "secondary.main",
                                                    "&:hover": {
                                                        backgroundColor: "secondary.light",
                                                    }
                                                },
                                            }}
                                            // selectedItemStyle={{
                                            //     backgroundColor: 'red'
                                            // }}
                                            // classes={{selected: classes.itemListSelected}}
                                        >
                                            <ListItemIcon>
                                                <Avatar color="primary" alt={email} src="/static/images/avatar/1.jpg" />
                                            </ListItemIcon>
                                            <ListItemText
                                                fontSize={20}
                                                style={{fontSize: 25, color: "text.main"}}
                                                primary={email}
                                                primaryTypographyProps={{
                                                    color: 'text.main',
                                                    fontWeight: 'bold',
                                                    variant: 'body2',
                                                }}
                                                secondaryTypographyProps={{
                                                    color: 'text.main',
                                                    opacity: 0.5,
                                                    fontWeight: 'medium',
                                                    variant: 'body2',
                                                }}
                                                secondary="Jan 9, 2014"
                                            />
                                        </ListItemButton>
                                        <Divider color="#444"/>
                                    </>)}
                                </>

                            }
                        </List>
                        <Divider color="#444"/>
                        <Box sx={{display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", padding: "15px"}}>
                            <Avatar alt={userData.email} src="/asdlfjasdf" />
                            <Typography component="h3" color="text.main" variant="p">{userData.email?.slice(0, userData.email.split("").findIndex(a => a === "@"))}</Typography>
                            <IconButton onClick={() => {
                                signOut(getAuth())
                                dispatch(setAuth({}))
                            }} color="primary" variant='contained'>
                                <LogoutRoundedIcon/>
                            </IconButton>

                        </Box>
                    </Paper>
                </Box>
                <Box sx={{maxWidth: "100vw", paddingBottom: "55px", position: "relative", flex: "1", boxSizing: "border-box", maxHeight: "100vh", flex: "1", display: selectedChat ? "flex" : "none", flexDirection: "column"}} xs={7}>
                    <Chat setOpened={setOpened}/>
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
