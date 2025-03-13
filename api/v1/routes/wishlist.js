const express = require('express')
const { verifyToken,authorizePermissions } = require('../../../middlewares/authentication')


const router= express.Router()


const {getUsersWishlists,addUsersWishlist,deleteUserWishlist } = require('../handlers/wishlist')

router.route('/').post(verifyToken,addUsersWishlist)
router.route('/').get(verifyToken,getUsersWishlists)
router.route('/:productId').delete(verifyToken,deleteUserWishlist)

// router.route('/all/:pageNumber').get(getAllProducts)
// app.use(notFound)

module.exports = router