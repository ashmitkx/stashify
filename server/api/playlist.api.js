import { SpotifyAPI as Spotify } from './spotify.api.js';

const playlistFieldsToGet = `
    id,
    name,
    owner.display_name,
    snapshot_id,
    tracks(
        items(
            added_at,
            track(album.name,artists.name,name,id)
        )
    )
`.replace(/\s/g, ''); // remove all whitespaces, else this param wont work.

export async function getPlaylist(req, res, next) {
    const tokens = req.session.tokens;
    const playlist_id = req.params.playlist_id;
    const params = { fields: playlistFieldsToGet }; // fields to get from api. spotify returns a shitton

    let playlist;
    try {
        playlist = await Spotify.get(`/playlists/${playlist_id}`, { params, tokens });
    } catch (e) {
        const { status, message } = e.response.data.error;
        next({ status, message });
    }

    res.json(playlist);
}

export async function restoreTracks(req, res, next) {
    const tokens = req.session.tokens;
    const playlist_id = req.params.playlist_id;
    const track_ids = req.body.track_ids;

    // convert track_ids to a form spotify wants
    const uris = track_ids.map(track_id => `spotify:track:${track_id}`);
    // position: 0 means append tracks to the start of playlist
    const body = { uris, position: 0 };

    try {
        await Spotify.post(`/playlists/${playlist_id}/tracks`, { body, tokens });
    } catch (e) {
        const { status, message } = e.response.data.error;
        next({ status, message });
    }

    res.status(201).send();
}

export async function removeTracks(req, res, next) {
    const tokens = req.session.tokens;
    const playlist_id = req.params.playlist_id;
    const track_ids = req.body.track_ids;

    // convert track_ids to a form spotify wants
    const tracks = track_ids.map(trackID => ({ uri: `spotify:track:${trackID}` }));
    const body = { tracks };

    try {
        await Spotify.delete(`/playlists/${playlist_id}/tracks`, { body, tokens });
    } catch (e) {
        const { status, message } = e.response.data.error;
        next({ status, message });
    }

    res.status(204).send();
}
