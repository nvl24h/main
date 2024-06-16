'use strict'

const { CREATED, SuccessReponse } = require("../core/success.reponse")
const DiscountService = require("../services/discount.service")

class DiscountController {
    static createDiscount = async (req, res, next) => {
        new CREATED({
            message: 'Create Discount Sucess',
            metadata: await DiscountService.createDiscount({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }

    static getAllCodeWirhProduct = async (req, res, next) => {
        new SuccessReponse({
            message: 'getAllCodeWirhProduct Sucess',
            metadata: await DiscountService.getAllDiscountWithProduct(req.query)
        }).send(res)
    }

    static getAllDiscountCodeByShop = async (req, res, next) => {
        new SuccessReponse({
            message: 'getAllDiscountCodeByShop Sucess',
            metadata: await DiscountService.getAllDiscountCodeByShop({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res)
    }

    static getDiscountAmount = async (req, res, next) => {
        new SuccessReponse({
            message: 'getAllCodeWirhProduct Sucess',
            metadata: await DiscountService.getDiscountAmount (req.body)
        }).send(res)
    }

    static deleteDiscount = async (req, res, next) => {
        new SuccessReponse({
            message: 'getAllCodeWirhProduct Sucess',
            metadata: await DiscountService.deleteDiscount ({
                shopId: req.user.userId,
                codeId: req.params.codeId
            })
        }).send(res)
    }

    static cancelDisocunt = async (req, res, next) => {
        new SuccessReponse({
            message: 'getAllCodeWirhProduct Sucess',
            metadata: await DiscountService.cancelDisocunt (req.body)
        }).send(res)
    }
}

module.exports = DiscountController