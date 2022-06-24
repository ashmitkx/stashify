import { Router } from 'express';
import {
    restorePlaylistTracks,
    removePlaylistTracks,
    getPlaylistInfo,
    getPlaylistTracks
} from '../api/playlist.api.js';
import { getStash, stashTracks, removeStashTracks } from '../api/stash.api.js';
import { filterDupTracks } from '../middlewares/filterDupTracks.middleware.js';
import { trackLimit } from '../middlewares/trackLimit.middleware.js';
import { verifyPlOwner } from '../middlewares/verifyPlOwner.middleware.js';

// @route: /playlists/:playlist_id
const router = Router({ mergeParams: true });
router.use(verifyPlOwner);

router.route('/').get(getPlaylistInfo);

router
    .route('/tracks')
    .get(getPlaylistTracks)
    .post(filterDupTracks, trackLimit, restorePlaylistTracks, removeStashTracks);

router
    .route('/stash')
    .get(getStash)
    .post(filterDupTracks, trackLimit, stashTracks, removePlaylistTracks);

export { router as playlistRouter };
