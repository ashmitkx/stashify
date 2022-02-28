import { Router } from 'express';
import { getPlaylist, removeTracks, restoreTracks } from '../api/playlist.api.js';
import { deleteStash, getStashes, stashTracks } from '../api/stashes.api.js';
import { filterDupTracks } from '../middlewares/filterDupTracks.middleware.js';

// @route: /playlists/:playlist_id
const router = Router({ mergeParams: true });

router.route('/').get(getPlaylist);

router
    .route('/tracks')
    .post(filterDupTracks, restoreTracks)
    .delete(filterDupTracks, stashTracks, removeTracks);

router.route('/stashes').get(getStashes);
router.route('/stashes/:stash_id').delete(deleteStash);

export { router as playlistRouter };
