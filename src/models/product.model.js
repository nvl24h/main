'use strict'

const {Schema, model} = require('mongoose')
const slugify = require('slugify')

const DOCUMENT_NAME = 'product'
const COLLECTION_NAME = 'products'

const productSchema = new Schema({
    product_name: {type: String, required: true}, // name product
    product_slug: {type: String, unique: true}, // slug product
    product_description: String, // description product
    product_thumb: {type: String, required: true}, // image product
    product_price: {type: Number, required: true}, // price
    product_quantity: {type: Number, required: true}, // quantity
    product_shop: {type: Schema.Types.ObjectId, required: true, ref: 'shop'}, // product shop
    product_attributes: {type: Schema.Types.Mixed, required: true},
    product_type: {type: String, required: true, enum: ['Electronic', 'Clothing']},

    product_ratingsArage: {
        type: Number,
        default: 4.5,
        min: [1, 'Gia tri thap nhat la 1.0'],
        max: [5, 'Gia tri cao nhat la 5.0'],
        set: (val) => Math.round(val*10) / 10 // lam tron 4.4444 => 4.5
    },

    isPublicted: {type: Boolean, default: false, index: true, select: 0},
    isDraft: {type: Boolean, default: true, index: true, select: 0}
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

productSchema.index({product_name: 'text', product_description: 'text'})

productSchema.pre('save', function(next) {
    this.product_slug = slugify(this.product_name, {
        lower: true,
        strict: true,
        locale: 'vi',
        trim: true,
    })

    next()
})

const clothingSchema = new Schema({
    brand: {type: String, required: true},
    color: String,
    size: String,
    product_shop: {type: Schema.Types.ObjectId, required: true, ref: 'shop'}, // product shop
}, {
    timestamps: true,
    collection: 'clothings'
})


const electronicSchema = new Schema({
    manufactory: {type: String, required: true},
    color: String,
    size: String,
    product_shop: {type: Schema.Types.ObjectId, required: true, ref: 'shop'}, // product shop
}, {
    timestamps: true,
    collection: 'electronics'
})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('clothing', clothingSchema),
    electronic: model('electronic', electronicSchema)
}
