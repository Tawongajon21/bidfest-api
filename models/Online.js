const mongoose=require("mongoose");

const OnlineUserSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"user",unique:true},
    socketId:String,
    connectedAt:{
        type:Date,
        default:Date.now()
    }
})

const OnlineUser= mongoose.model('onlineUser',OnlineUserSchema);

module.exports=OnlineUser
