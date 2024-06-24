'use strict'

const { BadRequestError } = require("../core/error.reponse")
const cartModel = require("../models/cart.model")
const orderModel = require("../models/order.model")
const { findByCartID } = require("../models/repositories/cart.repo")
const { checkProductByserver } = require("../models/repositories/product.repo")
const { getDiscountAmount } = require("./discount.service")

class CHeckoutService {
    /**
     * Login and without login
        {
            cartId,
            userId,
            shop_order_ids: [
                {
                    shopId,
                    shop_discounts: [],
                    item_product: {
                        price,
                        quantity,
                        productId
                    }
                },
                {
                    shopId,
                    shop_discounts: [
                        {
                            "shopId",
                            "discountId",
                            codeId:
                        }
                    ],
                    item_product: {
                        price,
                        quantity,
                        productId
                    }
                },
            ]
        }
    */

    static async checkoutReview ({cartId, userId, shop_order_ids}){
        const foundCart = await findByCartID({cartId, model: cartModel})
        if(!foundCart) throw new BadRequestError('cart not exists!')

        const checkout_order = {
            totalPrice: 0, // Tong tien hang
            freeShip: 0, // phi van chuyen
            totalDiscount: 0, // tong tin discount giam gia
            totalCheckout: 0, // Tong thanh toan
        }, shop_order_ids_new = []

        // tinh tong tien bill
        for (let i = 0; i < shop_order_ids.length; i++) {
            const {shopId, shop_discounts = [], item_products = []} = shop_order_ids[i]
            console.log(item_products, '--dsdsssssssssss-----');

            // Check product available
            const checkProductServer = await checkProductByserver(item_products)
            console.log(checkProductServer, '----------');
            if(!checkProductServer[0]) throw new BadRequestError('order wrong!!!')

            // Tong tien down hang
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            // Tong tien truowc khi xu ly
            checkout_order.totalPrice =+ checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice, // tien truowc khi giam gia
                priceApplyDiscount: checkoutPrice,
                item_product: checkProductServer
            }

            // neu shop_discount ton tai > 0, check xem co hop le hay khong
            if(shop_discounts.length > 0) {
                // gia su chi co 1 disount
                // get amount discount
                const {totalPrice = 0, discount = 0} = await getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })

                // Tong cong discount giam gia
                checkout_order.totalDiscount += discount

                // neu tien giam gia lown hon khong
                if(discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            // Tong tien thanh toan cuoi cung
            checkout_order.totalCheckout =+ itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    static async orderByUser({shop_order_ids, cartId, userId, user_adress = {}, user_payment = {}}) {
        const {shop_order_ids_new, checkout_order} = await OrderService.checkoutReview({
            cartId,
            userId,
            shop_order_ids
        })

        // check lai 1 lan nua xem vuot kho hay khong
        const products = shop_order_ids_new.flatMap(order => order.item_products)
        console.log(`[1] `, products)
        // Check ton kho
        // for (let i = 0; i < products.length; i++) {
        //     const {productId, quantity} = products[i]
            
        // }

        const newOrder = await orderModel.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_adress,
            order_payment: user_payment,
            order_products: shop_order_ids_new
        })

        // Truowng hop order thanh cong remove san pham co trong gio hang
        if(newOrder) {
            // remove product in my cart
        }

        return newOrdergit 
    }

    static async getOrderByUser() {

    }

    static async getOneOrderByUser() {

    }

    static async cancelOrderByUser() {

    }

    static async updateOrderStatusByShop() {

    }
}

module.exports = CHeckoutService