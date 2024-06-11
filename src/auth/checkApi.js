'use strict'

const { UnauthorizedError } = require("../core/error.reponse")
const ApiKeyService = require("../services/apiKey.service")

const HEADERS = {
    APIKEY : 'x-api-key'
}

const checkApiKey = async (req, res, next) => {
    const key = req.headers[HEADERS.APIKEY?.toString()]
    if(!key) throw new UnauthorizedError('ApiKey Error')

    const foundKey = await ApiKeyService.findByKey({key})
    if(!foundKey) throw new UnauthorizedError('ApiKey Error')
    
    req.apiKey = foundKey
    return next()
}

const checkPermission = (permission) => {
    return (req, res, next) => {
        try {
            if(req.apiKey.permission) {
                const valida = req.apiKey.permission.includes(permission)
                if(!valida) throw new UnauthorizedError('permission error')
                return next()
            }
            throw new UnauthorizedError('Not permission')
        } catch (error) {
            throw error
        }
    }
}


module.exports = {
    checkApiKey,
    checkPermission
}