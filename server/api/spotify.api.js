import axios from 'axios';
import { SpotifyError } from '../lib/spotifyError.js';

export class SpotifyAPI {
    static baseURL = 'https://api.spotify.com/v1';

    static get(url, { params, tokens }) {
        return apiCall('get', this.baseURL, url, { params, tokens });
    }

    static post(url, { params, body, tokens }) {
        return apiCall('post', this.baseURL, url, { params, body, tokens });
    }

    static delete(url, { params, body, tokens }) {
        return apiCall('delete', this.baseURL, url, { params, body, tokens });
    }
}

async function apiCall(method, baseURL, url, { params = null, body = null, tokens }) {
    const headers = { Authorization: tokens.token_type + ' ' + tokens.access_token };
    const axiosConfig = { method, baseURL, url, params, data: body, headers };

    try {
        const reply = await axios.request(axiosConfig);
        return reply.data;
    } catch (e) {
        const { status, message } = e.response.data?.error || e.response;
        throw new SpotifyError(status, message);
    }
}
