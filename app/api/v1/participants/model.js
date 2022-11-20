const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const bcrypt = require('bcryptjs')

const participantSchema = new Schema(
    {
        firstName: {
            type: String,
            required: [true, 'firstName is required'],
            minlength: 3,
            maxlength: 50
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'Email is required']
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6
        },
        role: {
            type: String,
            default: "-"
        },
        status: {
            type: String,
            enum: ['active', 'not active'],
            default: 'not active'
        },
        otp: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

participantSchema.pre('save', async function (next) {
    const User = this
    if (User.isModified('password')) {
        User.password = await bcrypt.hash(User.password, 12)
    }
    next()
})

participantSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

module.exports = model('Participant', participantSchema)