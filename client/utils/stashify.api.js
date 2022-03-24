import axios from 'axios';

const stashifyAPI = axios.create({
    baseURL: 'http://localhost:5000/api/v1',
    withCredentials: true
});

export { stashifyAPI as api };
