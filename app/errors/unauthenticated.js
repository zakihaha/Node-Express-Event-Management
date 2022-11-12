const { StatusCodes } = require('http-status-codes')
const customAPIError = require('./custom-api-error')

class Unauthorized extends customAPIError {
    constructor(message) {
        super(message)
        
        this.StatusCode = StatusCodes.UNAUTHORIZED
    }
}

module.exports = Unauthorized