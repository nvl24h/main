'use strict'

const dev = {
    app: {
        PORT: process.env.DEV_APP_PORT || 5000
    },

    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || 'courson1'
    }
}

const pro = {
    app: {
        PORT: process.env.PRO_APP_PORT || 5001
    },

    db: {
        host: process.env.PRO_DB_HOST || 'localhost',
        port: process.env.PRO_DB_PORT || 27017,
        name: process.env.PRO_DB_NAME || 'courson2'
    }
}

const config = {dev, pro}
const env = process.env.NODE_APP || 'dev'

module.exports = config[env]