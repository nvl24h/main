'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const checkoutController = require('../../controller/checkout.controller')
const router = express.Router()

router.post('/review', asyncHandler(checkoutController.checkoutReview))

module.exports = router