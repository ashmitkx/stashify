export function filterDupTracks(req, res, next) {
    // remove duplicate tracks
    const track_ids = req.body.track_ids;
    if (track_ids) req.body.track_ids = [...new Set(track_ids)];

    next();
}
