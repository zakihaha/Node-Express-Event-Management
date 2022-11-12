const User = require('../../api/v1/users/model')
const Organizer = require('../../api/v1/organizers/model')
const { BadRequestError } = require('../../errors')

const createOrganizer = async (req) => {
    const { organizer, name, email, password, passwordConfirmation, role } = req.body

    if (password !== passwordConfirmation) throw new BadRequestError("Password doesn't match")

    const result = await Organizer.create({ organizer })

    const users = await User.create({
        name,
        email,
        password,
        role,
        organizer: result._id
    })

    delete users._doc.password;

    return users
}

const createUser = async (req) => {
    const { name, email, password, role, passwordConfirmation } = req.body

    if (password !== passwordConfirmation) throw new BadRequestError("Password doesn't match")

    const result = await User.create({
        name,
        email,
        password,
        role,
        organizer: req.user.organizer
    })

    return result
}

module.exports = { createOrganizer, createUser }