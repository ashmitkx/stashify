import { AppError } from '../lib/appError.js';

export function trackLimit(req, res, next) {
    // some spotify endpoints have limits on number of tracks that a request can have
    const maxTracks = 100;
    const trackCount = req.body.track_ids?.length || 0;
    const errorMsg = `Cannot send more than ${maxTracks} unique tracks (sent ${trackCount}).`;

    if (trackCount > maxTracks) return next(new AppError(400, errorMsg));

    next();
}
