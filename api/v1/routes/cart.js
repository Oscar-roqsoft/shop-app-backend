const express = require('express')
const { verifyToken } = require('../../../middlewares/authentication')


const router= express.Router()


const { addtoCart,removeFromCart } = require('../handlers/cart')


router.route('/add').post(verifyToken,addtoCart)

router.route('/remove').post(verifyToken,removeFromCart)


// app.use(notFound)
module.exports = router