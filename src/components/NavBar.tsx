import { Flex, Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import SignInOutButton from "./SignInOutButton";

const NavBar = () => {
    return (
        <Flex direction='row' justifyContent='space-between' alignItems='center'>
        <Flex>
          <Link to="/">
            <Heading as='h2' size='3xl' margin='12px' textColor='test.100'>ExploRa</Heading>
          </Link>
        </Flex>

        <Flex>
            <SignInOutButton linkTo='/signin' buttonText='Sign In'/>
            <SignInOutButton linkTo='/register' buttonText='Register'/>
        </Flex>
      </Flex>
    )
};

export default NavBar;