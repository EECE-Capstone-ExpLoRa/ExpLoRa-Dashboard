import {
    Button,
    Flex,
    Box,
    VStack,
    useToast,
  } from '@chakra-ui/react'
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '..';
import { fetchCurrentUser, update } from '../services/user.service';
import { FormInputField } from './FormInputField';
import { updateUserObject } from '../utils/updateUser.dto';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const toast = useToast();
  const mailFormat = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  const navigate = useNavigate();  
  const userInfo = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    retry: false
  });

  useEffect(() => {
    const goToHomePage = () =>{
      navigate('/signin');
    };
    if (userInfo.isError) {
      goToHomePage();
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: update,
    onSuccess: () => {
      toast({
        title: 'Account Successfully updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      queryClient.invalidateQueries({queryKey: ['currentUser']});
      navigate('/dashboard');
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

  if (userInfo.isError) {
    return (<span>An Error Occurred...</span>);
  }

  if (userInfo.isLoading) {
    return (<span>Loading...</span>);
  }
    
  return (
    <Formik
    initialValues={{email: '', username: '', password: ''}}
    validationSchema={Yup.object({
      email: Yup.string().matches(mailFormat, 'Invalid Email'),
      username: Yup.string().min(6, 'Username must be at least 6 characters long'),
      password: Yup.string().min(8, 'Password must be at least 8 characters long'),
    })}
    onSubmit={async (values, action) => {
      let updateUser: updateUserObject = {}
      if (values.email.trim() !== "") updateUser.newEmail = values.email;
      if (values.username.trim() !== "") updateUser.newUsername = values.username;
      if (values.password.trim() !== "") updateUser.newPassword = values.password;
      updateUserMutation.mutate(updateUser);
      action.resetForm();
    }}
    >
      {formik => (
          <Flex bg='gray.100' align='center' justify='center' h='100vh'>
          <Box bg='white' p={10} rounded='md' w='25%' >
              <form onSubmit={formik.handleSubmit}>
                <VStack spacing={4} align='flex-start'>
                  <FormInputField label='New Email Address' required={false} id='email' name='email' type='email' placeholder={userInfo.data.email}/>
                  <FormInputField label='New Username' required={false} id='username' name='username' type='text' placeholder={userInfo.data.username}/>
                  <FormInputField label='New Password' required={false} id='password' name='password' type='password'/>
                  <Button type="submit" colorScheme='brand' width="full">Update Profile</Button>
                </VStack>
              </form>
            </Box>
          </Flex>
          )}
        </Formik>
      );
};

export default Profile;
