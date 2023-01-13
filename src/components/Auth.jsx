import { async } from '@firebase/util';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Slide, TextField, Typography } from '@mui/material';
import { green } from '@mui/material/colors';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import { GoogleAuthProvider, signInWithPopup, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useLocation, useNavigate } from 'react-router';
import { setAuth } from '../redux/auth';
import { ButtonCTA } from './ButtonCTA/ButtonCTA';
import { InputCTA } from './InputCTA/InputCTA';
import LoginIcon from '@mui/icons-material/Login';
import GoogleIcon from '@mui/icons-material/Google';
import TwitterIcon from '@mui/icons-material/Twitter';
import { child, get, getDatabase, ref } from 'firebase/database';
import { Link } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

async function loginWithGoogle(dispatch) {
    try {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();

        const { user } = await signInWithPopup(auth, provider);

        console.log("user", user);

        dispatch(setAuth(user))

        return { uid: user.uid, displayName: user.displayName };
    } catch (error) {
        if (error.code !== 'auth/cancelled-popup-request') {
            console.error(error);
        }

        return null;
    }
}

const useStyles = makeStyles((theme) => ({
    text: {
        color: theme.palette.text.main
    }
}))

const removeWrongSymbols = (a) => a.split('').filter(a => a !== "@" && a !== ".").join('')

export const Auth = () => {
    const classes = useStyles();
    const [userData, setUserData] = useState({});
    const dispatch = useDispatch();
    const state = useSelector(state => state);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const db = getDatabase();
    const dbRef = ref(db);
    const navigate = useNavigate();

    const next = (email, password) => {
        setLoading(true)
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                get(child(dbRef, `users/${removeWrongSymbols(email)}`)).then((userSnapshot) => {
                    const user = {
                        ...userCredential.user,
                        userData: userSnapshot.val()
                    };
                    dispatch(setAuth(user))
                })
                navigate('/')
                setLoading(false)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setLoading(false)
            });

    }

    return (
        <Dialog
            TransitionComponent={Transition}
            maxWidth={"1200px"}
            minWidth="1000px"
            open={true}
        >
           <DialogTitle className={classes.text}>Sign in</DialogTitle>
            <DialogContent className={classes.text}>
                <DialogContentText>
                    <FormControl sx={{paddingTop: "10px", marginBottom: "-10px"}}>
                        <InputCTA onChange={(event) => setEmail(event.target.value)} type="string" label="Email" />
                        <InputCTA onChange={(event) => setPassword(event.target.value)} type="password" label="Password"/>
                    </FormControl>
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{display: "flex", flexDirection: "column", justifyContent: "left", padding: "0 20px", paddingBottom: "10px"}}>
                <ButtonCTA sx={{margin: "0 0 15px 0", width: "100%"}} color="primary" variant='contained' onClick={() => next(email, password)}>
                    {loading ?
                        <CircularProgress color="text" />
                        :
                        <>
                            <LoginIcon sx={{padding: "0 5px 0 0"}} /> Log in
                        </>
                    }
                </ButtonCTA>
                <Button style={{margin: "0 0 5px 0"}} sx={{width: "100%"}} color="primary" variant='outlined' onClick={() => loginWithGoogle(dispatch)}>
                    <GoogleIcon sx={{padding: "0 5px 0 0"}}/>
                    Sign in with google
                </Button>
                <Button style={{margin: "0"}} sx={{width: "100%"}} color="primary" variant='outlined' onClick={() => loginWithGoogle(dispatch)}>
                    <TwitterIcon/>
                    Sign in with twitter
                </Button>
            </DialogActions>
            <Box sx={{display: "flex", justifyContent: "center", width: "100%", padding: "6px 0"}}>
                <Link color="text.main" to={"/register"}>Sign Up</Link>
            </Box>
        </Dialog>
    )
}
