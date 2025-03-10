const express = require('express')
const { verifyToken,authorizePermissions } = require('../../../middlewares/authentication')


const router= express.Router()


const { createProduct,getAllProducts} = require('../handlers/product')

router.route('/create').post([verifyToken,authorizePermissions('admin')],createProduct)

router.route('/all/:pageNumber').get(getAllProducts)

// app.use(notFound)
module.exports = router