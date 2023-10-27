const express = require('express')
const router = express.Router()
const ToughtController = require('../controller/ToughtController')

router.get('/', ToughtController.showToughts)

module.exports = router