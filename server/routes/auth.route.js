import { Router } from 'express';
import cookieParser from 'cookie-parser';
import { spotifyLogin, spotifyCallback } from '../api/auth.api.js';

// env vars
const isProdEnv = process.env.NODE_ENV === 'production';

// @route: /auth
const router = Router();

// use cookieParser for spotify state
const stateCookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProdEnv // use secure cookies in production environment
};
const stateCookieKey = 'spotify_auth_state';
router.use(cookieParser(stateCookieOptions));

// add state cookie data for api functions to use
router.use((req, res, next) => {
    res.locals.stateCookieOptions = stateCookieOptions;
    res.locals.stateCookieKey = stateCookieKey;
    next();
});

router.route('/spotify/login').get(spotifyLogin);
router.route('/spotify/callback').get(spotifyCallback);

export { router as authRouter };
