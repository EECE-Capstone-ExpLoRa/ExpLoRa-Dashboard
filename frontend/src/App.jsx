import { ChakraProvider } from '@chakra-ui/react';
import './App.css';
import Register from './components/Register';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import SignIn from './components/SignIn';
import LogIn from './components/LogIn';
import Home from './components/Home';
import NoMatch from './components/NoMatch';
import SignUp from './components/SignUp';

function App() {
  return (
    <ChakraProvider>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F8B195',
        }}
      >
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<LogIn />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </Router>
      </div>
    </ChakraProvider>
  );
}

export default App;
