import { SpotifyAPI as Spotify } from './spotify.api.js';
import { Stash } from '../models/stash.model.js';

const playlistFieldsToGet = `
    id,
    name,
    owner(display_name,id),
    snapshot_id,
    images,
    description,
    followers.total,
    public,
    tracks(
        items(
            added_at,
            track(
                album(name,images),
                artists.name,name,id,duration_ms)
        )
    )
`.replace(/\s/g, ''); // remove all whitespaces, else this param wont work.

export async function getPlaylist(req, res, next) {
    const tokens = req.session.tokens;
    const playlist_id = req.params.playlist_id;
    const params = { fields: playlistFieldsToGet }; // fields to get from api. spotify returns a shitton

    let playlist;
    try {
        // TODO: handle limit/pagination
        playlist = await Spotify.get(`/playlists/${playlist_id}`, { params, tokens });
    } catch (e) {
        return next(e); // SpotifyError
    }

    res.json(playlist);
}

export async function restorePlaylistTracks(req, res, next) {
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
        return next(e); // SpotifyError
    }

    next(); // hand control over to stash.api.js - removeStashTracks
}

export async function removePlaylistTracks(req, res, next) {
    const tokens = req.session.tokens;
    const playlist_id = req.params.playlist_id;
    const track_ids = req.body.track_ids;

    // convert track_ids to a form spotify wants
    const tracks = track_ids.map(trackID => ({ uri: `spotify:track:${trackID}` }));
    const body = { tracks };

    try {
        await Spotify.delete(`/playlists/${playlist_id}/tracks`, { body, tokens });
    } catch (e) {
        return next(e); // SpotifyError
    }

    res.status(204).send();
}
