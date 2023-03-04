import { Button, FormLabel } from "@chakra-ui/react";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { login } from "../services/user.service";
import { loginUserDto } from "../utils/loginUser.dto";
import styles from './styles.module.css';

export const LogIn = () => {
    
    const validate = (values: loginUserDto) => {
        const errors: any = {};
        if (!values.username) {
            errors.username = 'Username is required!'
        }
        if (!values.password) {
            errors.password = 'Password is required!'
        }
        return errors
    }

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validate,
        onSubmit: async (values) => {
            const user: loginUserDto = {
                username: values.username,
                password: values.password
            };
            alert(JSON.stringify(user, null, 2));
            await login(user);
        }
    })
    return (
        <div>
      <h1 style={{
        color: '#355C7D',
        fontSize: '200%',
        fontWeight: 'bold',
        fontFamily: 'system-ui'
      }}>
        Login
      </h1>
    
    <form onSubmit={formik.handleSubmit}>

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
      
      <Button type="submit" className={styles.block}>
        <h1 style={{
              color: '#355C7D',
              fontFamily: 'system-ui'
            }}>
          LogIn
        </h1>
      </Button>

      <Button style = {{
        height: '200%',
        width: '60%',
        backgroundColor: 'transparent'
      }}>
        <h1 style={{
          color: '#355C7D',
          fontFamily: 'system-ui',
          fontSize: '80%',               
        }}>
          <Link to="/register">Don't have an account yet?</Link>
        </h1>
      </Button>
    </form>
  </div>
    )
}