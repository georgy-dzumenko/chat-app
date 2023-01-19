import logo from './logo.svg';
import './App.css';
import { Auth } from './components/Auth';
import { makeStyles } from '@mui/styles';
import { Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { Route, Routes, useLocation, useNavigate } from 'react-router';
import { Register } from './components/Register/Register';
import { Main } from './components/Main/Main';
import { useEffect } from 'react';

function App() {
  const {data} = useSelector(({authReducer}) => authReducer)
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(()=>{
    if(!data.uid && !location.pathname.includes("register")) {
      navigate("/auth")
    }
  }, [])

  return (
    <div>
      {/* <Typography variant='h1'>{data.displayName}</Typography> */}
      
    </div>
  );
}

export default App;
