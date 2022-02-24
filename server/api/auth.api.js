import crypto from 'crypto';
import axios from 'axios';

// env vars
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.CLIENT_BASE_URL + '/api/v1/auth/spotify/callback';

export function spotifyLogin(req, res, next) {
    // generate and store state in cookie, to prevent CSRF
    const { stateCookieKey, stateCookieOptions } = res.locals;
    const state = crypto.randomBytes(256).toString('hex');
    res.cookie(stateCookieKey, state, stateCookieOptions);

    // authenticate with spotify
    const scope = 'user-read-email playlist-read-private';
    const params = {
        response_type: 'code',
        client_id,
        scope,
        redirect_uri,
        state
    };
    const authURL = new URL('https://accounts.spotify.com/authorize');
    res.redirect(authURL + '?' + queryString(authURL, params));
}

export async function spotifyCallback(req, res, next) {
    // attempt to get state from cookie, and see if it matches with the callback query
    const { stateCookieKey } = res.locals;
    const state = req.cookies?.[stateCookieKey] || null;
    if (state === null || state !== req.query.state)
        return next({ status: 400, message: 'Inavlid state' });

    // check for errors
    if (req.query.error) return next({ status: 401, error: req.query.error });

    // remove the state cookie, no longer needed
    res.clearCookie(stateCookieKey);

    // prepare to exchange code for access and refresh tokens
    const code = req.query.code;
    const formBody = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri
    });
    let authHeader = 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64');

    try {
        // get the tokens, put them in session storage
        const tokens = await axios.post('https://accounts.spotify.com/api/token', formBody, {
            headers: { Authorization: authHeader }
        });

        req.session.accessToken = tokens.data.access_token;
        req.session.refreshToken = tokens.data.refresh_token;
    } catch (e) {
        return next({ status: e.response.status, error: e.response.data });
    }

    authHeader = 'Bearer ' + req.session.accessToken;
    const reply = await axios.get(
        'https://api.spotify.com/v1/playlists/6c9Sq1Fys2GKwePje9iWzB?fields=href,name,owner.display_name,snapshot_id,uri,tracks(href,items(added_at,track(album.name,artists.name,name,uri)))',
        { headers: { Authorization: authHeader } }
    );

    res.json(reply.data);
}

function queryString(url, params) {
    const urlParams = new URLSearchParams(url.search);

    Object.entries(params).map(([key, value]) => urlParams.append(key, value));
    return urlParams.toString();
}
