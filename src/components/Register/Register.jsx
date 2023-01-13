import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Fade, FormControl, MobileStepper, Slide, StepContent, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setAuth } from "../../redux/auth";
import { ButtonCTA } from "../ButtonCTA/ButtonCTA";
import { InputCTA } from "../InputCTA/InputCTA";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import { getDatabase, ref, set } from "firebase/database";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });


const useStyles = makeStyles((theme) => ({
    text: {
        color: theme.palette.text.main
    },
    title: {
        paddingBottom: 0
    },
    desc: {
        paddingBottom: 8
    }
}))

const Step1 = React.forwardRef((props, ref) => {
    const classes = useStyles();

    return (
        <div ref={ref}>
            <form onSubmit={(event) => event.preventDefault()}>
            <DialogContent className={classes.text}>
                <Typography className={classes.desc}>
                    Enter your email
                </Typography>
                <Divider/>
                <DialogContentText>
                    <FormControl sx={{paddingTop: "10px", marginBottom: "-10px"}}>
                        <InputCTA onChange={(event) => props.setEmail(event.target.value)} value={props.value} type="string" label="Email" />
                    </FormControl>
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{display: "flex", justifyContent: "left", padding: "0 20px", paddingBottom: "10px"}}>
                {/* <ButtonCTA color="primary" variant='contained' onClick={() => loginWithGoogle(dispatch)}>Sign in with google</ButtonCTA> */}
                {/* <Button color="primary" variant='outlined' onClick={() => loginWithGoogle(dispatch)}>Auth</Button> */}
            {/* <Button onClick={handleClose}>Close</Button> */}
                    <ButtonCTA
                        type="submit"
                        style={{flex: "1", boxSizing: "border-box"}}
                        color="primary"
                        variant='contained'
                        onClick={() => {
                            // next("erterj05@gmail.com", "password123")
                            props.setCurStep(1)
                        }}
                        disabled={!props.value}
                    >
                        Next <KeyboardArrowRight />
                    </ButtonCTA>
            </DialogActions>
            </form>
        </div>
    )
})

const Step2 = React.forwardRef((props, ref) => {
    const classes = useStyles();

    return (
        <div ref={ref}>
            <form onSubmit={(event) => event.preventDefault()}>
            <DialogContent className={classes.text}>
                <Typography className={classes.desc}>
                    Enter any password
                </Typography>
                <Divider/>
                <DialogContentText>
                    <FormControl sx={{paddingTop: "10px", marginBottom: "-10px"}}>
                        <InputCTA onChange={(event) => props.setPassword(event.target.value)} value={props.value} type="password" label="Password" />
                    </FormControl>
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{display: "flex", justifyContent: "left", padding: "0 20px", paddingBottom: "10px"}}>
                {/* <ButtonCTA color="primary" variant='contained' onClick={() => loginWithGoogle(dispatch)}>Sign in with google</ButtonCTA> */}
                {/* <Button color="primary" variant='outlined' onClick={() => loginWithGoogle(dispatch)}>Auth</Button> */}
            {/* <Button onClick={handleClose}>Close</Button> */}
                <ButtonCTA
                    style={{flex: "1", boxSizing: "border-box"}}
                    color="primary"
                    variant='contained'
                    onClick={() => {
                        // next("erterj05@gmail.com", "password123")
                        props.setCurStep(0)
                    }}
                >
                    <KeyboardArrowLeft /> Back
                </ButtonCTA>
                <ButtonCTA
                    type="submit"
                    style={{flex: "1", boxSizing: "border-box"}}
                    color="primary"
                    variant='contained'
                    onClick={() => {
                        // next("erterj05@gmail.com", "password123")
                        props.setCurStep(2)
                    }}
                >
                    Next <KeyboardArrowRight />
                </ButtonCTA>
            </DialogActions>
            </form>
        </div>
    )
})

const Step3 = React.forwardRef((props, ref) => {
    const classes = useStyles();

    return (
        <div ref={ref}>
            <form onSubmit={(event) => event.preventDefault()}>
                <DialogContent className={classes.text}>
                    <Typography className={classes.desc}>
                        Enter same password again
                    </Typography>
                    <Divider/>
                    <DialogContentText>
                        <FormControl sx={{paddingTop: "10px", marginBottom: "-10px"}}>
                            <InputCTA onChange={(event) => props.setPassword(event.target.value)} value={props.value} type="password" label="Repeat Password" />
                        </FormControl>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{display: "flex", justifyContent: "left", padding: "0 20px", paddingBottom: "10px"}}>
                    {/* <ButtonCTA color="primary" variant='contained' onClick={() => loginWithGoogle(dispatch)}>Sign in with google</ButtonCTA> */}
                    {/* <Button color="primary" variant='outlined' onClick={() => loginWithGoogle(dispatch)}>Auth</Button> */}
                {/* <Button onClick={handleClose}>Close</Button> */}
                    <ButtonCTA
                        style={{flex: "1", boxSizing: "border-box"}}
                        color="primary"
                        variant='contained'
                        onClick={() => {
                            // next("erterj05@gmail.com", "password123")
                            props.setCurStep(1)
                        }}
                    >
                        <KeyboardArrowLeft /> Back
                    </ButtonCTA>
                    <ButtonCTA
                        type="submit"
                        style={{flex: "1", boxSizing: "border-box"}}
                        color="primary"
                        variant='contained'
                        onClick={() => {
                            props.finish()
                            props.setCurStep(3)
                        }}
                        disabled={props.value?.length < 5}
                    >
                        Finish
                    </ButtonCTA>
                </DialogActions>
            </form>
        </div>
    )
})

const Loading = React.forwardRef((props, ref) => {
    const classes = useStyles();

    return (
        <div ref={ref}>
            <CircularProgress
                size="100px"
                sx={{
                    margin: "50px"
                }}
                color={"primary"}
            />
        </div>
    )
})

const Success = React.forwardRef((props, ref) => {
    const classes = useStyles();

    return (
        <div ref={ref}>
            <DialogTitle className={classes.text}>Success</DialogTitle>
            <DialogContent className={classes.text}>
                <DialogContentText color="text.main">
                    Now you can join our community
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{display: "flex", justifyContent: "left", padding: "0 20px", paddingBottom: "10px"}}>
                <ButtonCTA
                    type="submit"
                    style={{flex: "1", boxSizing: "border-box"}}
                    color="primary"
                    variant='contained'
                >
                    Go to main page
                </ButtonCTA>
            </DialogActions>
        </div>
    )
})

export const Register = () => {
    const auth = getAuth();
    const classes = useStyles();
    const [userData, setUserData] = useState({});
    const dispatch = useDispatch();
    const [currentStep, setCurStep] = useState(0);
    const [prevStep, setPrevStep] = useState(0);
    const [lastStep, setLastStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const state = useSelector(state => state);
    const [isOnStart, setOnStart] = useState(true);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const db = getDatabase()

    useEffect(() => {
        setTimeout(() => setOnStart(false), 200)
    }, [])

    const setStep = (value) => {
        setLastStep(currentStep)
        console.log("prev: ", value, "cur: ", currentStep);
        setPrevStep(value)
        setTimeout(() => {
            setCurStep(value);
        }, 200)
    }

    const finish = () => {
        setLoading(true)
        if(email && password === password2) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log(email.replace("@", "").replace(".", ""), userCredential.user.uid);
                    set(ref(db, `users/${email.split("").filter(a => a !== "@" && a !== ".").join('')}`), {
                        uid: user.uid,
                        email: email,
                    });
                    dispatch(setUserData(user))
                    setLoading(false);

                    navigate("/")
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setLoading(false);
                });
        }
    }

    return (
        <Dialog
            TransitionComponent={Transition}
            maxWidth={"1200px"}
            minWidth="1000px"
            open={true}
        >
            <div style={{overflow: "hidden"}}>
                <DialogTitle sx={{margin: "0 0  0 -15px", display: "flex", alignItems: "center", paddingBottom: "0"}} className={classes.text}>
                    <IconButton onClick={() => {navigate(-1)}} color="text"><ArrowBackIcon color="text.main"/></IconButton> Create account
                </DialogTitle>
                {currentStep === 0 &&
                    <Slide direction={currentStep === prevStep ? (lastStep < prevStep ? "left" : "right") : (currentStep >= prevStep ? "left" : "right")} timeout={!isOnStart && 200} in={currentStep === prevStep}>
                        <Step1 setEmail={setEmail} value={email} setCurStep={setStep}/>
                    </Slide>
                }
                {currentStep === 1 &&
                    <Slide direction={currentStep === prevStep ? (lastStep < prevStep ? "left" : "right") : (currentStep >= prevStep ? "left" : "right")} timeout={200} in={currentStep === prevStep}>
                        <Step2 setPassword={setPassword} value={password} setCurStep={setStep}/>
                    </Slide>
                }
                {currentStep === 2 &&
                    <Slide direction={currentStep === prevStep ? (lastStep < prevStep ? "left" : "right") : (currentStep >= prevStep ? "left" : "right")} timeout={200} in={currentStep === prevStep}>
                        <Step3 setPassword={setPassword2} value={password2} setCurStep={setStep} finish={finish}/>
                    </Slide>
                }
                {currentStep === 3 &&
                    (loading ?
                        <Slide direction="top" timeout={200} in={true}>
                            <Loading/>
                        </Slide>
                        :
                        <Success/>
                    )
                }
            </div>
            <MobileStepper
                style={{margin: "0 auto"}}
                steps={4}
                position="static"
                activeStep={currentStep}
            />
        </Dialog>
    )
}
