const express = require('express')

const router = express.Router()

const {handleNewUser} = require('../controllers/registerUserControllers')

router.post('/', handleNewUser)

module.exports = router