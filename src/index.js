import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {Auth as AuthPage} from './components/Auth'

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "@firebase/firestore"
import { Provider } from 'react-redux'
import { createRoutesFromElements, Route, RouterProvider, Routes } from 'react-router';
import store from './redux/store'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { green, grey, teal } from '@mui/material/colors';
import { BrowserRouter, createBrowserRouter, HashRouter } from 'react-router-dom';
import Auth from './redux/auth';
import { PersistGate } from 'redux-persist/integration/react'
import {persistStore} from 'redux-persist';
import { getDatabase } from "firebase/database";
import { Main } from './components/Main/Main';
import { Register } from './components/Register/Register';
// import CssBaseline from "@material-ui/core/CssBaseline";
// import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPQV6fSdI2Smb6s8MfHkVfksjESJWWOZQ",
  authDomain: "chatapp-147e3.firebaseapp.com",
  projectId: "chatapp-147e3",
  storageBucket: "chatapp-147e3.appspot.com",
  messagingSenderId: "748458451404",
  appId: "1:748458451404:web:2dd5a99b3d0d1e71337d69",
  measurementId: "G-06VZJTXXTL",
  databaseURL: "https://chatapp-147e3-default-rtdb.europe-west1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
console.log("database", database)
const analytics = getAnalytics(app);
export const firestore = getFirestore(app);

const root = ReactDOM.createRoot(document.getElementById('root'));


const theme = createTheme({
  palette: {
    primary: {
      main: "#135c27",
      light: "#78a85d",
      dark: "#78a85d",
      contrastText: "#fff",
    },
    textInput: {
      main: "#fff",
      light: "#fff",
      dark: "#fff",
      contrastText: "#fff",
      color: "#fff"
    },
    inputPaper: {
      main: "#fff",
      light: "#fff",
      dark: "#fff",
      contrastText: "#fff",
      paper: "#fff",
    },
    text: {
      main: green[100],
    },
    typography: {
      color: green[100]
    },
    secondary: {
      light: '#373739',
      main: '#0044ff',
      contrastText: '#9afb9f',
    },
    custom: {
      light: '#ffa726',
      main: '#f57c00',
      dark: '#ef6c00',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    background: {
      default: "#001a1c",
      paper: "#012224",
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
});


let persistor = persistStore(store)

root.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <React.StrictMode>
          <CssBaseline/>
          <App />
          <HashRouter basename={process.env.PUBLIC_URL + "/"}>
          {/* <HashRouter basename={@}> */}
            {/* <Route path="/"> */}
              <Routes>
                <Route
                  index
                  element={<Main/>}
                />
                <Route
                  path="/auth"
                  element={<AuthPage/>}
                />
                <Route
                  path="/register"
                  element={<Register/>}
                />
              </Routes>
            {/* </Route> */}
          </HashRouter>
        </React.StrictMode>
      </PersistGate>
    </Provider>
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
