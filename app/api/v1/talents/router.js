const express = require('express')
const router = express.Router()
const { index, find, update, destroy, create } = require('./controller')

router.get('/talents', index)
router.get('/talents/:id', find)
router.put('/talents/:id', update)
router.delete('/talents/:id', destroy)
router.post('/talents', create)

module.exports = router