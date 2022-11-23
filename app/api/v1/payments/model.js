const mongoose = require('mongoose');
const { Schema, model } = mongoose

const paymentSchema = new Schema(
    {
        type: {
            type: String,
            required: [true, 'Payement type is required'],
            minlength: 3,
            maxlength: 50
        },
        image: {
            type: mongoose.Types.ObjectId,
            ref: 'Image',
            required: true
        },
        status: {
            type: Boolean,
            enum: [true, false],
            default: true
        },
        organizer: {
            type: mongoose.Types.ObjectId,
            ref: 'Organizer',
            required: true
        }
    },
    { timestamps: true }
)

module.exports = model('Payment', paymentSchema)