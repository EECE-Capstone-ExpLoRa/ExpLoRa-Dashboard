import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import LogIn from './components/LogIn';
import Register from './components/Register';
import theme from './utils/theme';
import NoMatch from './components/NoMatch';
import NavBar from './components/NavBar';

function App() {
  return (
    <ChakraProvider theme={theme}>
      {/* <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8B195',
        height: '100vh'
      }}> */}
        <Router>
        <NavBar/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/signin" element={<LogIn />} />
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </Router>
      {/* </div> */}
    </ChakraProvider>
  );
}

export default App;
