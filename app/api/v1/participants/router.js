const express = require('express')
const router = express.Router()

const { signup, activate, signin, getAllLandingPage, getDetailLandingPage } = require('./controller')

router.post('/auth/signup', signup)
router.put('/activate', activate)
router.post('/auth/signin', signin)
router.get('/events', getAllLandingPage)
router.get('/events/:id', getDetailLandingPage)

module.exports = router