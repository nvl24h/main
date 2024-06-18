'use strict'

const {Schema, model} = require('mongoose')

const DOCUMENT_NAME = 'cart'
const COLLECTION_NAME = 'carts'

const cartSchema = new Schema({
    cart_state: {
        type: String,
        required: true,
        enum: ['active', 'pending', 'fail', 'complate', 'lock'],
        default: 'active'
    }, 
    cart_products: {
        type: Array,
        default: [],
        required: true
    },
    /**
     * {
     *     productId,
     *     shopId,
     *     quantity,
     *     name,
     *     price
     * }
     */
    cart_count_product: {
        type: Number,
        default: 0
    },
    cart_user_id: {
        type: Number,
        required: true
    }
}, {
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn'
    },
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, cartSchema)