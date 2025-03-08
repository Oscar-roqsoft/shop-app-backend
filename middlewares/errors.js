const {CustomApiError } = require('../errors/custom-errors')



const errorHandlers = (err,req,res,next)=>{
    if(err instanceof CustomApiError){
        return  res.status(err.statusCode).json({msg:err.message})
    }
    return res.status(err.status).json({msg:err.message})
}

module.exports = errorHandlers