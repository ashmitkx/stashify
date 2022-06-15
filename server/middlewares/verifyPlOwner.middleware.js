import { SpotifyAPI as Spotify } from '../api/spotify.api.js';
import { AppError } from '../lib/appError.js';
import { Stash } from '../models/stash.model.js';

/* middleware to verify playlist owner,
   and create yet to be created stashes. 
*/
export async function verifyPlOwner(req, res, next) {
    const tokens = req.session.tokens;
    const spotify_user_id = req.session.spotify_user_id;
    const playlist_id = req.params.playlist_id;

    // query for the playlist's stash
    let stash;
    const query = { playlist_id };
    try {
        stash = await Stash.findOne(query);
    } catch (e) {
        return next(e);
    }

    // if stash is found, check if the user owns the playlist/stash
    if (stash) {
        if (stash.spotify_user_id === spotify_user_id) return next();
        else return next(new AppError(401, `Not owner of playlist "${playlist.name}"`));
    }

    /* stash is not found.
       either the user owns the playlist, but the stash entry is yet to be created,
       or the user doesnt own the playlist.
    */

    // query spotify whether user owns the playlist
    const params = { fields: 'name,owner.id' };
    let playlist;
    try {
        playlist = await Spotify.get(`/playlists/${playlist_id}`, { params, tokens });
    } catch (e) {
        return next(e); // SpotifyError
    }

    /* if playlist owner id matches user id,
       then user owns the playist, 
       but the stash entry has not been created. create it.
    */
    if (playlist.owner.id === spotify_user_id) {
        await Stash.create({ spotify_user_id, playlist_id }); // create the stash
        return next();
    }

    // otherwise, the user does not own the playlist
    next(new AppError(401, `Not owner of playlist "${playlist.name}"`));
}
