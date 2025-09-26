
const { validateSignature } = require('../utils');

const isAuth =async(req,res,next)=> {
    
    const isAuthorized = await validateSignature(req);
console.log(isAuthorized)
    if(isAuthorized){
        return next();
    }
    return res.status(403).json({message: 'Not Authorized'})
}
module.exports= isAuth;