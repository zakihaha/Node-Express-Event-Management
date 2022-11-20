const express = require('express')
const router = express.Router()

const { authenticateParticipant } = require('../../../middlewares/auth')
const { signup, activate, signin, getAllLandingPage, getDetailLandingPage, getDashboard } = require('./controller')

router.post('/auth/signup', signup)
router.put('/activate', activate)
router.post('/auth/signin', signin)
router.get('/events', getAllLandingPage)
router.get('/events/:id', getDetailLandingPage)
router.get('/orders', authenticateParticipant, getDashboard)

module.exports = router