import axios from 'axios';

// env vars
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

export async function protect(req, res, next) {
    const tokens = req.session.tokens;

    /* if tokens, or access token, or refresh token are absent
       then redirect the user to reauthenticate with spotify. */
    if (!(tokens && tokens.access_token && tokens.refresh_token))
        return res.redirect('/api/v1/auth/spotify/login');

    /* if the spotify access token has not expired
       then let the user continue. */
    if (new Date() < new Date(tokens.expires)) return next();

    // else otherwise, refresh the access token

    // prepare to get new access token from refresh token
    const refresh_token = tokens.refresh_token;
    const formBody = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token
    });
    let authHeader = 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64');

    try {
        // get the new tokens, put them in session storage
        const newTokens = await axios.post('https://accounts.spotify.com/api/token', formBody, {
            headers: { Authorization: authHeader }
        });

        // caculate expiration time
        newTokens.data.expires = new Date(Date.now() + newTokens.data.expires_in);
        // the spotify api may or may not return a refresh token, so merge in the refresh_token
        req.session.tokens = { ...req.session.tokens, ...newTokens.data };
    } catch (e) {
        // TODO: Add check for expired refresh token
        return next({ status: e.response.status, error: e.response.data });
    }

    next();
}
