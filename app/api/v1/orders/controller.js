const { StatusCodes } = require('http-status-codes')
const { getAllOrders } = require("../../../services/mongoose/orders")

const index = async (req, res) => {
    try {
        const result = await getAllOrders(req)

        res.status(StatusCodes.OK).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

module.exports = { index }