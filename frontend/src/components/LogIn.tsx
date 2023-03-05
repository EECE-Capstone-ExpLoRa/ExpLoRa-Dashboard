import { Box, Button, Flex, VStack } from "@chakra-ui/react";
import { Formik } from "formik";
import { login } from "../services/user.service";
import { loginUserObject } from "../utils/loginUser.dto";
import { FormInputField } from "./FormInputField";
import * as Yup from 'yup';

export const LogIn = () => {
  return (
    <Formik
    initialValues={{username: '',password: '',}}
    validationSchema={Yup.object({
      username: Yup.string().required('Username is required').min(6, 'Username must be at least 6 characters long'),
      password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters long')
    })}
    onSubmit={async (values, action) => {
      console.log('Log in submit has been called');
      const user: loginUserObject = {
        username: values.username,
        password: values.password,
      };
      alert(JSON.stringify(user, null, 2));
      await login(user);
      action.resetForm();
    }}
    >
      {formik => (
            <Flex bg='backgroundColor' align='center' justify='center' h='100vh'>
            <Box bg='white' p={10} rounded='md'>
             <form onSubmit={formik.handleSubmit}>
               <VStack spacing={4} align='flex-start'>
                 <FormInputField label='Username' required={true} id='username' name='username' type='text' variant='filled'/>
                 <FormInputField label='Password' required={true} id='password' name='password' type='password' variant='filled'/>
                 <Button type="submit" backgroundColor="backgroundColor" width="full" color='white'>Log In</Button>
               </VStack>
             </form>
            </Box>
         </Flex>
      )}
    </Formik>
  )
}