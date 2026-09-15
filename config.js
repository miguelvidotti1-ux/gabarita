const SPOTIFY_CONFIG = {
    CLIENT_ID: 'ccd0f1920d0f46208e4248933143d3fe',
    CLIENT_SECRET: '9877d7359323465c82f6ea8893998ee5',
    REDIRECT_URI: 'https://ais-dev-r6cxhzfuu5mca3ev4cd5ki-397759700099.us-east1.run.app/api/spotify/callback',
    SCOPES: [
        'user-read-private',
        'user-read-email',
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing',
        'playlist-read-private',
        'playlist-modify-private',
        'user-top-read'
    ].join(' ')
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SPOTIFY_CONFIG;
}