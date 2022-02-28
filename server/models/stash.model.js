import mongoose from 'mongoose';

const stashSchema = new mongoose.Schema({
    spotify_user_id: {
        type: String,
        required: true,
        trim: true,
        index: true,
        match: [/^[A-Za-z0-9]{25}$/, 'Invalid spotify user id.'] // spotify uses base-62 ids of length 25
    },
    playlist_id: {
        type: String,
        required: true,
        trim: true,
        index: true,
        match: [/^[A-Za-z0-9]{22}$/, 'Invalid playlist id.'] // spotify uses base-62 ids of length 22
    },
    track_ids: {
        type: [
            {
                type: String,
                trim: true,
                match: [/^[A-Za-z0-9]{22}$/, 'Invalid track id.'] // spotify uses base-62 ids of length 22
            }
        ],
        validate: [val => val.length > 0, 'Stash must have atleast 1 track_id.']
    },
    date: {
        type: Date,
        default: () => new Date()
    }
});

export const Stash = mongoose.model('stash', stashSchema);
