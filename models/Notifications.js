const mongoose=require("mongoose");

const NotificationModel=new mongoose.Schema({
message:{
    type:String,
    required:true
},
userId:{
    type:String,
},
read:{
    type:Boolean,
    default:false
},
lot:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"lot",
    default:null
},
auction:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"auction",
    default:null
},
invoice:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"invoice",
    default:null
},
messageId:{
type:String
}
},
{
    timestamps:true
}
)


const Notification= mongoose.model("notification",NotificationModel);

module.exports=Notification;
