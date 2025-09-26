const mongoose= require('mongoose');


const UserSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    surname:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    salt:{
        type:String,
        required:true
    },
    role:{
        type:String,
       default:"User"
    }
    


});

const User= mongoose.model('user',UserSchema);

module.exports=User