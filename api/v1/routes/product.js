const express = require('express')
const { verifyToken,authorizePermissions } = require('../../../middlewares/authentication')


const router= express.Router()


const { createProduct} = require('../handlers/product')


router.route('/create').post([verifyToken,authorizePermissions('admin')],createProduct)


// app.use(notFound)
module.exports = router