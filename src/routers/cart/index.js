'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { checkAuthorization } = require('../../auth/authUtils')
const CartController = require('../../controller/cart.contorller')
const router = express.Router()

router.post('', asyncHandler(CartController.addToCart))
router.post('/update', asyncHandler(CartController.update))
router.get('', asyncHandler(CartController.listToCart))
router.delete('', asyncHandler(CartController.deleteItemCart))


module.exports = router