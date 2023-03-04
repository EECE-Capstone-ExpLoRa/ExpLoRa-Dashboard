import React from 'react'
import {
  Button,
  Flex,
  Box,
  VStack,
} from '@chakra-ui/react'
import { Link } from "react-router-dom";
import { Formik } from 'formik';
import { createUserObject } from '../utils/createUser.dto';
import { register } from '../services/user.service';
import * as Yup from 'yup';
import { FormInputField } from './FormInputField';

export const Register = () => {
  const mailFormat = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return (
    <Formik
    initialValues={{email: '', username: '', password: '', deviceEui: ''}}
    validationSchema={Yup.object({
      email: Yup.string().matches(mailFormat, 'Invalid Email').required('Email is required'),
      username: Yup.string().required('Username is required').min(6, 'Username must be at least 6 characters long'),
      password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters long')
    })}
    onSubmit={async (values, action) => {
      console.log('Sign up submit has been called');
      let newUser: createUserObject = {
        email: values.email,
        username: values.username,
        password: values.password,
      };
      if (values.deviceEui.trim() !== "") newUser.deviceEui = values.deviceEui;
      alert(JSON.stringify(newUser, null, 2));
      await register(newUser);
      action.resetForm();
    }}>
      {formik => (
      <Flex bg='#F8B195' align='center' justify='center' h='100vh'>
        <Box bg='white' p={10} rounded='md'>
          <form onSubmit={formik.handleSubmit}>
            <VStack spacing={4} align='flex-start'>
              <FormInputField label='Email Address' required={true} id='email' name='email' type='email' variant='filled'/>
              <FormInputField label='Username' required={true} id='username' name='username' type='text' variant='filled'/>
              <FormInputField label='Password' required={true} id='password' name='password' type='password' variant='filled'/>
              <FormInputField label='Device Eui' required={false} id='deviceEui' name='deviceEui' type='text' variant='filled'/>
              <Button type="submit" colorScheme="purple" width="full">Sign Up</Button>
              <Link to="/signin">Already have an account?</Link>
            </VStack>
          </form>
        </Box>
      </Flex>
      )}
    </Formik>
  )
}