'use strict'

const JWT = require('jsonwebtoken')
const KeyTokenService = require('../services/keyToken.service')
const { UnauthorizedError } = require('../core/error.reponse')

const HEADERS = {
    USER_ID : 'x-user-id',
    AUTHORIZATION: 'authorization',
    REFESHTOKEN: 'x-rtoken-id'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accsessToken = JWT.sign(payload, publicKey, {
            expiresIn: '2 Days'
        })

        const refeshToken = JWT.sign(payload, privateKey, {
            expiresIn: '7 Days'
        })

        return {accsessToken, refeshToken}
    } catch (error) {
        throw error
    }
}

const checkAuthorization = async (req, res, next) => {
    const userId = req.headers[HEADERS.USER_ID]
    if(!userId) throw new UnauthorizedError('User not exist!')

    const keyStore = await KeyTokenService.findByUserId({userId})
    if(!keyStore) throw new UnauthorizedError('Authorization Error')

    // Check refeshToken
    const refeshToken = req.headers[HEADERS.REFESHTOKEN]
    if(refeshToken) {
        try {
            const decodeUser = JWT.verify(refeshToken, keyStore.privateKey)
            if(decodeUser.userId !== userId ) throw new UnauthorizedError('Authorization error')

            req.user = decodeUser // {userId, email}
            req.refeshToken = refeshToken
            req.keyStore = keyStore

            return next()
        } catch (error) {
            throw error
        }
    }

    // Check AccessToken
    const accsessToken = req.headers[HEADERS.AUTHORIZATION]
    if(accsessToken) {
        try {
            const decodeUser = JWT.verify(accsessToken, keyStore.publickey)
            if(decodeUser.userId !== userId) throw new UnauthorizedError('invalid requet')

            req.user = decodeUser
            req.keyStore = keyStore
            
            return next()
        } catch (error) {
            throw error
        }
    }
    throw new UnauthorizedError('Authorization')
}

module.exports = {
    createTokenPair,
    checkAuthorization
}