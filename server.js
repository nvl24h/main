'use strict'

const app = require('./src/app')
const {app: {PORT}} = require('./src/configs/init.config')

const server = app.listen(PORT, () => console.log(`WSV START PORT ${PORT}`))

process.on('SIGINT', () => {
    server.close(() => {
        console.log('WSV CLOSE');
    })
})