'use strict'

const { NotfoundError } = require("../core/error.reponse")
const cartModel = require("../models/cart.model")
const { updateQuantity, createCart, userCartItem } = require("../models/repositories/cart.repo")
const { getProductById } = require("../models/repositories/product.repo")
const { converObjectMongoId } = require("../utils")

/**
 * - Add product to cart - user
 * - Reduce product quantity by one - user
 * - increase product quantity by one - user
 * - get cart - user
 * - delete cart - user
 * - delete cart item - user
 */

class CartService {
    
    static async addToCart({userId, product = {}}) {
        const userCart = await cartModel.findOne({cart_user_id: userId})

        if(!userCart) {
            // create Cart service
            return await createCart({userId, product, model: cartModel})
        }

        // Neu co gio hang roi nhung chua co san pham nao
        if(!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }
        
        const foundItemCart = await userCartItem({userId, productId: product?.productId, model: cartModel})
        if(!foundItemCart) {

            return await userCart.updateOne({
                $addToSet: {
                    cart_products : product
                }
            })
        }

        // Gio hang ton tai va co san pham thi update quantity
        return await updateQuantity({userId, product, model: cartModel})
    }

    // update cart
    /**
     * shop_order_ids: [
     *  {
     *      shopId,
     *      item_products: [
     *          {
     *              quantity,
     *              price,
     *              shopId,
     *              old_quantity,
     *              productId
     *          }
     *      ],
     *      version
     *  }
     * ]
     */

    static async  addToCartV2({userId, shop_order_ids = []}) {
        const {productId, quantity, old_quantity} = shop_order_ids[0]?.item_products[0]

        // checkProduct
        const foundProduct = await getProductById(productId)
        if(!foundProduct) throw new NotfoundError('Product not found')
            // compare
        // if(foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
        //     throw new NotfoundError('Product do not belong to the shop')
        // }
        
        if(quantity === 0) {
            // delete item product
            console.log('quantity == 0');
        }

        return await updateQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            },
            model: cartModel
        })

    }

    static async deleteItemCart({userId, productId}) {
        const query = {cart_user_id: userId, cart_state: 'active'}
        const updateAndInsert = {
            $pull: {
                cart_products: {
                    productId
                }   
            }
        }

        return await cartModel.updateOne(query, updateAndInsert)
    }

    static async getLishUSerCart({userId}) {
        return await cartModel.findOne({
            cart_user_id: +userId
        }).lean()
    }
}

module.exports = CartService