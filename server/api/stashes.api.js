import { Stash } from '../models/stash.model.js';

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

    // get all stashes for the user's playlist
    const query = { spotify_user_id, playlist_id };
    let stashes;
    try {
        stashes = await Stash.find(query).select('-__v'); // remove __v field
    } catch (e) {
        return next(e);
    }

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
