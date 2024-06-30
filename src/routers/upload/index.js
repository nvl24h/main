'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { checkAuthorization } = require('../../auth/authUtils')
const UploadController = require('../../controller/upload.controller')
const { uploadDisk } = require('../../configs/multer.config')
const router = express.Router()

// Check Authorization
router.use(asyncHandler(checkAuthorization))
///////////////////

router.post('/product', asyncHandler(UploadController.uploadFile))
router.post('/product/thumb', uploadDisk.single('file'), asyncHandler(UploadController.uploadFileThumb))
router.post('/product/multiple', uploadDisk.array('files', 3), asyncHandler(UploadController.uploadFromImageFile))

module.exports = router