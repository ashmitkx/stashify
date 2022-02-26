import { Router } from 'express';
import { getPlaylist, removeTracks, restoreTracks } from '../api/playlist.api.js';
import { trackLimit } from '../middlewares/trackLimit.middleware.js';

// @route: /playlists/:playlist_id
const router = Router({ mergeParams: true });

router.route('/').get(getPlaylist);

router.route('/tracks').post(trackLimit, restoreTracks).delete(trackLimit, removeTracks);

export { router as playlistRouter };
