'use strict'

const { BadRequestError } = require("../core/error.reponse")
const discountModel = require("../models/discount.model")
const { findAllDisocuntCodeUnselect } = require("../models/repositories/discount.repo")
const { getDiscountProduct } = require("../models/repositories/product.repo")
const { converObjectMongoId } = require("../utils")

class DiscountService {

    //------------- CREATE DISCOUNT -------------
    static createDiscount = async (payload) => {
        const {name, description, type, code, value, max_value, start_date, end_date, is_active,
            max_uses, uses_count, users_used, max_uses_per_user, min_order_value, shopId, applies_to, product_ids
        } = payload

        // validate
        if(new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError('End date more than start date')
        }

        if(new Date() > new Date(start_date) || new Date() > new Date(end_date)) {
            throw new BadRequestError('Discount code has expried')
        }

        // create Disocunt code
        const foundDiscount = await discountModel.findOne({
            discount_code: code,
            disocunt_shopId: converObjectMongoId(shopId)
        }).lean()

        if(foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('discount exist')
        }

        return await discountModel.create({
            disocunt_name: name,
            discount_description: description,
            disocunt_type: type,
            discount_code: code,
            discount_value: value,
            discount_max_value: max_value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_max_uses_per_user: max_uses_per_user,
            discount_min_order_value: min_order_value,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids,
            discount_is_active: is_active
        })
    }

    //------------- UPDATE DISCOUNT -------------
    static async updateDiscount() {
        // update code
    }

    //------------- GET ALL DISCOUNT WITH PRODUCT -------------
    static async getAllDiscountWithProduct({code, shopId, userId, limit, page}) {
        const foundDiscount = await discountModel.findOne({
            discount_code: code,
            disocunt_shopId: converObjectMongoId(shopId)
        }).lean()

        if(!foundDiscount || !foundDiscount.discount_is_active) {
            throw new BadRequestError('Code not exist')
        }

        const {discount_applies_to, discount_product_ids} = foundDiscount

        let filter
        if(discount_applies_to === 'all') {
            // GET ALL
            filter = {
                product_shop: converObjectMongoId(shopId),
                isPublicted: true
            }
        }

        if(discount_applies_to === 'specific') {
            // GET BY PRODUCT IDS
            filter = {
                product_shop: converObjectMongoId(shopId),
                _id: {$in: discount_product_ids}
            }
        }

        return await getDiscountProduct({
            filter,
            limit: +limit,
            page: +page,
            sort: 'ctime',
            select: ['product_name']
        })
    }

    static async getAllDiscountCodeByShop({limit, page, shopId}) {
        return await findAllDisocuntCodeUnselect({
            limit: +limit,
            page: +page,
            sort: 'ctime',
            filter: {
                disocunt_shopId: converObjectMongoId(shopId),
                discount_is_active: true
            },
            unSelect: ['__v'],
            model: discountModel
        })
    }

    static async getDiscountAmount({codeId, userId, shopId, products}) {
        const foundDiscount = await discountModel.findOne({
            discount_code: codeId,
            disocunt_shopId: converObjectMongoId(shopId)
        }).lean()

        if(!foundDiscount) {
            throw new BadRequestError('Code not exist')
        }

        const {
            discount_is_active,
            discount_max_uses,
            discount_start_date,
            discount_end_date,
            discount_min_order_value,
            discount_max_value,
            discount_max_uses_per_user,
            disocunt_type,
            discount_value
        } = foundDiscount

        if(!discount_is_active) throw new BadRequestError('discount not expried')
        if(!discount_max_uses === 0) throw new BadRequestError('Discount are out')

        if(new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
            throw new BadRequestError('Discount code has expried')
        }

        // Check xem co gia tri toi thiru hay khong
        let totalOrder = 0
        if(discount_min_order_value > 0) {
            // GET TOTAL
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            if(discount_min_order_value < totalOrder) {
                throw new BadRequestError(`Discount require a minimum order value of ${discount_min_order_value}`)
            }
        }
        // discount_max_value
        if(discount_max_uses_per_user > 0) {
            const usesUserDiscount = discount_users_used.find(user => user.userId === userId)
            if(usesUserDiscount) {
                // xu ly
            }
        }

        // check xem discount nay laf fex_amount hay percenter
        const amount = disocunt_type === 'fixed_amount' ? discount_value : (totalOrder * (discount_value / 100))

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }

    static async deleteDiscount({shopId, codeId}) {
        return await discountModel.findOneAndDelete({
            _id: converObjectMongoId(codeId),
            disocunt_shopId: converObjectMongoId(shopId)
        })
    }

    static async cancelDisocunt({codeId, shopId, userId}) {
        const foundDiscount = await discountModel.findOne({
            discount_code: codeId,
            disocunt_shopId: converObjectMongoId(shopId)
        }).lean()

        if(!foundDiscount) {
            throw new BadRequestError('Code not exist')
        }

        return await discountModel.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId,
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        })
    }
}

module.exports = DiscountService