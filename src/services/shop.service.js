'use strict'

const shopModel = require("../models/shop.model")

const ROLES = {
    SHOP: 'SHOP',
    ADMIN: 'ADMIN'
}

class ShopService {
    static findByEmail = async ({email}) => {
        return await shopModel.findOne({email}).lean()
    }

    static createShop = async ({name, email, password}) => {
        return await shopModel.create({
            name,
            email,
            password,
            roles: ROLES.SHOP
        })
    }

    static findByUserId = async ({id}) => {
        return await shopModel.findById(id)
    }
}

module.exports = ShopService