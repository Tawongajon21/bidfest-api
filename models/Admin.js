const mongoose= require('mongoose');


const AdminSchema=mongoose.Schema({
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
       default:"Admin"
    }
    


});

const Admin= mongoose.model('admin',AdminSchema);

module.exports=Admin