const { signupParticipant, activateParticipant, signinParticipant } = require("../../../services/mongoose/participants");
const { StatusCodes } = require("http-status-codes");

const signup = async (req, res, next) => {
    try {
        const result = await signupParticipant(req)

        res.status(StatusCodes.CREATED).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const activate = async (req, res, next) => {
    try {
        const result = await activateParticipant(req)

        res.status(StatusCodes.OK).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const signin = async (req, res, next) => {
    try {
        const result = await signinParticipant(req)

        res.status(StatusCodes.OK).json({
            data: { token: result }
        })
    } catch (error) {
        next(error)
    }
}

module.exports = { signup, activate, signin }