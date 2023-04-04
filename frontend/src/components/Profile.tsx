import {
    Button,
    Flex,
    Box,
    VStack,
    useToast,
  } from '@chakra-ui/react'
import { Formik } from 'formik';
import { updateUserObject } from '../utils/updateUser.dto';
import { update } from '../services/user.service';
import * as Yup from 'yup';
import { FormInputField } from './FormInputField';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from "..";
import { userResponseObject } from '../utils/userResponse.dto';

const Profile = () => {
  const toast = useToast();
  const mailFormat = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const data = queryClient.getQueryData(['currentUser']);
  const user = data as userResponseObject;

  const updateUserMutation = useMutation({
    mutationFn: update,
    onSuccess: () => {
      toast({
        title: 'Account Successfully updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      queryClient.invalidateQueries({queryKey: ['currentUser']})
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
          <Flex bg='test2.100' align='center' justify='center' h='100vh'>
          <Box bg='white' p={10} rounded='md' w='25%'>
              <form onSubmit={formik.handleSubmit}>
                <VStack spacing={4} align='flex-start'>
                  <FormInputField label='New Email Address' required={false} id='email' name='email' type='email' placeholder={user.email}/>
                  <FormInputField label='New Username' required={false} id='username' name='username' type='text' placeholder={user.username}/>
                  <FormInputField label='New Password' required={false} id='password' name='password' type='password'/>
                  <Button type="submit" colorScheme='test2' color='black' width="full">Update Profile</Button>
                </VStack>
              </form>
            </Box>
          </Flex>
          )}
        </Formik>
      );
};

export default Profile;
