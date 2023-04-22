import axios from "axios";

const exploraApi = axios.create({
    baseURL: process.env.REACT_APP_SERVER || 'http://localhost:8080',
});

console.log(`Server URL: ${process.env.REACT_APP_SERVER} pushes arent logging what about now`);
console.log(exploraApi.defaults.baseURL);
export default exploraApi;
