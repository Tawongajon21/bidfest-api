const bcryptjs = require('bcryptjs');
const jwt= require('jsonwebtoken');

 const GenerateSalt=async()=>{
    return await bcryptjs.genSalt()
}

 const GeneratePassword=async(password,salt)=>{
    return await bcryptjs.hash(password,salt)
}

const generateSignature=async(payload)=>{
    const signature=jwt.sign(payload,process.env.APP_SECRET,{
    expiresIn:'30d'
    })
    
    return signature
    }
   


const validateSignature=async(req)=>{
const signature= req.get('Authorization')



if (signature) {
    const payload=  jwt.verify(signature.split(' ')[1],process.env.APP_SECRET);
    req.user= payload
    return true
}

    return false
}
const ValidatePassword=async(enteredPassword,savedPassword,newUser)=>{
  console.log(enteredPassword,savedPassword,newUser);
 if (bcryptjs.compareSync(enteredPassword,savedPassword)) {
 const signature=generateSignature({
  _id:newUser._id,
  email:newUser.email,
  phone:newUser.phone,
  isAdmin:newUser.isAdmin,
 })
return await signature
 }
 else{
    let err="wrong details"
return err
 }
  
    
}

function formatDate(tempDate) {
    const date= new Date(tempDate);
const formattedDate=date.toLocaleDateString('en-US',{
    weekday:"long",
    year:"numeric",
    month:"long",
    day:"numeric"
});
return formattedDate
}


module.exports={
    GeneratePassword,
    GenerateSalt,
    ValidatePassword,
    generateSignature,
    validateSignature,
    formatDate
    
  
}