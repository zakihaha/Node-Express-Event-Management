const Categories = require('../../api/v1/categories/model')
const { BadRequestError, NotFoundError } = require('../../errors')

const getAllCategories = async (req) => {
    const result = await Categories.find({ organizer: req.user.organizer })
    return result
}

const createCategories = async (req) => {
    const { name } = req.body;

    const check = await Categories.findOne({ name, organizer: req.user.organizer })
    if (check) throw new BadRequestError('Category name must be unique')

    const result = await Categories.create({ name, organizer: req.user.organizer });
    return result
}

const getOneCategories = async (req) => {
    const { id } = req.params;
    const result = await Categories.findOne({ 
        _id: id,
        organizer: req.user.organizer
    })

    if (!result) throw new NotFoundError("Category not found")

    return result
}

const updateCategories = async (req) => {
    const { id } = req.params
    const { name } = req.body

    const check = await Categories.findOne({
        _id: { $ne: id },
        name,
        organizer: req.user.organizer,
    })

    if (check) throw new BadRequestError('Category name must be unique')

    const result = await Categories.findByIdAndUpdate(
        { _id: id },
        { name },
        { new: true, runValidators: true }
    )

    if (!result) throw new NotFoundError(`Category with id: ${id} not found`)

    return result
}

const deleteCategories = async (req) => {
    const { id } = req.params
    const result = await Categories.findOne({ 
        _id: id,
        organizer: req.user.organizer
    })

    if (!result) throw new NotFoundError(`Category with id: ${id} not found`)

    await result.remove()

    return result
}

const checkingCategories = async (id) => {
    const result = await Categories.findOne({ 
        _id: id,
     })

    if (!result) throw new NotFoundError('Category not found')

    return result
}

module.exports = { getAllCategories, createCategories, getOneCategories, updateCategories, deleteCategories, checkingCategories }