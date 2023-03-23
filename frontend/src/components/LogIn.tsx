import { Box, Button, Flex, useToast, VStack } from "@chakra-ui/react";
import { Formik } from "formik";
import { login } from "../services/user.service";
import { loginUserObject } from "../utils/loginUser.dto";
import { FormInputField } from "./FormInputField";
import * as Yup from 'yup';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const LogIn = () => {
  const toast = useToast();

  const navigate = useNavigate()
  return (
    <Formik
    initialValues={{username: '',password: '',}}
    validationSchema={Yup.object({
      username: Yup.string().required('Username is required').min(6, 'Username must be at least 6 characters long'),
      password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters long')
    })}
    onSubmit={async (values, action) => {
      toast({
        title: 'Invalid username or password',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      const user: loginUserObject = {
        username: values.username,
        password: values.password,
      };
      alert(JSON.stringify(user, null, 2));
      const loginRes = await login(user);
      action.resetForm();
      navigate('/dashboard')
    }}
    >
      {formik => (
            <Flex bg='test2.100' align='center' justify='center' h='100vh'>
            <Box bg='white' p={10} rounded='md' w='25%'>
             <form onSubmit={formik.handleSubmit}>
               <VStack spacing={4} align='flex-start'>
                 <FormInputField label='Username' required={true} id='username' name='username' type='text' variant='filled'/>
                 <FormInputField label='Password' required={true} id='password' name='password' type='password' variant='filled'/>
                 <Button type="submit" colorScheme="test2" width="full" color='white'>Log In</Button>
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
