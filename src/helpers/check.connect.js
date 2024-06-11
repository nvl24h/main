'use strict'

const mongoose = require('mongoose')

const checkCountConnect = () => {
    return mongoose.connections.length
}

module.exports = {
    checkCountConnect
}