import axios from "axios";

const exploraApi = axios.create({
    baseURL: process.env.SERVER_URL || 'http://localhost:8080',
});

console.log(exploraApi.defaults.baseURL);
export default exploraApi;
