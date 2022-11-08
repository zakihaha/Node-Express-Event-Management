const express = require('express')
const router = express.Router()
const { index, create, find, update, changeStatus, destroy } = require('./controller')

router.get('/events', index)
router.post('/events', create)
router.get('/events/:id', find)
router.put('/events/:id', update)
router.put('/events/:id/status', changeStatus)
router.delete('/events/:id', destroy)

module.exports = router