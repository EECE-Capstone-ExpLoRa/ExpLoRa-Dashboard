import { Box, Button, Flex, useToast, VStack } from "@chakra-ui/react";
import { Formik } from "formik";
import { login } from "../services/user.service";
import { loginUserObject } from "../utils/loginUser.dto";
import { FormInputField } from "./FormInputField";
import * as Yup from 'yup';

const LogIn = () => {
  console.log("Render")
  const toast = useToast();

  // const { isError, isSuccess, isLoading, data, error } = useQuery(

  // )

  
  return (
    <Formik
    initialValues={{username: '',password: '',}}
    validationSchema={Yup.object({
      username: Yup.string().required('Username is required').min(6, 'Username must be at least 6 characters long'),
      password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters long')
    })}
    onSubmit={async (values, action) => {
      console.log('Log in submit has been called');
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
      console.log(`Response is: ${loginRes}`);
      action.resetForm();
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
               </VStack>
             </form>
            </Box>
         </Flex>
      )}
    </Formik>
  );
};

export default LogIn;
