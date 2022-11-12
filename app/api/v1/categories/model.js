const mongoose = require('mongoose');
const { model, Schema } = mongoose;

let categorySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            minlength: [3, 'Name must be at least 3 characters'],
            maxlength: [20, 'Name must be at most 20 characters'],
        },
        organizer: {
            type: mongoose.Types.ObjectId,
            ref: 'Organizer',
            required: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = model('Category', categorySchema);