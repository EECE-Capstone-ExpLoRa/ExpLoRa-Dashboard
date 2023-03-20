import axios from "axios";


const timestreamApi = axios.create({
    baseURL: 'http://localhost:8080'
});

export const getLocationData = async (query: string) => {
    const res = await timestreamApi.post('/timestream/db/list')

    return res.data;
}

export default timestreamApi;