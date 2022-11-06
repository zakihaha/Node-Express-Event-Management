const Talents = require('../../api/v1/talents/model')
const { BadRequestError, NotFoundError } = require('../../errors')
const { checkingImage } = require('./images')

const getAllTalents = async (req) => {
    const { keyword } = req.query

    let condition = {}

    if (keyword) {
        condition = { ...condition, name: { $regex: keyword, $options: 'i' } }
    }

    const result = await Talents.find(condition)
        .populate({
            path: 'image',
            select: '_id name'
        })
        .select('_id name role image')

    return result
}

const createTalents = async (req) => {
    const { name, role, image } = req.body

    await checkingImage(image)

    const check = await Talents.findOne({ name })
    if (check) throw new BadRequestError('Name must be unique')

    const result = await Talents.create({ name, image, role })
    return result
}

const getOneTalents = async (req) => {
    const { id } = req.params

    const result = await Talents.findOne({ _id: id })
        .populate({
            path: 'image',
            select: '_id name'
        })
        .select('_id name role image')

    if (!result) throw new NotFoundError('Talents not found')

    return result
}

const updateTalents = async (req) => {
    const { id } = req.params
    const { name, image, role } = req.body

    await checkingImage(image)

    const check = await Talents.findOne({
        name,
        _id: { $ne: id }
    })

    if (check) throw new BadRequestError('Name must be unique')

    const result = await Talents.findOneAndUpdate(
        { _id: id },
        { name, image, role },
        { new: true, runValidators: true }
    )

    if (!result) throw new NotFoundError('Talents not found')

    return result
}

const deleteTalents = async (req) => {
    const { id } = req.params

    const result = await Talents.findOne({
        _id: id
    })

    if (!result) throw new NotFoundError('Talents not found')

    await result.remove()

    return result
}

const checkingTalents = async (req) => {
    const result = await Talents.findOne({ _id: id })

    if (!result) throw new NotFoundError('Talents not found')

    return result
}

module.exports = { getAllTalents, createTalents, getOneTalents, updateTalents, deleteTalents, checkingTalents }