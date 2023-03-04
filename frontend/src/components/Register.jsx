import React from 'react'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button
} from '@chakra-ui/react'
import styles from './styles.module.css';
import { Link } from "react-router-dom";
import { Field, Form, Formik } from 'formik';
import UserService from '../services/user.service'

function Register() {
  
  function validateEmail(value) {
    let error
    if (!value) {
      error = 'Email is required!'
    }
    return error
  }

  function validateUsername(value) {
    let error
    if (!value) {
      error = 'Username is required!'
    }
    return error
  }

  function validatePassword(value) {
    let error
    if (!value) {
      error = 'Password is required!'
    }
    return error
  }

  return (
    <Formik
      onSubmit={(values, actions) => {
        setTimeout(() => {
          console.log(values.email)
          UserService.register(values.email, values.username, values.password)
        }, 1000)
        console.log("hello world")
      }}
    >
      {(props) => (
        <Form>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '10%',
          }}>
            <h1 
              style={{
                color: '#355C7D',
                fontSize: '200%',
                fontWeight: 'bold',
                fontFamily: 'system-ui'
                }}>
                  Register
            </h1>
          </div>

          <Field name='email' validate={validateEmail}>
            {({ field, form }) => (
              <FormControl isInvalid={form.errors.email && form.touched.email}>
                <FormLabel color='#6C5B7B'> Email </FormLabel>
                <Input {...field} 
                  color='#6C5B7B'
                  placeholder='Email' 
                  onChange={Formik.handleChange} 
                />
                <FormErrorMessage>{form.errors.email}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          &nbsp;

          <Field name='username' validate={validateUsername}>
            {({ field, form }) => (
              <FormControl isInvalid={form.errors.username && form.touched.username}>
                <FormLabel color='#6C5B7B'> Username </FormLabel>
                <Input {...field} 
                  color='#6C5B7B'
                  placeholder='Username' 
                  onChange={Formik.handleChange} 
                />
                <FormErrorMessage>{form.errors.username}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          &nbsp;
          
          <Field name='password' validate={validatePassword} background-Color = 'white'>
            {({ field, form }) => (
              <FormControl isInvalid={form.errors.password && form.touched.password}>
                <FormLabel color='#6C5B7B'> Password </FormLabel>
                <Input {...field} 
                  color='#6C5B7B'
                  placeholder='Password' 
                  onChange={Formik.handleChange} 
                />
                <FormErrorMessage>{form.errors.password}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          &nbsp;
          
          <Button className={styles.block}>
            <h1 
              style={{
                color: '#355C7D',
                fontFamily: 'system-ui'
              }}>
                Sign up
            </h1>
          </Button>

          <Button style = {{
            height: '200%',
            width: '60%',
            backgroundColor: 'transparent'
            }}>
            <h1 
              style={{
                color: '#355C7D',
                fontFamily: 'system-ui',
                fontSize: '80%',               
              }}>
                <Link to="/signin">Already have an account?</Link>
            </h1>
          </Button>
          
        </Form>
      )}
    </Formik>
  )
}

export default Register