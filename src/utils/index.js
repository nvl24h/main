'use strict'

const {Types} = require('mongoose')

const converObjectMongoId = id => new Types.ObjectId(id)

const infoDataShop = (info, payload = []) => {
    const newData = {}

    for(const key of payload) {
        newData[key] = info[key]
    }

    return newData
}

const getSelectData = (data = []) => {
    const newData = {}

    for(const key of data) {
        newData[key] = 1
    }

    return newData
}

const unGetSelectData = (data = []) => {
    const newData = {}

    for(const key of data) {
        newData[key] = 0
    }

    return newData
}

const removeObjParamsProduct = obj => {
    Object.keys(obj).forEach(k => {
        if(obj[k] == null) {
            delete obj[k]
        }
    })

    return obj
}

const updateNestedObjectParser = obj => {
    const final = {}

    for(const k in obj) {
        if ( typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
            const response = updateNestedObjectParser(obj[k])

            for(const a in response) {
                final[`${k}.${a}`] = response[a]
            }
        }else {
            final[k] = obj[k]
        }
    }

    return final
}

// const updateNestedObjectParser = obj => {
//     const final = {}

//     for(const k in obj) {
//         if(obj.hasOwnProperty(k)) {
//             console.log(obj.hasOwnProperty(k), '---------');
//             if ( typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
//                 const response = updateNestedObjectParser(obj[k])

//                 for(const a in response) {
//                     final[`${k}.${a}`] = response[a]
//                 }
//             }else {
//                 final[k] = obj[k]
//             }
//         }
//     }

//     return final
// }

// const updateNestedObjectParser = obj => {
//     console.log(`[1]::`, obj);
//     const final = {}
//     Object.keys(obj).forEach(k => {
//         if ( typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
//             const response = updateNestedObjectParser(obj[k])
//             Object.keys(response).forEach( a => {
//                 final[`${k}.${a}`] = response[a]
//             })
//         }else {
//             final[k] = obj[k]
//         }
//     })

//     console.log(`[2]::`, final);
//     return final
// }

module.exports = {
    converObjectMongoId,
    infoDataShop,
    getSelectData,
    unGetSelectData,
    removeObjParamsProduct,
    updateNestedObjectParser
}