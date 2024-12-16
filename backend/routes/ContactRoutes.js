var express = require('express');
var router = express.Router();
var ContactController = require('../controllers/ContactController.js');

router.post('/', ContactController.forward)

module.exports = router;