// env vars
const maxTracks = process.env.MAX_TRACKS_PER_REQUEST;

export function trackLimit(req, res, next) {
    // some spotify endpoints have limits on number of tracks that a request can have
    const trackCount = req.body.track_ids?.length || 0;
    if (trackCount > maxTracks)
        return next({
            status: 400,
            message: `Cannot send more than ${maxTracks} unique tracks (sent ${trackCount}).`
        });

    next();
}
