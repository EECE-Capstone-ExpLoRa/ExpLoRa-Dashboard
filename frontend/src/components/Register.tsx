import {
  Button,
  Flex,
  Box,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { Link, useNavigate } from "react-router-dom";
import { Formik } from 'formik';
import { createUserObject } from '../utils/createUser.dto';
import { register } from '../services/user.service';
import * as Yup from 'yup';
import { FormInputField } from './FormInputField';
import { useMutation } from '@tanstack/react-query';

const Register = () => {
  const toast = useToast();
  const navigate = useNavigate()
  const mailFormat = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  const registerUserMutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      toast({
        title: 'Account Successfully created',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/signin'); //might change to go to dashboard
    },
    onError: () => {
      toast({
        title: 'Username already exists',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  });

  return (
    <Formik
    initialValues={{email: '', username: '', password: '', deviceEui: '', confirmPassword: ''}}
    validationSchema={Yup.object({
      email: Yup.string().matches(mailFormat, 'Invalid Email').required('Email is required'),
      username: Yup.string().required('Username is required').min(6, 'Username must be at least 6 characters long'),
      password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters long'),
      confirmPassword: Yup.string().oneOf([Yup.ref('password'), undefined], 'Passwords must match').required('Please Confirm Password')
    })}
    onSubmit={async (values, action) => {
      let newUser: createUserObject = {
        email: values.email,
        username: values.username,
        password: values.password,
      };
      if (values.deviceEui.trim() !== "") newUser.deviceEui = values.deviceEui;
      registerUserMutation.mutate(newUser);
      action.resetForm();
    }}>
      {formik => (
      <Flex bg='test2.100' align='center' justify='center' h='100vh'>
        <Box bg='white' p={10} rounded='md' w='25%'>
          <form onSubmit={formik.handleSubmit}>
            <VStack spacing={4} align='flex-start'>
              <FormInputField label='Email Address' required={true} id='email' name='email' type='email'/>
              <FormInputField label='Username' required={true} id='username' name='username' type='text'/>
              <FormInputField label='Password' required={true} id='password' name='password' type='password'/>
              <FormInputField label='Confirm Password' required={true} id='confirmPassword' name='confirmPassword' type='password'/>
              <FormInputField label='Device Eui' required={false} id='deviceEui' name='deviceEui' type='text'/>
              <Button type="submit" colorScheme='test2' color='black' width="full">Sign Up</Button> 
              <Link to="/signin">Already have an account?</Link>
            </VStack>
          </form>
        </Box>
      </Flex>
      )}
    </Formik>
  );
};

export default Register;
