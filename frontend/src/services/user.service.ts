import axios from "axios";
import { createUserObject } from "../utils/createUser.dto";
import { loginUserObject } from "../utils/loginUser.dto";

const exploraApi = axios.create({
    baseURL: 'http://localhost:8080'
});

export const register = async (newUser: createUserObject) => {
    const res = await exploraApi.post('/users', newUser);
    const user = res.data;
    console.log('New User', user);
    return user;
}

export const login = async(user: loginUserObject) => {
    const res = await exploraApi.post('/auth/login', user);
    const accessToken = res.data;
    console.log('Token', accessToken);
    return accessToken;
}

export default exploraApi;