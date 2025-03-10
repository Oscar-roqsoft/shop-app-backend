const express = require('express')


const router= express.Router()


const { login } = require('../handlers/admin')


router.route('/login').post(login)


// app.use(notFound)
module.exports = router