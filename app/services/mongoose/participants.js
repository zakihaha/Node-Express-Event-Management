const Event = require('../../api/v1/events/model')
const Participant = require('../../api/v1/participants/model')
const Orders = require('../../api/v1/orders/model')
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../../errors')
const { createJWT, createTokenParticipant } = require('../../utils')
const otpMail = require('../mail')

const signupParticipant = async (req) => {
    const { firstName, lastName, email, password, role } = req.body

    let result = await Participant.findOne({
        email,
        status: 'not active'
    })

    if (result) {
        result.firstName = firstName
        result.lastName = lastName
        result.role = role
        result.email = email
        result.password = password
        result.otp = Math.floor(Math.random() * 9999)
        await result.save()
    } else {
        result = await Participant.create({
            firstName,
            lastName,
            email,
            password,
            role,
            otp: Math.floor(Math.random() * 9999)
        })
    }

    await otpMail(email, result)

    delete result._doc.password
    delete result._doc.otp

    return result
}

const activateParticipant = async (req) => {
    const { otp, email } = req.body
    const participant = await Participant.findOne({
        email
    })

    if (!participant) throw new NotFoundError("Participant is not registered")

    if (participant && participant.otp !== otp) throw new BadRequestError("OTP is not valid")

    participant.status = "active"
    await participant.save()

    delete participant._doc.password
    delete participant._doc.otp

    return participant
}

const signinParticipant = async (req) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }

    const result = await Participant.findOne({ email })

    if (!result) throw new UnauthorizedError('Invalid credentials')

    if (result.status === 'not active') throw new UnauthorizedError('Your account is not activate')

    const isPasswordCorrect = await result.comparePassword(password)

    if (!isPasswordCorrect) throw new UnauthorizedError('Invalid credentials')

    const token = createJWT({ payload: createTokenParticipant(result) })

    return token
}

const getAllEvents = async (req) => {
    const result = await Event.find({ statusEvent: 'Published' })
        .populate('category')
        .populate('image')
        .select('_id title date tickets venueName')

    return result
}

const getOneEvent = async (req) => {
    const result = await Event.findOne({ statusEvent: 'Published', _id: req.params.id })
        .populate('category')
        .populate('talent')
        .populate('image')
        .select('_id title date tickets venueName')

    if (!result) throw new NotFoundError('Event not found')

    return result
}

const getAllOrders = async (req) => {
    const result = await Orders.find({ participant: req.participant.id })
    return result
}

module.exports = { signupParticipant, activateParticipant, signinParticipant, getAllEvents, getOneEvent, getAllOrders }