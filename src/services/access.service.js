'use strict'

const { createTokenPair } = require("../auth/authUtils")
const { BadRequestError, NotfoundError, ForbiddenError, UnauthorizedError } = require("../core/error.reponse")
const { infoDataShop } = require("../utils")
const KeyTokenService = require("./keyToken.service")
const ShopService = require("./shop.service")
const bcrypt = require('bcrypt')
const { randomBytes } = require('node:crypto')

class AccessService {
    static singUp = async ({name, email, password}) => {
        // check email exists
        const foundShop = await ShopService.findByEmail({email})
        if(foundShop) throw new BadRequestError('shop alrealy exists')
        
        // create shop
        const passwordHash = await bcrypt.hash(password, 10)
        const newShop = await ShopService.createShop({name, email, password: passwordHash})

        // Create Keytoken
        if(newShop) {
            const publicKey = randomBytes(64).toString('hex')
            const privateKey = randomBytes(64).toString('hex')

            const keyStore = await KeyTokenService.createAndUpdate({
                userId: newShop._id,
                publickey: publicKey,
                privateKey: privateKey,
                refeshToken: ' '
            })

            if(!keyStore) throw new BadRequestError('KeyStore Error')

            const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)

            return {
                shop: infoDataShop(newShop, ['_id', 'name', 'email']),
                tokens
            }
        }
        return {
            shop: null
        }
    }

    static logIn = async ({email, password}) => {
        const foundShop = await ShopService.findByEmail({email})
        if(!foundShop) throw new NotfoundError('The store dost not exist')

        const hashPassword = await bcrypt.compare(password, foundShop.password)
        if(!hashPassword) throw new BadRequestError('Password error')

        const publicKey = randomBytes(64).toString('hex')
        const privateKey = randomBytes(64).toString('hex')
        
        const tokens = await createTokenPair({userId: foundShop._id, email}, publicKey, privateKey)
        
        await KeyTokenService.createAndUpdate({
            userId: foundShop._id,
            publickey: publicKey,
            privateKey: privateKey,
            refeshToken: tokens.refeshToken
        })

        return {
            shop: infoDataShop(foundShop, ['name', 'email', '_id']),
            tokens
        }
    }

    static logOut = async ({userId}) => {
        const delKey = await KeyTokenService.removeKeyByUser({userId})
        return delKey
    }

    static handlerRefeshToken = async ({user, refeshToken, keyStore}) => {
        const {userId, email} = user

        if(keyStore.refeshTokenUsage.includes(refeshToken)) {
            await KeyTokenService.removeById({id: keyStore._id})
            throw new ForbiddenError('Hoat dong bat thuong vui long dang nhap lai')
        }

        if(keyStore.refeshToken !== refeshToken) throw new UnauthorizedError('Shop not exists!')

        const foundShop = await ShopService.findByUserId({id: userId})
        if(!foundShop) throw NotfoundError('Not found shop')
 
        const tokens = await createTokenPair({userId, email}, keyStore.publickey, keyStore.privateKey)

        // tim cho vui
        const FoundKey = await KeyTokenService.FoundKey({userId})

        // update Token
        await FoundKey.updateOne({
            $set: {refeshToken: tokens.refeshToken},
            $addToSet: {refeshTokenUsage: refeshToken} // // da duoc su dung de lay token moi roi
        })

        return {
            shop: infoDataShop(foundShop, ['name', 'email', '_id']),
            tokens
        }
    }
}

module.exports = AccessService