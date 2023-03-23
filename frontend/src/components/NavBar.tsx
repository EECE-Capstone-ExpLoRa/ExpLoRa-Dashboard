import { Box, Flex, Heading, HStack, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import SignInOutButton from "./SignInOutButton";

const NavBar = () => {
    return (
        <Flex direction='row' justifyContent='space-between' alignItems='center'>
        <Flex>
          <Link to="/">
            <Flex paddingX={6} marginY={6}>
              <Image src="/ExpLoRa@2x.png" height={7}/>
            </Flex>
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