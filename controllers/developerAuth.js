const {GeneratePassword, ValidatePassword, generateSignature,GenerateSalt}= require("../utils/index");

const Developer=require("../models/Developer")


const DeveloperSignup=async(req,res)=>{

  
    const {email,phone,password,name,surname}=req.body;

    try {
        const salt= await GenerateSalt()

        const existingDeveloper= await Developer.findOne({email});
        const userPassword= await GeneratePassword(password,salt)
        if (existingDeveloper) {
            res.status(401).json({
                msg:"Email already in use"
            })
        }
        else if(!existingDeveloper){
            const newDeveloper= await Developer.create({
               name,surname,email,password:userPassword,phone,salt
            });
            if (newDeveloper) {
              const signature=await generateSignature({
                _id:newDeveloper._id,
                email:newDeveloper.email,
                phone:newDeveloper.phone,
                role:newDeveloper.role
    
              })  
              res.status(201).json({
             signature,email:newDeveloper.email,phone:newDeveloper.phone,surname:newDeveloper.surname,name:newDeveloper.name,role:newDeveloper.role})
               
    
            }
    
        }
        
    } catch (error) {
        res.status(500).json({msg:"server error"})
    }


    
      

    

}
const DeveloperLogin=async(req,res)=>{
   const {email,password}= req.body;
   const existingDeveloper=await Developer.findOne({email:email});
try {
    if (!existingDeveloper) {
        res.status(401).json({msg:"User does not exist please sign up"})
       } else {
        const response=await ValidatePassword(password,existingDeveloper.password,existingDeveloper)
        if (response==="wrong details") {
            res.status(401).json({
                msg:"Wrong email or password"
            })
                }
                else{
                    const signature=await generateSignature({
                        _id:existingDeveloper._id,
                        email:existingDeveloper.email,
                        phone:existingDeveloper.phone,
                        isAdmin:existingDeveloper.isAdmin,
                        role:existingDeveloper.role
                    })
                    res.status(201).json({
                     
                   
                        signature:signature,
                        _id:existingDeveloper._id,
                        email:existingDeveloper.email,
                        phone:existingDeveloper.phone,
                        name:existingDeveloper.name,
                        surname:existingDeveloper.surname,
                        role:existingDeveloper.role
                    })
                }
       }
} catch (error) {
    console.log(error);
    res.status(500).json({msg:"Server error"})
}

   
  
}

module.exports={DeveloperLogin,DeveloperSignup}