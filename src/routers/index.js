'use strict'

const express = require('express')
const { asyncHandler } = require('../helpers/asyncHandler')
const { checkApiKey, checkPermission } = require('../auth/checkApi')
const router = express.Router()

// Check Api Key
router.use(asyncHandler(checkApiKey))
// permission
router.use(checkPermission('0000'))

router.use('/v1/api/product', require('./product'))
router.use('/v1/api/discount', require('./discount'))
router.use('/v1/api', require('./access'))

module.exports = router