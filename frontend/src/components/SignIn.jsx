import React from 'react'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
} from '@chakra-ui/react'
import styles from './styles.module.css'; 

// The below import defines which components come from formik
import { Field, Form, Formik } from 'formik';

function SignIn() {
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
      initialValues={{
        username: '',
        password: '',
      }}
      onSubmit={(values, actions) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2))
          actions.setSubmitting(false)
        }, 1000)
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
                  Login
            </h1>
          </div>

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
                Login
            </h1>
          </Button>
          
        </Form>
      )}
    </Formik>
  )
}

export default SignIn