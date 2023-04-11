import { Box, Button, Flex, useToast, VStack } from "@chakra-ui/react";
import { Formik } from "formik";
import { login } from "../services/user.service";
import { loginUserObject } from "../utils/loginUser.dto";
import { FormInputField } from "./FormInputField";
import * as Yup from 'yup';
import { Link } from "react-router-dom";
import exploraApi from "../services/api";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { queryClient } from "..";

const LogIn = () => {
  const toast = useToast();
  const navigate = useNavigate();  
  //logs the user in using the credentials, if successfully signed in, add the user's auth token to header and takes them to logged in landing page, else resets form and says invalid login
  const loginUserMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      toast({
        title: 'Logged In',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      exploraApi.defaults.headers.common.Authorization = `Bearer ${data.access_token}`; 
      queryClient.refetchQueries({queryKey: ['currentUser']});
      navigate('/dashboard'); //navigate to User screen?
    },
    onError: () => {
      toast({
        title: 'Incorrect username or password.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  })
  
  return (
    <Formik
    initialValues={{username: '',password: '',}}
    validationSchema={Yup.object({
      username: Yup.string().required('Username is required').min(6, 'Username must be at least 6 characters long'),
      password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters long')
    })}
    onSubmit={(values, action) => {
      const user: loginUserObject = {
        username: values.username,
        password: values.password,
      };
      loginUserMutation.mutate(user);
      action.resetForm();
    }}
    >
      {formik => (
            <Flex bg='gray.100' align='center' justify='center' h='100vh'>
            <Box bg='white' p={10} rounded='md' w='25%'>
             <form onSubmit={formik.handleSubmit}>
               <VStack spacing={4} align='flex-start'>
                 <FormInputField label='Username' required={true} id='username' name='username' type='text' variant='filled'/>
                 <FormInputField label='Password' required={true} id='password' name='password' type='password' variant='filled'/>
                 <Button type="submit" colorScheme="brand" width="full">Log In</Button>
                 <Link to="/register">Don't have an account yet?</Link>
               </VStack>
             </form>
            </Box>
         </Flex>
      )}
    </Formik>
  );
};

export default LogIn;
