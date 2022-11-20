const { UnauthenticatedError, UnauthorizedError } = require("../errors")
const { isTokenValid } = require("../utils")

const authenticateUser = async (req, res, next) => {
    try {
        let token

        const authHeader = req.headers.authorization

        if (authHeader && authHeader.startsWith('Bearer')) {
            token = authHeader.split(' ')[1]
        }

        if (!token) {
            throw new UnauthenticatedError('Authentication invalid')
        }

        const payload = isTokenValid({ token })

        req.user = {
            id: payload.userId,
            email: payload.email,
            name: payload.name,
            organizer: payload.organizer,
            role: payload.role,
        }

        next()
    } catch (error) {
        next(error)
    }
}

const authenticateParticipant = async (req, res, next) => {
    try {
        let token

        const authHeader = req.headers.authorization

        if (authHeader && authHeader.startsWith('Bearer')) {
            token = authHeader.split(' ')[1]
        }

        if (!token) {
            throw new UnauthenticatedError('Authentication invalid')
        }

        const payload = isTokenValid({ token })

        req.user = {
            id: payload.participantId,
            firstName: payload.firstName,
            lastame: payload.lastame,
            email: payload.email,
        }

        next()
    } catch (error) {
        next(error)
    }
}


const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) throw new UnauthorizedError('Unauthorized to access this route')
        next()
    }
}

module.exports = { authenticateUser, authenticateParticipant, authorizeRoles }