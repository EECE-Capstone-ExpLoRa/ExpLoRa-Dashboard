import axios from "axios";
import { createUserObject } from "../utils/createUser.dto";
import { loginUserObject } from "../utils/loginUser.dto";

export const register = async (newUser: createUserObject) => {
    const res = await axios.post(`http://localhost:8080/users`, newUser);
    console.log(res);
}

export const login = async(user: loginUserObject) => {
    const res = await axios.post(`http://localhost:8080/auth/login`, user);
    console.log(res);
}
