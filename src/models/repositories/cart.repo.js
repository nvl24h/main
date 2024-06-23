'use strict'

const { converObjectMongoId } = require("../../utils")

const createCart = async ({userId, product, model}) => {
    const query = {cart_user_id: userId, cart_state: 'active'}
    const updateOrderInsert = {
        $addToSet: {
            cart_products: product
        }
    }
    const option = {upsert: true, new: true}

    return await model.findOneAndUpdate(query, updateOrderInsert, option)
}

const updateQuantity = async ({userId, product, model}) => {
    const {productId, quantity} = product
  
    const query = {
        // cart_user_id: userId,
        'cart_products.productId': productId,
        // cart_state: 'active'
    }

    const updateSet = {
        $inc: {
            'cart_products.$.quantity': quantity
        }
    }

    const option = { upsert: true, new: true }
  
    return await model.findOneAndUpdate(query, updateSet, option)
}

const findByCartID = async ({cartId, model}) => {
    return await model.findOne({_id: converObjectMongoId(cartId), cart_state: 'active'}).lean()
}

const userCartItem = async ({userId, productId, model}) => {
    const query = {
        cart_user_id: userId,
        "cart_products.productId": productId
    }

    return await model.findOne(query)
}

module.exports = {
    createCart,
    updateQuantity,
    findByCartID,
    userCartItem
}