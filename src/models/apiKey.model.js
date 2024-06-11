'use strict'

const {Schema, model} = require('mongoose')

const DOCUMENT_NAME = 'apiKey'
const COLLECTION_NAME = 'apiKeys'

const apiKeySchema = new Schema({
    key: {
        type: String,
        required: true
    },
    permission: {
        type: [String],
        enum: ['0000', '1111', '2222'],
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, apiKeySchema)