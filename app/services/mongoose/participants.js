const Event = require('../../api/v1/events/model')
const Participant = require('../../api/v1/participants/model')
const Orders = require('../../api/v1/orders/model')
const Payment = require('../../api/v1/payments/model')
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

const checkoutOrder = async (req) => {
    const { event, personalDetail, payment, tickets } = req.body

    const checkingEvent = await Event.findOne({ _id: event })
    if (!checkingEvent) throw new NotFoundError('Event not found')

    const checkingPayment = await Payment.findOne({ _id: payment })

    if (!checkingPayment) throw new NotFoundError('Payment method not found')

    let totalPay = 0, totalOrderTicket = 0

    await tickets.forEach((tic) => {
        checkingEvent.tickets.forEach((ticket) => {
            if (tic.ticketCategories.type === ticket.type) {
                if (tic.sumTicket > ticket.stock) {
                    throw new BadRequestError('Tickets out of stock')
                } else {
                    ticket.stock -= tic.sumTicket

                    totalOrderTicket += tic.sumTicket
                    totalPay += tic.ticketCategories.price * tic.sumTicket
                }
            }
        })
    })

    await checkingEvent.save()

    const historyEvent = {
        title: checkingEvent.title,
        date: checkingEvent.date,
        about: checkingEvent.about,
        tagline: checkingEvent.tagline,
        keyPoint: checkingEvent.keyPoint,
        venueName: checkingEvent.venueName,
        tickets: tickets,
        image: checkingEvent.image,
        category: checkingEvent.category,
        talent: checkingEvent.talent,
        organizer: checkingEvent.organizer,
    }

    const result = new Orders({
        date: new Date(),
        personalDetail: personalDetail,
        totalPay,
        totalOrderTicket,
        orderItem: tickets,
        participant: req.participant.id,
        event,
        historyEvent,
        payment
    })

    await result.save()
    return result
}

module.exports = { signupParticipant, activateParticipant, signinParticipant, getAllEvents, getOneEvent, getAllOrders, checkoutOrder }