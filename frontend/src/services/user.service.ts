import { createUserObject } from "../utils/createUser.dto";
import { updateUserObject } from "../utils/updateUser.dto";
import { loginResponse } from "../utils/loginResponse.dto";
import { loginUserObject } from "../utils/loginUser.dto";
import { userResponseObject } from "../utils/userResponse.dto";
import exploraApi from "./api";

export const register = async (newUser: createUserObject) => {
    const res = await exploraApi.post('/users', newUser);
    const userId: number = res.data;
    return userId;
}

export const login = async(user: loginUserObject) => {
    const res = await exploraApi.post('/auth/login', user);
    const accessToken: loginResponse = res.data;
    return accessToken;
}

export const update = async(updateUser: updateUserObject) => {
    const res = await exploraApi.put('/users', updateUser);
    return res.data;
}

export const logout = async () => {
    const res = await exploraApi.get('/auth/logout');
    return res.data;
}
//TODO: implement logout service

export const fetchCurrentUser = async() => {
    const res = await exploraApi.get('/profile');
    const user: userResponseObject = res.data;
    return user;
}