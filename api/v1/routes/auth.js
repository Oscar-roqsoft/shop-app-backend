const express = require('express')


const router= express.Router()


const { register,login , verificationEmailLink,sentVerificationCode,verifyEmailOTP,recoverPassword} = require('../handlers/auth')


router.route('/register').post(register)
router.route('/login').post(login)
router.route('/verify-email').get(verificationEmailLink)

router.route('/sendCode').post(sentVerificationCode)
router.route('/verifyCode').post(verifyEmailOTP)
router.route('/recoverPassword').post(recoverPassword)


// app.use(notFound)
module.exports = router