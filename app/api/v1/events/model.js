const mongoose = require('mongoose')
const { model, Schema } = mongoose

const ticketCategoriesSchema = Schema({
    type: {
        type: String,
        required: [true, 'Type is required']
    },
    price: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 0
    },
    statusTicketCategories: {
        type: Boolean,
        default: false
    },
    expired: {
        type: Date,
    }
})

const EventSchema = Schema({
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
    statusEvent: {
        type: String,
        enum: ['Draft', 'Published', 'Canceled'],
        default: 'Draft'
    },
    tickets: {
        type: [ticketCategoriesSchema],
        required: true,
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
})

module.exports = model('Event', EventSchema)