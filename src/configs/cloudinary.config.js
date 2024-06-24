'use strict'

const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: 'productcnd',
    api_key: '483353132976922',
    api_secret: process.env.CLOUDINARY_API_SECRET
}) 

module.exports = cloudinary