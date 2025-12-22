const express = require('express');
const router = express.Router();
const scholarController = require('../controllers/scholarController');

router.post('/sync', scholarController.syncScholarData);

module.exports = router;
