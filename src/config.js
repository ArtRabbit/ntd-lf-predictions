const config = {
    mode: process.env.REACT_APP_API_URL,
    isLive() {
        return this.mode === 'LIVE';
    }
};

module.exports = config;
