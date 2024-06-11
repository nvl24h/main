'use strict'

const { SuccessReponse, CREATED } = require("../core/success.reponse")
const AccessService = require("../services/access.service")

class AccessController {
    static singUp = async (req, res, next) => {
        new CREATED({
            message: 'create shop success',
            metadata: await AccessService.singUp(req.body)
        }).send(res)
    }

    static logIn = async (req, res, next) => {
        new SuccessReponse({
            message: 'Login shop success',
            metadata: await AccessService.logIn(req.body)
        }).send(res)
    }

    static logOut = async (req, res, next) => {
        new SuccessReponse({
            message: 'LogOut shop success',
            metadata: await AccessService.logOut(req.user)
        }).send(res)
    }

    static handlerRefeshToken = async (req, res, next) => {
        new SuccessReponse({
            message: 'LogOut shop success',
            metadata: await AccessService.handlerRefeshToken({
                user: req.user,
                refeshToken: req.refeshToken,
                keyStore: req.keyStore
            })
        }).send(res)
    }
}

module.exports = AccessController