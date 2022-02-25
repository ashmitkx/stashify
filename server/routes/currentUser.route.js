import { Router } from 'express';
import { getCurrUserDetails, getCurrUserPlaylists } from '../api/currentUser.api.js';

// @route: /me
const router = Router();

router.route('/').get(getCurrUserDetails);
router.route('/playlists').get(getCurrUserPlaylists);

export { router as currUserRouter };
