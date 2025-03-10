const express = require('express')
const { verifyToken ,authorizePermissions} = require('../../../middlewares/authentication')


const router= express.Router()


const { createCategory } = require('../handlers/category')


router.route('/create').post([verifyToken,authorizePermissions('admin')],createCategory)


// app.use(notFound)
module.exports = router