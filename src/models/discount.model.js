'use strict'

const {Schema, model} = require('mongoose')

const DOCUMENT_NAME = 'discount'
const COLLECTION_NAME = 'discounts'

const discountSchema = new Schema({
    disocunt_name: {type: String, required: true}, // Ten discount 
    discount_description: String, // Mo ta
    disocunt_type: {type: String, required: true, enum: ['fixed_amount', 'percenter'], default: 'fixed_amount'}, // loai
    discount_code: {type: String, required: true}, // code
    discount_value: {type: Number, required: true}, // 10k hay 10%
    discount_max_value: {type: Number, required: true}, // giam gia cao nhat
    discount_start_date: {type: Date, required: true}, // ngay bat dau
    discount_end_date: {type: Date, required: true}, // ngay ket thuc
    discount_max_uses: {type: Number, required: true}, // Tong so discount phat hanh
    discount_uses_count: {type: Number, required: true}, // so luong discount duoc su dung
    discount_users_used: {type: Array, default: []}, // ai su dung
    discount_max_uses_per_user: {type: Number, required: true}, // So luong cho phep toi da duoc su dung
    discount_min_order_value: {type: Number, required: true},
    disocunt_shopId: {type: Schema.Types.ObjectId, ref: 'shop', required: true},

    discount_is_active: {type: Boolean, default: true},
    discount_applies_to: {type: String, required: true, enum: ['all', 'specific']},
    discount_product_ids: {type: Array, default: []}
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, discountSchema)

