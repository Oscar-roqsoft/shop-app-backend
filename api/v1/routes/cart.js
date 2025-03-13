const express = require('express')

const { verifyToken } = require('../../../middlewares/authentication')

const router= express.Router()


const { addtoCart,removeFromCart ,updateCart,getUserCart} = require('../handlers/cart')


router.route('/').get(verifyToken,getUserCart)
router.route('/').post(verifyToken,addtoCart)

router.route('/:productId').delete(verifyToken,removeFromCart)
router.route('/:productId').put(verifyToken,updateCart)


// app.use(notFound)
module.exports = router