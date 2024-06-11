'use strict'

const apiKeyModel = require("../models/apiKey.model")
const {randomBytes} = require('node:crypto')

class ApiKeyService {
    static findByKey = async ({key}) => {
        // await apiKeyModel.create({key: randomBytes(64).toString('hex'), permission: ['0000']})

        return await apiKeyModel.findOne({key}).lean()
    }
}

module.exports = ApiKeyService