'use strict'

const { unGetSelectData } = require("../../utils")

const findAllDisocuntCodeUnselect = async ({limit = 50, page = 1, sort = 'ctime', filter, unSelect, model}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id : 1}

    return await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(unGetSelectData(unSelect))
        .lean()
}

module.exports = {
    findAllDisocuntCodeUnselect
}