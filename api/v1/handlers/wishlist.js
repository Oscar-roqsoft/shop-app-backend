const Wishlist = require('../models/wishlist');
const {sendConflictResponse,sendBadRequestResponse,
    sendUnauthenticatedErrorResponse,sendSuccessResponseData} = require('../responses')



const createWishlist =async(req,res)=>{
    try {
        const { userId, products } = req.body;
        const wishlist = new Wishlist({ userId, products });
        await wishlist.save();
        sendSuccessResponseData(res,'Created successfully', {wishlist})
    } catch (error) {
        sendUnauthenticatedErrorResponse(res,error.message)
    }
}


const getUsersWishlists = async(req,res)=>{
    try{
        const page = Number(req.query.pageNumber) || 1; // Use query parameters for pagination
        const limit = Number(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const wishlist = await Wishlist.findOne({ userId:  req.user.userId })
        .populate('products')
        .skip(skip)
        .limit(limit);

        if (!wishlist) {
            return sendBadRequestResponse(res,'Wishlist not found');
        }
        sendSuccessResponseData(res,'fetched successfully', {wishlist})
    }catch(e){
        sendUnauthenticatedErrorResponse(res,error.message)
    }

}


const addUsersWishlist = async(req,res)=>{
    try {
        const { productId } = req.body;

        const checkProductId  = await Wishlist.findOne({ productId: productId })

        if(checkProductId){
            return sendBadRequestResponse(res,'Product already added')
        }

        const wishlist = await Wishlist.findOneAndUpdate(
          { userId: req.user.userId },
          { $addToSet: { productId: productId } },
          { new: true, upsert: true }
        ).populate('products');
        
        sendSuccessResponseData(res,'Added successfully', {wishlist})
        // res.json(wishlist);
      } catch (error) {
        sendUnauthenticatedErrorResponse(res,error.message)
      }
}

const deleteUserWishlist = async(req,res)=>{
    try {
        const { productId } = req.params;
        const wishlist = await Wishlist.findOneAndUpdate(
          { userId: req.user.userId },
          { $pull: { productId: productId } }, //that $pull acting as findOneAndDelete
          { new: true }
        ).populate('products');
        if (!wishlist) {
            return sendBadRequestResponse(res,'Wishlist not found');
        }
        sendSuccessResponseData(res,'Deleted successfully', {wishlist})
      } catch (error) {
        sendUnauthenticatedErrorResponse(res,error.message)
      }
}


module.exports ={
    createWishlist,
    getUsersWishlists,
    addUsersWishlist,
    deleteUserWishlist

}