'use strict'

const {Schema, model} = require('mongoose')

const DOCUMENT_NAME = 'order'
const COLLECTION_NAME = 'orders'

const orderSchema = new Schema({
    order_userId: {type: Number, required: true},
    order_checkout: {type: Object, default: {}},
    /**
        order_checkout = {
            totalPrice,
            totalApplyDiscount,
            freeShip
        }
    */
    order_shipping: {type: Object, default: {}},
    /**
        street,
        cty,
        state,
        country
    */
   order_payment: {type: Object, default: {}},
   order_products: {type: Array, required: true}, // Shop_order_ids_new
   order_trackingNumber: {type: String, default: '#000023062024'},
   order_status: {type: String, enum: ['pending', 'confirmed', 'ship', 'cancelled', 'delivered'], default: 'pending'},

}, {
    timestamps: {
        createdAt: 'createOn',
        updatedAt: 'updateOr'
    },
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, orderSchema)