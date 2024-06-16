'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { checkAuthorization } = require('../../auth/authUtils')
const DiscountController = require('../../controller/discount.controller')
const router = express.Router()

router.get('/list_product_code', asyncHandler(DiscountController.getAllCodeWirhProduct))
router.post('/amount', asyncHandler(DiscountController.getDiscountAmount))
router.get('/cancel', asyncHandler(DiscountController.cancelDisocunt))

// Check Authorization
router.use(asyncHandler(checkAuthorization))
///////////////////

router.post('', asyncHandler(DiscountController.createDiscount))
router.get('', asyncHandler(DiscountController.getAllDiscountCodeByShop))
router.get('/deleted/:codeId', asyncHandler(DiscountController.deleteDiscount))


module.exports = router