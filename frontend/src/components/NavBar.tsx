import { Flex, Image } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { queryClient } from "..";
import exploraApi from "../services/api";
import { fetchCurrentUser, logout } from "../services/user.service";
import SignInOutButton from "./SignInOutButton";

const NavBar = () => {
  
  const user = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    retry: false
  });

  if (user.isError) {
    return (
      <Flex direction='row' justifyContent='space-between' alignItems='center' backgroundColor='brand.300'>
      <Flex>
        <Link to="/">
          <Flex margin='14px 0px' padding='0px 8px'>
            <Image src="/Explora-Name.svg" height='16' />
          </Flex>
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

  const handleLogout = async () => {
    await logout();
    exploraApi.defaults.headers.common.Authorization = undefined; 
    queryClient.removeQueries({queryKey: ['userDevices']});
    queryClient.resetQueries({queryKey: ['currentUser']});
  };
  
  return (
    <Flex direction='row' justifyContent='space-between' alignItems='center'>
      <Flex>
        <Link to="/dashboard">
          <Flex paddingX={6} marginY={6}>
              <Image src="/ExpLoRa@2x.png" height={7}/>
          </Flex>
        </Link>
      </Flex>
      
      <Flex>
        <Link to="/profile">
          <Flex alignItems='center' paddingRight='12px'>
            <Image src='/profileIcon.png' padding='5px' height={7}/> My Profile
          </Flex>
        </Link>

        <Link to="/" onClick={handleLogout}>
          <Flex alignItems='center' paddingLeft='12px'>
            Logout <Image src='/logout-svgrepo-com.svg' padding='5px' paddingRight='12px' height={7}/>
          </Flex>
        </Link>
      </Flex>
    </Flex>
  )
    
};

export default NavBar;