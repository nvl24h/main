'use strict'

const { SuccessReponse, CREATED } = require("../core/success.reponse")
const FactoryProduct = require("../services/product.service")

class ProductController {

    static createProduct = async (req, res, next) => {
        new CREATED({
            message: 'Create Product Success',
            metadata: await FactoryProduct.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId,
            })
        }).send(res)
    }


    // ------------- QUERY PRODUCT ------------- 
    static findAllDraftProduct = async (req, res, next) => {
        new SuccessReponse({
            message: 'Find Draft Product Success',
            metadata: await FactoryProduct.findAllDraftProduct({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    static findAllPublictProduct = async (req, res, next) => {
        new SuccessReponse({
            message: 'Find Publict Product Success',
            metadata: await FactoryProduct.findAllPublictProduct({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    // ------------- PUBLICT <=> UNPUBLICT -------------
    static publictProduct = async (req, res, next) => {
        new SuccessReponse({
            message: 'Publict Product Success',
            metadata: await FactoryProduct.publictProduct({
                product_shop: req.user.userId,
                productId: req.params.id
            })
        }).send(res)
    }

    static unPublictProduct = async (req, res, next) => {
        new SuccessReponse({
            message: 'unPublict Product Success',
            metadata: await FactoryProduct.unPublictProduct({
                product_shop: req.user.userId,
                productId: req.params.id
            })
        }).send(res)
    }

    // ------------- SEARCH PRODUCT -------------
    static searchProduct = async (req, res, next) => {
        new SuccessReponse({
            message: 'Search Product Success',
            metadata: await FactoryProduct.searchProduct(req.params)
        }).send(res)
    }

    // ------------- QUERY PRODUCT ALL USER-------------
    static findAllProductByUser = async (req, res, next) => {
        new SuccessReponse({
            message: 'Find All Product Success',
            metadata: await FactoryProduct.findAllProductUser(req.query)
        }).send(res)
    }

    // ------------- QUERY PRODUCT USER-------------
    static findProductByUser = async (req, res, next) => {
        new SuccessReponse({
            message: 'Find Product Success',
            metadata: await FactoryProduct.findProductUser(req.params.productId)
        }).send(res)
    }

    // ------------- UPDATE PRODUCT-------------
    static updateProduct = async (req, res, next) => {
        new SuccessReponse({
            message: 'Find Product Success',
            metadata: await FactoryProduct.updateProduct(req.body.product_type, req.params.productId, {
                ...req.body
            })
        }).send(res)
    }
}

module.exports = ProductController