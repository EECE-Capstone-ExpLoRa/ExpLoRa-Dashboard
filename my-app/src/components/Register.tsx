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
import { Field, Form, Formik, useFormik } from 'formik';
import axios from 'axios';
import { createUserObject } from '../utils/createUser.dto';
import { register } from '../services/user.service';

export const Register = () => {
    
    const validate = (values: createUserObject) => {
        const errors: any = {}
        if (!values.email) {
            errors.email = 'Email is required!'
        }
        if (!values.username) {
            errors.username = 'Username is required!'
        }
        if (!values.password) {
            errors.password = 'Password is required!'
        }
        if (!values.deviceEui) {
            errors.deviceEui = 'Device EUI is required!'
        }
        return errors
    };
    
    const formik = useFormik({
        initialValues: {
            email: '',
            username: '',
            password: '',
            deviceEui: '',
        },
        validate,
        onSubmit: async (values) => {
            console.log(values);
            const newUser: createUserObject = {
                email: values.email,
                username: values.username,
                password: values.password,
                deviceEui: values.deviceEui
            };
            alert(JSON.stringify(newUser, null, 2));
            await register(newUser);
        }
    });

  return (
  <div>
    <h1 
        style={{
          color: '#355C7D',
          fontSize: '200%',
          fontWeight: 'bold',
          fontFamily: 'system-ui'
        }}>
          Login
      </h1>
    
    <form onSubmit={formik.handleSubmit}>

      <FormLabel color='#6C5B7B'> Email </FormLabel>
      
      <input
        id="email"
        name="email"
        type="email"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
      />
      {formik.touched.email && formik.errors.email? <div>{formik.errors.email}</div>: null}

      <FormLabel color='#6C5B7B'> Username </FormLabel>
      
      <input
        id="username"
        name="username"
        type="text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.username}
      />
      {formik.touched.username && formik.errors.username? <div>{formik.errors.username}</div>: null}

      <FormLabel color='#6C5B7B'> Password </FormLabel>
      <input
        id="password"
        name="password"
        type="text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.password}
      />
      {formik.touched.password && formik.errors.password? <div>{formik.errors.password}</div>: null}

      <FormLabel color='#6C5B7B'> Device EUI </FormLabel>
      <input
        id="deviceEui"
        name="deviceEui"
        type="text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.deviceEui}
      />
      {formik.touched.deviceEui && formik.errors.deviceEui? <div>{formik.errors.deviceEui}</div>: null}
      
      <Button type="submit" className={styles.block}>
        <h1 style={{
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
    </form>
  </div>
  );
}