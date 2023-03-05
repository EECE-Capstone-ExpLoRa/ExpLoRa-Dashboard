import { Flex, ListItem, UnorderedList } from "@chakra-ui/react";
import React from "react";
// importing Link from react-router-dom to navigate to 
// different end points.
import {
  Link,
  Outlet
} from "react-router-dom";
  
export const Home = () => {
  return (
    <Flex align='center' justify='center' backgroundColor='backgroundColor' h='100vh'>
      <UnorderedList>
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
      <Outlet/>
    </Flex>
  );
};