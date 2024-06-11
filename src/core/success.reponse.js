'use strict'

const {ReasonPhrases, StatusCodes} = require('./httpStatusCode')

class SuccessReponse {
    constructor({ message, reasonMessage = ReasonPhrases.OK, status = StatusCodes.OK, metadata = {} }) {
        this.message = !message ? reasonMessage : message
        this.status = status
        this.metadata = metadata
    }

    send(res, header = {}) {
        return res.status(this.status).json(this)
    }
}

class CREATED extends SuccessReponse{
    constructor({message = ReasonPhrases.CREATED, status = StatusCodes.CREATED, metadata = {}, options = {}}) {
        super({message, status, metadata})
        this.options = options
    }
}

module.exports = {
    CREATED,
    SuccessReponse
}