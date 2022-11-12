const mongoose = require('mongoose');
const { model, Schema } = mongoose;
const bcrypt = require('bcryptjs')

let userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            minlength: [3, 'Name must be at least 3 characters'],
            maxlength: [50, 'Name must be at most 50 characters'],
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'Email is required']
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minLength: 6
        },
        role: {
            type: String,
            enum: ['admin', 'organizer', 'owner'],
            default: 'admin'
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

userSchema.pre('save', async function (next) {
    const User = this
    if (User.isModified('password')) {
        User.password = await bcrypt.hash(User.password, 12)
    }

    next()
})

userSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

module.exports = model('User', userSchema);