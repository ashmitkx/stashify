import { SpotifyAPI as Spotify } from './spotify.api.js';

export async function getCurrUserDetails(req, res, next) {
    const tokens = req.session.tokens;

    let data;
    try {
        data = await Spotify.get('/me', { tokens });
    } catch (e) {
        return next(e); // SpotifyError
    }

    // filter out fields from data
    const { display_name, email, type, id } = data;
    data = { display_name, email, type, id };

    res.json(data);
}

export async function getCurrUserPlaylists(req, res, next) {
    const tokens = req.session.tokens;

    let data;
    try {
        data = await Spotify.get('/me/playlists', { tokens }); // TODO: handle limit/pagination
    } catch (e) {
        return next(e); // SpotifyError
    }

    // filter playlists to only include the user's owned playlists
    const spotify_user_id = req.session.spotify_user_id;
    data.items = data.items.filter(playlist => playlist.owner.id == spotify_user_id);

    // filter out fields from data
    data.items = data.items.map(playlist => {
        const { name, id, owner, tracks, type, images, description } = playlist;
        return {
            name,
            id,
            owner_name: owner.display_name,
            track_count: tracks.total,
            description,
            images,
            type
        };
    });

    res.json(data);
}
