'use strict'

const { converObjectMongoId, getSelectData, unGetSelectData } = require("../../utils")
const {product} = require("../product.model")


 // ------------- UPDATE PRODUCT-------------
const findUpdateProduct = async (productId, payload, model) => {
    return await model.findByIdAndUpdate(productId, payload, {new: true})
}

 // ------------- QUERY PRODUCT USER-------------
const findProductUser = async ({query, unSelect}) => {
    return await product.findOne(query)
        .select(unGetSelectData(unSelect))
        .lean()
}

 // ------------- QUERY PRODUCT ALL USER-------------
const findAllProductUser = async ({limit, sort, page, filter, select}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id : 1}

    const products = product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()

    return products
}

 // ------------- SEARCH PRODUCT -------------
const searchProduct = async ({keySearch}) => {
    const regExpSearch = new RegExp(keySearch)

    const result = product.find({
        isPublicted: true,
        $text: {$search: regExpSearch},
    }, {
        score: {$meta: 'textScore'}
    })
    .sort( {score: {$meta: 'textScore'}} )
    .lean()

    return result
}

 // ------------- PUBLICT <=> UNPUBLICT -------------
const publictProduct = async ({product_shop, productId}) => {
    const foundProduct = await product.findOne({
        product_shop: converObjectMongoId(product_shop),
        _id: converObjectMongoId(productId)
    })
    console.log(foundProduct);
    if(!foundProduct) return null

    foundProduct.isDraft = false
    foundProduct.isPublicted = true

    const {modifiedCount} = await foundProduct.updateOne(foundProduct)
    return modifiedCount
}

const unPublictProduct = async ({product_shop, productId}) => {
    const foundProduct = await product.findOne({
        product_shop: converObjectMongoId(product_shop),
        _id: converObjectMongoId(productId)
    })

    if(!foundProduct) return null

    foundProduct.isDraft = true
    foundProduct.isPublicted = false

    const {modifiedCount} = await foundProduct.updateOne(foundProduct)
    return modifiedCount
}


// ------------- QUERY PRODUCT ------------- 
const findAllDraftProduct = async ({query, limit, skip}) => {
    return await queryProduct({query, limit, skip})
}

const findAllPublictProduct = async ({query, limit, skip}) => {
    return await queryProduct({query, limit, skip})
}

const queryProduct = async ({query, limit, skip}) => {
    return await product.find(query)
    .populate('product_shop', 'name email _id')
    .sort({updateAt: -1})
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

module.exports = {
    findAllDraftProduct,
    findAllPublictProduct,
    publictProduct,
    unPublictProduct,
    searchProduct,
    findAllProductUser,
    findProductUser,
    findUpdateProduct
}