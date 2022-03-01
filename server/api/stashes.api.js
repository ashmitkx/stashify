import { Stash } from '../models/stash.model.js';
import { SpotifyAPI as Spotify } from './spotify.api.js';

export async function stashTracks(req, res, next) {
    const spotify_user_id = req.session.spotify_user_id;
    const playlist_id = req.params.playlist_id;
    const track_ids = req.body.track_ids;

    // create new stash
    const stash = new Stash({ spotify_user_id, playlist_id, track_ids });
    try {
        await stash.save();
    } catch (e) {
        return next(e);
    }

    next(); // hand control over to playlist.api.js - removeTracks
}

export async function getStashes(req, res, next) {
    const spotify_user_id = req.session.spotify_user_id;
    const playlist_id = req.params.playlist_id;

    // TODO: Add pagination
    // get all stashes for the user's playlist
    const query = { spotify_user_id, playlist_id };
    let stashes;
    try {
        stashes = await Stash.find(query).select('-__v').lean(); // remove __v field
    } catch (e) {
        return next(e);
    }

    // get list of all unique track_ids among all fetched stashes
    let uniqueTrackIds = new Set();
    stashes.forEach(stash => stash.track_ids.forEach(track_id => uniqueTrackIds.add(track_id)));
    uniqueTrackIds = [...uniqueTrackIds].join(','); // set -> array -> string joined by commas

    // TODO: Add a loop, since spotify's /tracks accepts 50 tracks at a time
    // fetch track data from spotify for each track_id
    const tokens = req.session.tokens;
    const params = { ids: uniqueTrackIds };
    let data;
    try {
        data = await Spotify.get('/tracks', { params, tokens });
    } catch (e) {
        return next(e); // SpotifyError
    }

    // temporary data filtering
    data.tracks = data.tracks.map(track => ({
        id: track.id,
        name: track.name,
        artists: track.artists.map(artist => artist.name),
        album: track.album.name
    }));

    // create a mapping from track_id to track data, for easy access in the next step
    const trackIdMap = {};
    data.tracks.forEach(track => (trackIdMap[track.id] = track));

    // map each track_id in each stash to the track's data
    stashes = stashes.map(stash => {
        stash.tracks = stash.track_ids.map(track_id => trackIdMap[track_id]);
        delete stash.track_ids;
        return stash;
    });

    res.json(stashes);
}

export async function deleteStash(req, res, next) {
    const playlist_id = req.params.playlist_id;
    const stash_id = req.params.stash_id;

    const query = { _id: stash_id, playlist_id };
    try {
        await Stash.deleteOne(query);
    } catch (e) {
        return next(e);
    }

    res.status(204).send();
}
