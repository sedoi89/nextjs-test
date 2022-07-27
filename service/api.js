import axios from 'axios';

const URL = 'https://api.punkapi.com/v2/beers';
const TIMEOUT = 5000

const createAPI = () => {
    const api = axios.create({
        baseURL: URL,
        timeout: TIMEOUT,
    });
    return api;
}

export default createAPI;
