'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { checkAuthorization } = require('../../auth/authUtils')
const ProductController = require('../../controller/product.controller')
const router = express.Router()

// ------------- SEARCH PRODUCT -------------
router.get('/search/:keySearch', asyncHandler(ProductController.searchProduct))
// ------------- QUERY PRODUCT ALL USER-------------
router.get('', asyncHandler(ProductController.findProductByUser))
// ------------- QUERY PRODUCT USER-------------
router.get('/:productId', asyncHandler(ProductController.findProductByUser))


// Check Authorization
router.use(asyncHandler(checkAuthorization))
///////////////////

router.post('', asyncHandler(ProductController.createProduct))
// ------------- PUBLICT <=> UNPUBLICT ------------- 
router.post('/publict/:id', asyncHandler(ProductController.publictProduct))
router.post('/unpublict/:id', asyncHandler(ProductController.unPublictProduct))
router.patch('/:productId', asyncHandler(ProductController.updateProduct))




// ------------- QUERY PRODUCT ------------- 
router.get('/drafts/all', asyncHandler(ProductController.findAllDraftProduct))
router.get('/publict/all', asyncHandler(ProductController.findAllPublictProduct))


module.exports = router