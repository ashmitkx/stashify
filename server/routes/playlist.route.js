import { Router } from 'express';
import { getPlaylist, restorePlaylistTracks, removePlaylistTracks } from '../api/playlist.api.js';
import { getStash, stashTracks, removeStashTracks } from '../api/stash.api.js';
import { filterDupTracks } from '../middlewares/filterDupTracks.middleware.js';
import { trackLimit } from '../middlewares/trackLimit.middleware.js';
import { verifyPlOwner } from '../middlewares/verifyPlOwner.middleware.js';

// @route: /playlists/:playlist_id
const router = Router({ mergeParams: true });
router.use(verifyPlOwner);

router.route('/').get(getPlaylist);

router.route('/tracks').post(filterDupTracks, trackLimit, restorePlaylistTracks, removeStashTracks);

router.route('/stash').get(getStash);
router.route('/stash/tracks').post(filterDupTracks, trackLimit, stashTracks, removePlaylistTracks);

export { router as playlistRouter };
