import mongoose from 'mongoose';

const stashSchema = new mongoose.Schema({
    spotify_user_id: {
        type: String,
        required: true,
        trim: true,
        match: [/^[A-Za-z0-9]{25}$/, 'Invalid spotify user id.'] // spotify uses base-62 ids of length 25
    },
    playlist_id: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: [/^[A-Za-z0-9]{22}$/, 'Invalid playlist id.'] // spotify uses base-62 ids of length 22
    },
    tracks: [
        {
            id: {
                type: String,
                required: true,
                trim: true,
                match: [/^[A-Za-z0-9]{22}$/, 'Invalid track id.'] // spotify uses base-62 ids of length 22
            },
            date_stashed: {
                type: Date,
                required: true,
                default: () => new Date()
            },
            _id: false
        }
    ]
});

export const Stash = mongoose.model('stash', stashSchema);
