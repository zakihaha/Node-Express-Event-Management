const express = require('express');
const router = express.Router()
const { authenticateUser } = require('../../../middlewares/auth');
const { createCMSOrganizer, createCMSUser } = require('./controller');

router.post('/organizers', createCMSOrganizer);
router.post('/users', authenticateUser, createCMSUser);

module.exports = router