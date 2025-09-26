const Notifications=require("../models/Notifications");
const mongoose=require("mongoose")
const {getIO}=require("../utils/socket")

const createNotification=async(req,res)=>{
const user=req.user;
const {message}=req.body;
console.log("hello");
try {
    if (user) {
        console.log(user);
        let userId=user._id;
        
let newNotification=await Notifications.create({message,userId});


req.app.get('io').emit('new-booking',newNotification)
res.status(200).json(newNotification)

        
    }else{
        res.status(401).json({msg:"User not authorized"})
    }
} catch (error) {
    console.log(error);
    res.status(500).json({msg:"Server error"})
}
}
const readNotification=async(req,res)=>{
const user=req.user;
try {
    const id=req.params.id;
    if (user) {
        const notification=await Notifications.findById(id);
        if (!notification) {
            res.status(404).json({msg:"Item not found"})
        }else{
            notification.read=true;
            await notification.save();
            res.status(200).json({msg:"Notification marked as read notification "})
        }
    }else{
        res.status(401).json({msg:"User not authorized"})
    }
} catch (error) {
    res.status(500).json({msg:"Server error"})
}
}
const getNotifications=async(req,res)=>{
const user=req.user;
try {


    if (user) {
        let userId=user._id;

let limit = parseInt(req.query.limit) || 5;
let cursor=req.query.cursor
const query={userId};
if(cursor){
    query.userId={$lt:cursor}
}
let notifications=await Notifications.find(query).sort({_id:-1}).limit(limit+1).populate("lot").populate("auction");
let hasMore=notifications.length>limit;
const data=hasMore? notifications.slice(0,limit): notifications;
let nextCursor=hasMore?data[data.length-1]._id:null;
let unreadCount=await Notifications.find({userId,read:false}).countDocuments()
console.log(unreadCount);
res.status(200).json({
    data,
    nextCursor,
    unreadCount
})
    }else{
        res.status(401).json({msg:"User not authorized"})
    }
} catch (error) {
    console.log(error);
    res.status(500).json({msg:"Server error"})
}
}
const deleteNotifications=async(req,res)=>{
    const id=req.params.id;
    try {
     const deleteNotification=   await Notifications.findByIdAndDelete(id)
     res.status(200).json({msg:"Notification Deleted"})
    } catch (error) {
     res.status(500).json({msg:"Server error"})   
    }
}

const markAllAsRead=async(req,res)=>{
    try {
        let user=req.user;
        let userId=user._id;
        if (user) {
await Notifications.updateMany({userId,read:false},{$set:{read:true}}) 
res.status(200).json({message:"All Notifications marked as read"})
           
        }
    } catch (error) {
        res.status(500).json({msg:"Server Error"})
    }
}

module.exports={createNotification,readNotification,getNotifications,deleteNotifications,markAllAsRead}