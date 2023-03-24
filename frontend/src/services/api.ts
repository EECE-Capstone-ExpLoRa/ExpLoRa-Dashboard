import axios from "axios";

const exploraApi = axios.create({
    baseURL: 'http://localhost:8080',
});

export default exploraApi;
