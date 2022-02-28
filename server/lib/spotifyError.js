export class SpotifyError extends Error {
    constructor(status, message) {
        super(message);
        this.name = 'SpotifyError';
        this.status = status;
    }
}
