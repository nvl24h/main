'use strict'

const {ReasonPhrases, StatusCodes} = require('./httpStatusCode')

class errorReponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class BadRequestError extends errorReponse {
    constructor(message = ReasonPhrases.BAD_REQUEST, status = StatusCodes.BAD_REQUEST) {
        super(message, status)
    }
}

class UnauthorizedError extends errorReponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED, status = StatusCodes.UNAUTHORIZED) {
        super(message, status)
    }
}

class ForbiddenError extends errorReponse {
    constructor(message = ReasonPhrases.FORBIDDEN, status = StatusCodes.FORBIDDEN) {
        super(message, status)
    }
}

class NotfoundError extends errorReponse {
    constructor(message = ReasonPhrases.NOT_FOUND, status = StatusCodes.NOT_FOUND) {
        super(message, status)
    }
}

class ConflictError extends errorReponse {
    constructor(message = ReasonPhrases.CONFLICT, status = StatusCodes.CONFLICT) {
        super(message, status)
    }
}

module.exports = {
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotfoundError,
    ConflictError
}