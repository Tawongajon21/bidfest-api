


const {GeneratePassword, ValidatePassword, generateSignature,GenerateSalt}= require("../utils/index");
const User = require('../models/User');
const Admin=require("../models/Admin");
const Developer=require("../models/Developer");



const UserSignup=async(req,res)=>{

  
    const {email,phone,password,name,surname}=req.body;

    try {
        const salt= await GenerateSalt()

        const existingUser= await User.findOne({email});
        const userPassword= await GeneratePassword(password,salt)
        if (existingUser) {
            res.status(401).json({
                msg:"Email already in use"
            })
        }
        else if(!existingUser){
            const newUser= await User.create({
               name,surname,email,password:userPassword,phone,salt
            });
            if (newUser) {
              const signature=await generateSignature({
                _id:newUser._id,
                email:newUser.email,
                phone:newUser.phone,
                isAdmin:newUser.isAdmin,
                name:newUser.name,
                surname:newUser.surname

    
              })  
              res.status(201).json({
             signature,email:newUser.email,phone:newUser.phone,surname:newUser.surname,name:newUser.name})
               
    
            }
    
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"server error"})
    }


    
      

    

}
const UserLogin=async(req,res)=>{
   const {email,password}= req.body;
   const existingUser=await User.findOne({email:email});
try {
    if (!existingUser) {
        res.status(401).json({msg:"User does not exist please sign up"})
       } else {
        const response=await ValidatePassword(password,existingUser.password,existingUser)
        if (response==="wrong details") {
            res.status(401).json({
                msg:"Wrong email or password"
            })
                }
                else{
                    const signature=await generateSignature({
                        _id:existingUser._id,
                        email:existingUser.email,
                        phone:existingUser.phone,
                        isAdmin:existingUser.isAdmin,
                        name:existingUser.name,
                        surname:existingUser.surname
                    })
                    res.status(201).json({
                     
                   
                        signature:signature,
                        _id:existingUser._id,
                        email:existingUser.email,
                        phone:existingUser.phone,
                        name:existingUser.name,
                        surname:existingUser.surname
                    })
                }
       }
} catch (error) {
    res.status(500).json({msg:"Server error"})
}

   
  
}
const AdminSignup=async(req,res)=>{
let user=req.user;
//let role=user.role
  console.log(user);
    const {email,phone,password,name,surname}=req.body;

    try {
        const salt= await GenerateSalt()

        const existingAdmin= await Admin.findOne({email});
        const adminPassword= await GeneratePassword(password,salt)
        if (existingAdmin) {
            res.status(401).json({
                msg:"Email already in use"
            })
        }


        else if(!existingAdmin ){
           
            const newAdmin= await Admin.create({
              name,surname,phone,email,password:adminPassword,salt
            });
            if (newAdmin) {
              const signature=await generateSignature({
                _id:newAdmin._id,
                email:newAdmin.email,
                phone:newAdmin.phone,
                role:newAdmin.role
    
              })  

            
              res.status(201).json({
             signature,email:newAdmin.email,phone:newAdmin.phone,surname:newAdmin.surname,name:newAdmin.name,role:newAdmin.role})
               
    
            }
    
        }
        
    } catch (error) {

        res.status(500).json({msg:"server error"})
    }


    
      

    

}
const AdminLogin=async(req,res)=>{
   const {email,password}= req.body;
   const existingAdmin=await Admin.findOne({email:email});
  
try {
    if (!existingAdmin) {
        res.status(401).json({msg:"Admin does not exist please sign up"})
       } else {
        const response=await ValidatePassword(password,existingAdmin.password,existingAdmin)
        if (response==="wrong details") {
            res.status(401).json({
                msg:"Wrong email or password"
            })
                }
                else{
                    const signature=await generateSignature({
                        _id:existingAdmin._id,
                        email:existingAdmin.email,
                        phone:existingAdmin.phone,
                        role:existingAdmin.role,
                        company:existingAdmin.company
                    })
                    res.status(201).json({
                     
                   
                        signature:signature,
                        _id:existingAdmin._id,
                        email:existingAdmin.email,
                        phone:existingAdmin.phone,
                        name:existingAdmin.name,
                        surname:existingAdmin.surname,
                        role:existingAdmin.role,
                        company:existingAdmin.company
                    })
                }
       }
} catch (error) {
  
    res.status(500).json({msg:"Server error"})
}

   
  
}
const getUsers=async(req,res)=>{
    try {

   let getAdmins=await Admin.find().select('email role');
   let getDevelopers=await Developer.find().select('email role');
 

   let users=[...getAdmins,...getDevelopers]
   res.status(200).json(users);


    } catch (error) {
    console.log(error);
        res.status(500).json({msg:"Server error"})
    }
}
const getCompanyUsers=async(req,res)=>{
    try {

   let getAdmins=await Admin.find().select('name surname email phone role');
   let getDevelopers=await Developer.find().select('name surname email phone role');
   let getUsers=await User.find().select('name surname email phone role');
 

   let users=[...getAdmins,...getDevelopers,...getUsers]
   res.status(200).json(users);


    } catch (error) {
    console.log(error);
        res.status(500).json({msg:"Server error"})
    }
}
const getAdmins=async(req,res)=>{
    let user=req.user;
 let role=user.role
  
    try {
        if (user) {
            if (role==="Exec") {

                const admins=await Admin.find().select("name surname email role phone");
                res.status(200).json(admins)
            }else{
                res.status(401).json({msg:"User not authorized"})
            }
         
        } else {
            res.status(401).json({msg:"User not authorized"})
        }

    } catch (error) {
        res.status(500).json({msg:"server error"})
    }
}
const getAdmin=async(req,res)=>{
    let user=req.user;
    let userId=user._id;
    let role=user.role
  let id=req.params.id
    try {
        if (user) {
            if (role==="Exec") {

                const admin=await Admin.findById(id).select("name surname email role phone");
                res.status(200).json(admin)
            }else{
                res.status(401).json({msg:"User not authorized"})
            }
         
        } else {
            res.status(401).json({msg:"User not authorized"})
        }

    } catch (error) {
        res.status(500).json({msg:"server error"})
    }
}
const updateAdmin=async(req,res)=>{
    let user=req.user;
  
    let role=user.role
  let id=req.params.id
    try {
        if (user) {
            if (role==="Exec") {

                const admin=await Admin.findByIdAndUpdate(id,{$set:req.body},{new:true});
                res.status(200).json(admin)
            }else{
                res.status(401).json({msg:"User not authorized"})
            }
         
        } else {
            res.status(401).json({msg:"User not authorized"})
        }

    } catch (error) {
        res.status(500).json({msg:"server error"})
    }
}
const deleteAdmin=async(req,res)=>{
    let user=req.user;
    let userId=user._id;
    let role=user.role
  let id=req.params.id
    try {
        if (user) {
            if (role==="Exec") {

                const admin=await Admin.findByIdAndDelete(id);
                res.status(200).json({msg:"Item deleted successfully"})
            }else{
                res.status(401).json({msg:"User not authorized"})
            }
         
        } else {
            res.status(401).json({msg:"User not authorized"})
        }

    } catch (error) {
        res.status(500).json({msg:"server error"})
    }
}



module.exports={
    UserSignup,UserLogin,AdminLogin,AdminSignup,getUsers,getAdmins,getAdmin,updateAdmin,deleteAdmin,getCompanyUsers
}
