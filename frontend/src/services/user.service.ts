import axios from "axios";
import { createUserObject } from "../utils/createUser.dto";
import { loginUserObject } from "../utils/loginUser.dto";

const exploraApi = axios.create({
    baseURL: 'http://localhost:8080'
});

export const register = async (newUser: createUserObject) => {
    const res = await exploraApi.post('/users', newUser);
    const user = res.data;
    return user;
}

export const login = async(user: loginUserObject) => {
    const res = await exploraApi.post('/auth/login', user);
    const accessToken = res.data;
    return accessToken;
}

// export const logout = async() => {
//     const res = await exploraApi.get('/auth/logout')
// }

export default exploraApi;