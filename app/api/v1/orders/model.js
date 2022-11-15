const mongoose = require('mongoose')
const { model, Schema } = mongoose

const orderDetailsSchema = new Schema({
    ticketCategories: {
        type: {
            type: String,
            required: [true, 'Ticket category is required']
        },
        price: {
            type: Number,
            default: 0
        },
    },
    sumTicket: {
        type: Number,
        required: true
    }
})

const orderSchema = new Schema(
    {
        date: {
            type: Date,
            required: true
        },
        personalDetail: {
            firstName: {
                type: String,
                required: [true, 'firstName is required'],
                minlength: 3,
                maxlength: 50
            },
            lastName: {
                type: String,
                required: [true, 'lastName is required'],
                minlength: 3,
                maxlength: 50
            },
            email: {
                type: String,
                required: [true, 'email is required'],
            },
            role: {
                type: String,
                default: 'Designer',
            },
        },
        status: {
            type: String,
            enum: ['pending', 'paid'],
            default: 'pending'
        },
        totalPay: {
            type: Number,
            required: true
        },
        totalOrderTicket: {
            type: Number,
            required: true
        },
        orderItems: [orderDetailsSchema],
        participant: {
            type: mongoose.Types.ObjectId,
            ref: 'Participant',
            required: true
        },
        payment: {
            type: mongoose.Types.ObjectId,
            ref: 'Payment',
            required: true
        },
        event: {
            type: mongoose.Types.ObjectId,
            ref: 'Event',
            required: true
        },
        historyEvent: {
            title: {
                type: String,
                required: [true, 'Title is required'],
                minLength: [5, 'Title must be at least 5 characters'],
                maxLength: [50, 'Title must be at most 50 characters']
            },
            date: {
                type: Date,
                required: [true, 'Date is required']
            },
            about: {
                type: String,
            },
            tagline: {
                type: String,
                required: [true, 'Tag line is required'],
            },
            keyPoint: {
                type: [String],
            },
            venueName: {
                type: String,
                required: [true, 'Venue name is required'],
            },
            image: {
                type: mongoose.Types.ObjectId,
                ref: 'Image',
                required: true
            },
            category: {
                type: mongoose.Types.ObjectId,
                ref: 'Category',
                required: true
            },
            talent: {
                type: mongoose.Types.ObjectId,
                ref: 'Talent',
                required: true
            },
            organizer: {
                type: mongoose.Types.ObjectId,
                ref: 'Organizer',
                required: true
            }
        },
    },
    {
        timestamps: true
    }
)

module.exports = model('Orders', orderSchema)