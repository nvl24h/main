'use strict'

const {Schema, model} = require('mongoose')

const DOCUMENT_NAME = 'keyToken'
const COLLECTION_NAME = 'keyTokens'

const keyTokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'shop'
    },
    publickey: {
        type: String,
        required: true
    },
    privateKey: {
        type: String,
        required: true
    },
    refeshToken: {
        type: String,
        required: true
    },
    refeshTokenUsage: {
        type: Array,
        default: []
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = model(DOCUMENT_NAME, keyTokenSchema)