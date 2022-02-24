import { Router } from 'express';
import { spotifyLogin, spotifyCallback } from '../api/auth.api.js';

// @route: /auth
const router = Router();

router.route('/spotify/login').get(spotifyLogin);
router.route('/spotify/callback').get(spotifyCallback);

export { router as authRouter };
