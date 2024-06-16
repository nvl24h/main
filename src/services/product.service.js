'use strict'

const { BadRequestError } = require("../core/error.reponse")
const {product, clothing, electronic} = require("../models/product.model")
const { findAllPublictProduct,
        publictProduct,
        unPublictProduct,
        searchProduct,
        findAllProductUser,
        findUpdateProduct,
        findProductUser,
        findAllDraftProduct } = require("../models/repositories/product.repo")
const { removeObjParamsProduct, updateNestedObjectParser } = require("../utils")


class FactoryProduct {

    // ------------- CREATE PRODUCT -------------
    static productRegister = {} // Type - class

    static productTypeRegister(type, classRef) {
        FactoryProduct.productRegister[type] = classRef
    }

    static async createProduct(type, payload) {
        const productType = FactoryProduct.productRegister[type]
        if(!productType) throw new BadRequestError(`Invalid Product Type ${type}`)

        return new productType(payload).createProduct()
    }

    //------------- UPDATE PRODUCT -------------
    static async updateProduct(type, productId, payload) {
        const productType = FactoryProduct.productRegister[type]
        if(!productType) throw new BadRequestError(`Invalid Product Type ${type}`)

        return new productType(payload).updateProduct(productId)
    }

    // ------------- QUERY PRODUCT ------------- 
    static async findAllDraftProduct({product_shop, limit = 50, skip = 0}) {
        const query = {product_shop, isDraft: true}
        return await findAllDraftProduct({query, limit, skip})
    }

    static async findAllPublictProduct({product_shop, limit = 50, skip = 0}) {
        const query = {product_shop, isPublicted: true}
        return await findAllPublictProduct({query, limit, skip})
    }

    // ------------- PUBLICT <=> UNPUBLICT -------------
    static async publictProduct({product_shop, productId}) {
        return await publictProduct({product_shop, productId})
    }

    static async unPublictProduct({product_shop, productId}) {
        return await unPublictProduct({product_shop, productId})
    }

    // ------------- SEARCH PRODUCT -------------
    static async searchProduct({keySearch}) {
        return await searchProduct({keySearch})
    }

    // ------------- QUERY PRODUCT ALL USER-------------
    static async findAllProductUser({limit = 50, sort = 'ctime', page = 1, filter = {isPublicted: true}}) {
        return await findAllProductUser({limit, sort, page, filter, select: ['_id', 'product_name', 'product_thumb', 'product_price']})
    }

    // ------------- QUERY PRODUCT USER-------------
    static async findProductUser(productId) {
        const query = {_id: productId, isPublicted: true}
        return await findProductUser({query, unSelect: ['__v']})
    }
}

class Product {
    constructor({product_name, product_description, product_thumb, product_price, product_quantity, product_type, product_shop, product_attributes}) {
        this.product_name = product_name
        this.product_description = product_description
        this.product_thumb = product_thumb
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_shop = product_shop
        this.product_attributes = product_attributes
        this.product_type = product_type
    }

    async createProduct(productId) {
        console.log(this, '-----------');
        return await product.create({...this, _id: productId})
    }

    async updateProduct(productId, payload) {

        return await findUpdateProduct(productId, payload, product)
    }
}

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({...this.product_attributes, product_shop: this.product_shop})
        if(!newClothing) throw new BadRequestError('Create Clothing Error')

        const newProduct = await super.createProduct(newClothing._id)
        if(!newProduct) throw new BadRequestError('Create Product Error')

        return newProduct
    }

    //------------- UPDATE PRODUCT -------------
    async updateProduct(productId) {
        const thisProduct = removeObjParamsProduct(this)

        if(thisProduct.product_attributes) {
            const updateClothing = await findUpdateProduct(productId, updateNestedObjectParser(thisProduct.product_attributes), clothing)
            if(!updateClothing) throw new BadRequestError('Update Cloting error')
        }

        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(thisProduct))
        return updateProduct
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({...this.product_attributes, product_shop: this.product_shop})
        if(!newElectronic) throw new BadRequestError('Create Electronic Error')

        const newProduct = await super.createProduct(newElectronic._id)
        if(!newProduct) throw new BadRequestError('Create Product Error')

        return newProduct
    }
}

FactoryProduct.productTypeRegister('Clothing', Clothing)
FactoryProduct.productTypeRegister('Electronic', Electronic)

module.exports = FactoryProduct