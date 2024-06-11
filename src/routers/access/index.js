'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const AccessController = require('../../controller/access.controller')
const { checkAuthorization } = require('../../auth/authUtils')
const router = express.Router()

router.post('/shop/signup', asyncHandler(AccessController.singUp))
router.post('/shop/login', asyncHandler(AccessController.logIn))

// Check Authorization
router.use(asyncHandler(checkAuthorization))
///////////////////

router.post('/shop/logout', asyncHandler(AccessController.logOut))
router.post('/shop/handlertokenusage', asyncHandler(AccessController.handlerRefeshToken))


module.exports = router