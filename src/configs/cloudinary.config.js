'use strict'

const cloudinary = require('cloudinary').v2
const {cloudinary: {secret}} = require('./init.config')

cloudinary.config({
    cloud_name: 'productcnd',
    api_key: '483353132976922',
    api_secret: secret
}) 

module.exports = cloudinary