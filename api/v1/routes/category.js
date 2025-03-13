const express = require('express')
const { verifyToken ,authorizePermissions} = require('../../../middlewares/authentication')


const router= express.Router()


const { createCategory,getAllCategory } = require('../handlers/category')


router.route('/create').post([verifyToken,authorizePermissions('admin')],createCategory)
router.route('/all').get(getAllCategory)


// app.use(notFound)
module.exports = router