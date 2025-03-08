const asyncwrapper = (fn)=>{
    return async(req,res,next)=>{

        try{
            fn(req,res,next)
        }catch(e){
            next(e)
        }
       
    }

}

module.exports = asyncwrapper