const express = require('express');
const router = express.Router()
const { authenticateUser, authorizeRoles } = require('../../../middlewares/auth');
const { createCMSOrganizer, createCMSUser, getCMSUsers } = require('./controller');

router.get('/users', authenticateUser, authorizeRoles('owner'), getCMSUsers);

router.post('/users', authenticateUser, authorizeRoles('organizer'), createCMSUser);
router.post('/organizers', authenticateUser, authorizeRoles('owner'), createCMSOrganizer);

module.exports = router