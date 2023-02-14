import { ChakraProvider } from '@chakra-ui/react';
import './App.css';
import Register from './components/Register';
import SignIn from './components/SignIn';

const App = () => {
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
        
        <Register/>
      </div>
    </ChakraProvider>
  );
}

export default App;
