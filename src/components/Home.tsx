import { Flex } from "@chakra-ui/react";
import React from "react";
// importing Link from react-router-dom to navigate to 
// different end points.
import NavBar from "./NavBar";

const Home = () => {
  return (
    <div>
      <NavBar/>
      
      <Flex direction='column' align='center' justify='center' backgroundColor='test2.100' h='100vh'>
        {/* <UnorderedList>
          <ListItem>
            <Link to="/">Home</Link>
          </ListItem>
          <ListItem>
            <Link to="/signin">Sign In</Link>
          </ListItem>
          <ListItem>
            <Link to="/register">Register</Link>
          </ListItem>
        </UnorderedList>
        <Outlet/> */}
      </Flex>
    </div>
  );
};

export default Home;
