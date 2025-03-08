const express = require('express')


const router= express.Router()


const { register,login , verificationEmailLink} = require('../handlers/auth')


router.route('/register').post(register)
router.route('/login').post(login)
router.route('/verify-email').get(verificationEmailLink)



// app.use(notFound)
module.exports = router