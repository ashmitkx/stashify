import { SpotifyAPI as Spotify } from './spotify.api.js';

export async function getCurrUserDetails(req, res, next) {
    const tokens = req.session.tokens;

    let data;
    try {
        data = await Spotify.get('/me', { tokens });
    } catch (e) {
        // TODO: verify that this works
        next({ status: e.response.status, error: e.response.data });
    }

    // filter out fields from data
    const { display_name, email, type } = data;
    data = { display_name, email, type };

    res.json(data);
}

export async function getCurrUserPlaylists(req, res, next) {
    const tokens = req.session.tokens;

    let data;
    try {
        data = await Spotify.get('/me/playlists', { tokens }); // TODO: handle limit/pagination
    } catch (e) {
        // TODO: verify that this works
        next({ status: e.response.status, error: e.response.data });
    }

    // filter out fields from data
    data.items = data.items.map(playlist => {
        const { name, id, owner, tracks, type } = playlist;
        return { name, id, owner_name: owner.display_name, track_count: tracks.total, type };
    });

    res.json(data);
}
