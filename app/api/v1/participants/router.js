const express = require('express')
const router = express.Router()

const { signup, activate, signin } = require('./controller')

router.post('/auth/signup', signup)
router.put('/activate', activate)
router.post('/auth/signin', signin)

module.exports = router