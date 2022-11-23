const Payment = require('../../api/v1/payments/model')
const { BadRequestError, NotFoundError } = require('../../errors')
const { checkingImage } = require('./images')

const getAllPayments = async (req) => {
    let condition = { organizer: req.user.organizer }

    const result = await Payment.find(condition)
        .populate({
            path: 'image',
            select: '_id name'
        })
        .select('_id type status image')

    return result
}

const createPayment = async (req) => {
    const { type, image } = req.body

    await checkingImage(image)

    const check = await Payment.findOne({ type, organizer: req.user.organizer })

    if (check) throw new BadRequestError('Payment method must be unique')

    const result = await Payment.create({
        image,
        type,
        organizer: req.user.organizer
    })

    return result
}

const getOnePayment = async (req) => {
    const { id } = req.params

    const result = await Payment.findOne({
        _id: id,
        organizer: req.user.organizer
    })
        .populate({
            path: 'image',
            select: '_id name'
        })
        .select('_id type status image')

    if (!result) throw new NotFoundError('Payment method not found')

    return result
}

const updatePayment = async (req) => {
    const { id } = req.params
    const { type, image } = req.body

    await checkingImage(image)

    const check = await Payment.findOne({
        type,
        organizer: req.user.organizer,
        _id: { $ne: id }
    })

    if (check) throw new NotFoundError('Payment method must be unique')

    const result = await Payment.findOneAndUpdate(
        { _id: id },
        { type, image, organizer: req.user.organizer },
        { new: true, runValidators: true }
    )

    if (!result) throw new NotFoundError('Payment method not found')

    return result
}

const deletePayment = async (req) => {
    const { id } = req.params

    const result = await Payment.findOne({
        _id: id,
        organizer: req.user.organizer
    })

    if (!result) throw new NotFoundError('Payment method not found')

    await result.remove()

    return result
}

const checkingPayments = async (id) => {
    const result = await Payment.findOne({ _id: id })

    if (!result) throw new NotFoundError('Payment method not found')

    return result
}

module.exports = {
    getAllPayments,
    createPayment,
    getOnePayment,
    updatePayment,
    deletePayment,
    checkingPayments
}