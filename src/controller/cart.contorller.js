'use strict'

const { SuccessReponse, CREATED } = require("../core/success.reponse")
const CartService = require("../services/cart.service")

class CartController {
    static addToCart = async (req, res, next) => {
        new SuccessReponse({
            message: 'Add to cart success',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }

    static update = async (req, res, next) => {
        new SuccessReponse({
            message: 'Update cart success',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }

    static listToCart = async (req, res, next) => {
        new SuccessReponse({
            message: 'Update cart success',
            metadata: await CartService.getLishUSerCart(req.query)
        }).send(res)
    }

    static deleteItemCart = async (req, res, next) => {
        new SuccessReponse({
            message: 'Update cart success',
            metadata: await CartService.deleteItemCart(req.body)
        }).send(res)
    }
}

module.exports = CartController