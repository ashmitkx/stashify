import { Router } from 'express';
import { getPlaylist, removeTracks, restoreTracks } from '../api/playlist.api.js';
import { deleteStash, getStashes, stashTracks } from '../api/stashes.api.js';
import { trackLimit } from '../middlewares/trackLimit.middleware.js';

// @route: /playlists/:playlist_id
const router = Router({ mergeParams: true });

router.route('/').get(getPlaylist);

router
    .route('/tracks')
    .post(trackLimit, restoreTracks)
    .delete(trackLimit, stashTracks, removeTracks);

router.route('/stashes').get(getStashes);
router.route('/stashes/:stash_id').delete(deleteStash);

export { router as playlistRouter };
