const mongoose= require('mongoose');


const DeveloperSchema=mongoose.Schema({
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
       default:"Exec"
    }
    


});

const Developer= mongoose.model('developer',DeveloperSchema);

module.exports=Developer