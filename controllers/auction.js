const Auction =require("../models/Auction");
const Lot =require("../models/Lot");
const Notification =require("../models/Notifications");
const AuctionNumberGenerator= require("../utils/auctionNumberGenerator")
const OnlineUsers=require("../models/Online")
const User=require("../models/User")
const generator=new AuctionNumberGenerator();
const sharp=require("sharp")
const {getIO}=require("../utils/socket")


const fs=require('fs')
const createAuction=async(req,res)=>{
   
const { name,type,location,openTime,closeTime,startDateTime} =req.body;
const user=req.user;
let io=getIO()


try {
    if (user) {
        if (user.role==="Exec" || "Admin") {

            let now=new Date();
            function fixDate(date,time) {
                let datetime=new Date(`${date}T${time}:00`);
                let days =["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
                let months=["January","February","March","April","May","June","July","August","September","October","November","December"];
                let dayOfWeek=days[datetime.getDay()];
                let dayOfMonth=datetime.getDate().toString().padStart(2,"0");
                let month=months[datetime.getMonth()];
                let year=datetime.getFullYear();
                let hours=datetime.getHours().toString().padStart(2,"0");
                let minutes=datetime.getMinutes().toString().padStart(2,"0")
             return {dayOfWeek,dayOfMonth,month,year,hours,minutes}
                }


                function fixDateOnsite(date) {
                    let datetime=new Date(`${date}`);
                    let days =["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
                    let months=["January","February","March","April","May","June","July","August","September","October","November","December"];
                    let dayOfWeek=days[datetime.getDay()];
                    let dayOfMonth=datetime.getDate().toString().padStart(2,"0");
                    let month=months[datetime.getMonth()];
                    let year=datetime.getFullYear();
                    let hours=datetime.getHours().toString().padStart(2,"0");
                    let minutes=datetime.getMinutes().toString().padStart(2,"0")
                 return {dayOfWeek,dayOfMonth,month,year,hours,minutes}
                    }
               
                
        
          

 
            let files=req.files;
            let newArray
            
            
            
            async    function handleFile(data){
                let newPath;
            let image;
            for(let i=0;i<data.length;++i){
            const {originalname,path}=data[i];
            const parts= originalname.split('.');
            const ext= parts[parts.length-1];
            newPath=path+'.'+ext;
            
            fs.renameSync(path,newPath)
             async  function createThumbnail(data) {
             let getData=await sharp(data).resize(500,500).jpeg({quality:80}).toBuffer();
             let convertedString=getData.toString('base64')
                return convertedString
            }
            
            let thumbnail= await createThumbnail(newPath);
            
            image={newPath,thumbnail}
            
            }
             
            let newFiles=[];
            newFiles.push(image)
            
            
            return newFiles
            
            
            }
            
            
            if (files.length>0) {
            let fileData=await handleFile(files);
            newArray=fileData
              }
          
    let thumbnail=newArray[0].thumbnail;
    let image=newArray[0].newPath
  let newDate=type === "Onsite" ? fixDateOnsite(startDateTime) : {openTime:fixDate(openTime),closeTime:fixDate(closeTime)}
                const newAuction=await Auction.create({

                    name,type,...(type==="Onsite"&& {startDateTime,location}),...(type==="Online"&& {openTime,closeTime}),featuredImage:newArray
                })

                console.log(newAuction);
                res.status(201).json(newAuction)    
    
const users=await User.find({},"_id");

let notifications;
if (type==="Onsite") {
    notifications =users.map((user)=>({
        message: `Kindly note that a new auction has been added, the auction's name is ${name} and it will be held at ${location}.The auction will start at ${newDate.hours}:${newDate.minutes} on  ${newDate.dayOfWeek} ${newDate.dayOfMonth} ${newDate.year}.`,
     
        userId:user._id,
        auction:newAuction._id,
        messageId:`${newAuction._id}${user._id}${now}`
    }))
}
if (type==="Online") {
    notifications =users.map((user)=>({
        message: `Kindly note that a new auction has been added, the auction's name is ${name} and it is strictly online.You are open to bid from ${newDate.openTime?.hours}:${newDate.openTime?.minutes} ${newDate.openTime?.dayOfWeek} ${newDate.openTime?.dayOfMonth} ${newDate.openTime?.year} and the bidding window  will close  at ${newDate.openTime?.hours}:${newDate.openTime?.minutes} ${newDate.openTime?.dayOfWeek} ${newDate.openTime?.dayOfMonth} ${newDate.openTime?.year}.We wish you all the best on this auction.`,
     
        userId:user._id,
        auction:newAuction._id,
        messageId:`${newAuction._id}${user._id}${now}`
    }))
}

await Notification.insertMany(notifications)
let dbNotifications=await Notification.find();

const onlineUsers=await OnlineUsers.find({});


for(const notification of dbNotifications){


const onlineUser=await OnlineUsers.findOne({userId:notification.userId.toString()});
console.log(onlineUser);
if (onlineUser&&onlineUser.socketId) {
    console.log(onlineUser);
     io.to(onlineUser.socketId).emit("notification",notification)
}else {
console.log("User is offline");
}
}
       

 
          }

          else{
            res.status(401).json({msg:"User is not fit to do this task"})
        }


        }
        
     
    else{
        res.status(401).json({msg:"User not authorized"})
    }
  
} catch (error) {
    console.error(error);
    res.status(500).json({msg:"Server Error"})
}
}

const getAuctions=async(req,res)=>{

try {
    let now = new Date();
    let twoWeeksFromNow=new Date();
    twoWeeksFromNow.setDate(now.getDate()+14);

 
    let liveOnlineAuctions=await Auction.find().where('type').equals("Online").where("openTime").lte(twoWeeksFromNow);
    let liveOnsiteAuctions=await Auction.find().where('type').equals("Onsite").where("startDateTime").lte(twoWeeksFromNow);
    let liveAuctions=[...liveOnlineAuctions,...liveOnsiteAuctions]
let onlineAuctions=await Auction.find().where('type').equals("Online").where("openTime").gte(twoWeeksFromNow);
let onsiteAuctions=await Auction.find().where("type").equals("Onsite").where("startDateTime").gte(twoWeeksFromNow)
let upcomingAuctions=[...onlineAuctions,...onsiteAuctions];
 
   
 
    const auctions=await Auction.find();

    res.status(200).json({auctions,liveAuctions,upcomingAuctions})
} catch (error) {
    console.log(error);
    res.status(500).json({msg:"Server Error"})
}
}


const getOnsiteAuctions=async(req,res)=>{
   
    try {
   
    let now= new Date();
    let page= parseInt(req.query.page)||1;
    let limit= parseInt(req.query.limit)||10;
    console.log(limit);
  
let skip= (page-1)*limit;

  let total= await Auction.countDocuments({type:"Onsite",startDateTime:{$gte:now}})
    let auctions=await Auction.find({type:"Onsite",startDateTime:{$gte:now}}).skip(skip).limit(limit).sort({startDateTime:1});
   
    let hasMore=page*limit<total;


    res.status(200).json({
        data:auctions,
        nextPage:hasMore?page+1:null
    })



    } catch (error) {
        
        console.log(error);
        res.status(500).json({msg:"Server error"})
    }
}
const getOnlineAuctions=async(req,res)=>{
   
    try {
    let now= new Date();
    let page= parseInt(req.query.page)||1;
    let limit= parseInt(req.query.limit)||10
let skip= (page-1)*limit;


  let total= await Auction.find().where("type").equals("Online").where("openTime").lte(now).where("closeTime").gte(now).countDocuments()
    let auctions=await Auction.find().where("type").equals("Online").where("closeTime").gte(now).skip(skip).limit(limit);
    let hasMore=page*limit<total;

    res.status(200).json({
        data:auctions,
        nextPage:hasMore?page+1:null
    })
      
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Server error"})
    }
}
const getAuction=async(req,res)=>{
    const id=req.params.id;
try {
    const auction=await Auction.findById(id).populate(
        {
            path:"lots",
            populate:{
                path:"bids",
                populate:{
                    path:"user",
                    select:"_id"
                }
            }
        }
    );
    if (!auction) {
        res.status(200).json({msg:"Auction not found"})
    }
    res.status(200).json(auction)
} catch (error) {
    console.log(error);
    res.status(500).json({msg:"Server Error"})
}
}
const updateAuction=async(req,res)=>{

    const user=req.user;
    let id=req.params.id
    try {
        const {auctionName,auctionLocation,auctionDate,auctionDeadline,auctionTime} =req.body;

        if (user) {
            


   

         if (user.role==="Exec" || "Admin") {
            if (req.file) {
                let newPath;
              
                let files=req.files;
                let newArray
                
                
                
                async    function handleFile(data){
                let image;
                for(let i=0;i<data.length;++i){
                const {originalname,path}=data[i];
                const parts= originalname.split('.');
                const ext= parts[parts.length-1];
                newPath=path+'.'+ext;
                
                fs.renameSync(path,newPath)
                 async  function createThumbnail(data) {
                 let getData=await sharp(data).resize(500,500).jpeg({quality:80}).toBuffer();
                 let convertedString=getData.toString('base64')
                    return convertedString
                }
                
                let thumbnail= await createThumbnail(newPath);
                
                image={newPath,thumbnail}
                
                }
                 
                let newFiles=[];
                newFiles.push(image)
                
                
                return newFiles
                
                
                }
                let file=req.file
                
                
                if (files.length>0) {
                let fileData=await handleFile(files);
                newArray=fileData
                  }
                  let updatedData={
                    auctionName,
                    auctionLocation,
                    auctionDate,
                    auctionDeadline,
                    auctionTime,
            
                  }
                  if (req.file) {
                    updatedData.featureImage=newArray
                  }
                  const auction=await Auction.findByIdAndUpdate(id,updatedData,{new:true});
                  res.status(200).json(auction)
            }else{
             let updateAuction=await    Auction.findByIdAndUpdate(id,{$set:req.body},{new:true});
             res.status(201).json(updateAuction)
            }
            
         }else{
            res.status(401).json({msg:"User not fit to perform this task"})
         }
        }else{
            res.status(401).json({msg:"User not authorized"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Server Error"})
    }
}

const deleteAuction=async(req,res)=>{
    const user=req.user;
    let id=req.params.id
    let io=getIO()
let now=new Date();
    try {
        if (user) {
         if (user.role==="Exec" || "Admin") {
            await Lot.deleteMany({auction:id})
            const auction=await Auction.findByIdAndDelete(id);
            const users=await User.find({},"_id");
            console.log("hello world");

            function fixDate(date,time) {
            let datetime=new Date(`${date}T${time}:00`);
            let days =["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            let months=["January","February","March","April","May","June","July","August","September","October","November","December"];
            let dayOfWeek=days[datetime.getDay()];
            let dayOfMonth=datetime.getDate().toString().padStart(2,"0");
            let month=months[datetime.getMonth()];
            let year=datetime.getFullYear();
            let hours=datetime.getHours().toString().padStart(2,"0");
            let minutes=datetime.getMinutes().toString().padStart(2,"0")
         return {dayOfWeek,dayOfMonth,month,year,hours,minutes}
            }
//let fixedDate=fixDate(auction.auctionDate,auction.auctionTime);
res.status(200).json({msg:"Auction Delete"})
/*
            const notifications=users.map((user)=>({
                message:`Kindly note that the ${auction.name} auction that had been slated for ${fixedDate.dayOfWeek} ${fixedDate.dayOfMonth} ${fixedDate.month} ${fixedDate.year} at ${fixedDate.hours}:${fixedDate.minutes} has been deleted, we apologize for any inconvinience caused. `,

             
                userId:user._id,
                auction:auction._id,
                messageId:`${auction._id}${user._id}${now}`
               
            }))
            await Notification.insertMany(notifications)
            let dbNotifications=await Notification.find();
            
            const onlineUsers=await OnlineUsers.find({});
            for(const notification of dbNotifications){
                console.log("userId");
            
            const onlineUser=await OnlineUsers.findOne({userId:notification.userId.toString()});
            console.log(onlineUser);
            if (onlineUser&&onlineUser.socketId) {
                console.log(onlineUser);
                 io.to(onlineUser.socketId).emit("notification",notification)
            }else {
            console.log("User is offline");
            }
            }
     */
         }else{
            res.status(401).json({msg:"User not fit to perform this task"})
         }
        }else{
            res.status(401).json({msg:"User not authorized"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Server Error"})
    }
}

module.exports={createAuction,getAuction,getAuctions,updateAuction,deleteAuction,getOnlineAuctions,getOnsiteAuctions}

