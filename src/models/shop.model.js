'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'shop'
const COLLECTION_NAME = 'shops'

const shopSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    verify: {
        type: Schema.Types.Boolean,
        default: false
    },
    roles: {
        type: Array,
        default: []
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = model(DOCUMENT_NAME, shopSchema)