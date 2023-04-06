import axios from "axios";
import { createUserObject } from "../utils/createUser.dto";
import { deviceResponse } from "../utils/devices.dto";
import { updateUserObject } from "../utils/updateUser.dto";
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

export const update = async(updateUser: updateUserObject) => {
    const res = await exploraApi.put('/users', updateUser);
    return res.data;
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
    return devices;

};

export const registerNewDevice =async (deviceEui: string) => {
    const deviceToRegister = {
        device_eui: deviceEui
    }
    const res = await exploraApi.post('/users/devices', deviceToRegister);
    const device = res.data;
    return device;
};

export const deleteDeviceFromUser = async (deviceEui: string) => {
  const res = await exploraApi.delete(`/users/devices/${deviceEui}`);
  const deletedDevice = res.data;
  return deletedDevice;
};

export const updateUserDevices =async (devicesToUpdate:Map<string, {[key: string]: string}>) => {
    type updateManyDevices = {
        url: string,
        body: {
            nickname?: string,
            type?: string
        },
    };
    const endpointUrls: updateManyDevices[] = [];
    const responses: any[] = []
    devicesToUpdate.forEach((val, key) => {
        endpointUrls.push({
            url: `/devices/${key}`,
            body: {
                nickname: val.nickname,
                type: val.type
                }
            });
    });
    const axiosCalls = endpointUrls.map((endpoint) => {
        return exploraApi.put(endpoint.url, endpoint.body);
    });
    
    const res = await axios.all(axiosCalls);
    try {
        res.forEach((response) => responses.push(response.data));
        return responses;
    } catch(error) {
        return error;
    }
};
