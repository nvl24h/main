'use strict'

const keytokenModel = require("../models/keytoken.model")
const { converObjectMongoId } = require("../utils")

class KeyTokenService {

    static createAndUpdate = async ({userId, publickey, privateKey, refeshToken = ' '}) => {
        const query = {userId: converObjectMongoId(userId)}
        const update = {publickey, privateKey, refeshToken}
        const options = {upsert: true, new: true}

        return await keytokenModel.findOneAndUpdate(query, update, options)
    }

    static findByUserId = async ({userId}) => {
        return await keytokenModel.findOne({userId}).lean()
    } 

    static removeKeyByUser = async ({userId}) => {
        return await keytokenModel.deleteOne({userId: converObjectMongoId(userId)})
    }

    static removeById = async ({id}) => {
        return await keytokenModel.deleteOne({_id: converObjectMongoId(id)})
    }

    // Tim cho vui
    static FoundKey = async ({userId}) => {
        return await keytokenModel.findOne({userId})
    } 
}

module.exports = KeyTokenService