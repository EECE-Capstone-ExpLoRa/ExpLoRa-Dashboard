import { createUserObject } from "../utils/createUser.dto";
import { deviceResponse } from "../utils/devices.dto";
import { loginResponse } from "../utils/loginResponse.dto";
import { loginUserObject } from "../utils/loginUser.dto";
import { userResponseObject } from "../utils/userResponse.dto";
import exploraApi from "./api";

export const register = async (newUser: createUserObject) => {
    const res = await exploraApi.post('/users', newUser);
    const userId: number = res.data;
    return userId;
};

export const login = async(user: loginUserObject) => {
    const res = await exploraApi.post('/auth/login', user);
    const accessToken: loginResponse = res.data;
    return accessToken;
};

export const logout = async () => {
    const res = await exploraApi.get('/auth/logout');
    return res.data;
};

export const fetchCurrentUser = async() => {
    const res = await exploraApi.get('/profile');
    const user: userResponseObject = res.data;
    return user;
};

export const fetchUserDevices = async () => {
    const res = await exploraApi.get('/users/devices');
    const devices: deviceResponse[] = res.data;
    console.log(devices);
    return devices;

};

export const registerNewDevice =async (deviceEui: string) => {
    const deviceToRegister = {
        device_eui: deviceEui
    }
    const res = await exploraApi.post('/users/devices', deviceToRegister);
    const device = res.data;
    console.log(device);
    return device;
};