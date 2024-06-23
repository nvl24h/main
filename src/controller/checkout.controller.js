'use strict'

'use strict'

const { SuccessReponse, CREATED } = require("../core/success.reponse")
const CHeckoutService = require("../services/checkout.service")

class CheckoutController {
    checkoutReview = async (req, res, next) => {
        new SuccessReponse({
            message: 'checkoutReview success',
            metadata: await CHeckoutService.checkoutReview(req.body)
        }).send(res)
    }

}

module.exports = new CheckoutController()