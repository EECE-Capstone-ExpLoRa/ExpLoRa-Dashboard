import { Flex, Heading } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchCurrentUser } from "../services/user.service";
import SignInOutButton from "./SignInOutButton";

const NavBar = () => {
  
  const user = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    retry: false
  }); // I think maybe but this in root directory? and then get data here through queryClient?

  if (user.isError) {
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
  }

  if (user.isLoading) {
    return (
      <div>Loading...</div>
    );
  }
  
  return <></>
    
};

export default NavBar;