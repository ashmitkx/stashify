import { AppError } from '../lib/appError.js';
import { Stash } from '../models/stash.model.js';
import { SpotifyAPI as Spotify } from './spotify.api.js';

// TODO: Add pagination
export async function getStash(req, res, next) {
    const spotify_user_id = req.session.spotify_user_id;
    const playlist_id = req.params.playlist_id;

    // get the playlists's stash. stash existance guaranteed by verifyPlOwner middleware
    let stash;
    const query = { spotify_user_id, playlist_id };
    try {
        stash = await Stash.findOne(query).select('-__v').lean(); // remove __v field
    } catch (e) {
        return next(e);
    }

    // no point in doing the next steps if stash is empty
    if (stash.tracks.length === 0) return res.json(stash);

    // collect all track ids into a comma separated string
    let trackIds = stash.tracks.map(track => track.id);
    trackIds = trackIds.join(','); // array -> string joined by commas

    // fetch track data from spotify for each track_id
    const tokens = req.session.tokens;
    const params = { ids: trackIds };
    let data;
    try {
        data = await Spotify.get('/tracks', { params, tokens });
    } catch (e) {
        return next(e); // SpotifyError
    }

    // TODO: Remove
    // data filtering
    data.tracks = data.tracks.map(track => ({
        id: track.id,
        name: track.name,
        artists: track.artists.map(artist => artist.name),
        album: track.album.name
    }));

    // create a mapping from track id to track data, for easy access in the next step
    const trackIdMap = {};
    data.tracks.forEach(track => (trackIdMap[track.id] = track));

    // add track data and remove id from each track
    stash.tracks.forEach(track => {
        track.data = trackIdMap[track.id];
        delete track.id;
    });

    res.json(stash);
}

export async function stashTracks(req, res, next) {
    const spotify_user_id = req.session.spotify_user_id;
    const playlist_id = req.params.playlist_id;
    const track_ids = req.body.track_ids;

    // get the playlists's stash. stash existance guaranteed by verifyPlOwner middleware
    let stash;
    const query = { spotify_user_id, playlist_id };
    try {
        stash = await Stash.findOne(query);
    } catch (e) {
        return next(e);
    }

    // to prevent duplicates, remove previously stashed tracks that are also given in track ids
    stash.tracks = stash.tracks.filter(track => !track_ids.includes(track.id));

    // convert track ids to track objects
    const date_stashed = new Date();
    const tracks = track_ids.map(track_id => ({ id: track_id, date_stashed }));

    // push the tracks into the stash
    stash.tracks.push(...tracks);

    try {
        await stash.save();
    } catch (e) {
        return next(e);
    }

    next(); // hand control over to playlist.api.js - removePlaylistTracks
}

export async function removeStashTracks(req, res, next) {
    const spotify_user_id = req.session.spotify_user_id;
    const playlist_id = req.params.playlist_id;
    const track_ids = req.body.track_ids;

    // get the playlists's stash. stash existance guaranteed by verifyPlOwner middleware
    let stash;
    const query = { spotify_user_id, playlist_id };
    try {
        stash = await Stash.findOne(query);
    } catch (e) {
        return next(e);
    }

    // remove tracks given in track ids
    stash.tracks = stash.tracks.filter(track => !track_ids.includes(track.id));

    try {
        await stash.save();
    } catch (e) {
        return next(e);
    }

    res.status(204).send();
}
