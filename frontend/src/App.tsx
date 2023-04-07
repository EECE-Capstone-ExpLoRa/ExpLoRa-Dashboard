import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import LogIn from './components/LogIn';
import Register from './components/Register';
import theme from './utils/theme';
import NoMatch from './components/NoMatch';
import DashboardContainer from './components/dashboard/DashboardContainer';
import NavBar from './components/NavBar';
import Profile from './components/Profile';
import './components/dashboard/dashboard.css';

function App() {
  return (
    <ChakraProvider theme={theme}>
        <Router>
          <NavBar/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/signin" element={<LogIn />} />
            <Route path="/dashboard" element={<DashboardContainer />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </Router>
    </ChakraProvider>
  );
}

export default App;
