const Bidding =require("../models/Bidding");
const Auction =require("../models/Auction");
const Lots= require("../models/Lot")
const mongoose=require("mongoose")
const socket=require('../app')

const Notification=require("../models/Notifications")
const OnlineUsers=require("../models/Online")
const {getIO}=require("../utils/socket")

const CreateBidding=async(req,res)=>{
    let io=getIO()
    

   
  

    
const {auction,amount,lot,buyersPremium,vatOnBuyersPremium,total} =req.body;

const user=req.user;
let userId=user._id;

try {
    if (user) {
    
         
        let getOnlineUser=await OnlineUsers.findOne({userId})
 
    
let id=lot;

let singleLot=await Lots.findById(id);

let currentPrice=singleLot.currentPrice;
if (amount<currentPrice) {
    res.status(400).json({msg:"Your amount should not be less than the current Price"})
}
        const newBidding=await Bidding.create({
            auction,amount,lot,buyersPremium,vatOnBuyersPremium,total,user:userId
        })


        singleLot.currentPrice=amount;
    
     

        await singleLot.save();
        console.log("edit here too");
console.log(singleLot);
console.log("edit here");
        let updateLot=          await Lots.findByIdAndUpdate(id,{
            $push:{
                bids:newBidding._id
            }
        })
     


const previousBidders=await Bidding.find({
    lot,
    user:{
        $ne:userId
    }
}).distinct("user")
let validIds=previousBidders.map(id=>new mongoose.Types.ObjectId(id));
let oneLot=await Lots.findById(lot)   
let createNotifications=validIds.map((bidderId)=>{
    return {
        userId:bidderId,
        message:`Hello kindly note that someone has placed a bid in the lot you have bidded for you may want to check the current price now.`,
        lot:lot
    
    }
})


let newNotifications= await Notification.insertMany(createNotifications)
  

//let getBidders=await Notification.fisnd({_id:{in:validIds}})
let checkIds=validIds.filter(id=>mongoose.isValidObjectId(id)).map(id=>new mongoose.Types.ObjectId(id));

let getOnlineUsers=await OnlineUsers.find({userId:{$in:checkIds}})

let populatedNotifications=await Notification.find({_id:{$in:newNotifications.map(n=>n._id)}}).populate("lot")


if (getOnlineUsers.length>0) {
 
    populatedNotifications.forEach((notif)=>{
        console.log(notif);
    const onlineUser=getOnlineUsers.find((user)=>user.userId.toString()===notif.userId);
    if (onlineUser) {
io.to(onlineUser.socketId).emit("notification",notif)       
    }
})    

  
}


//console.log(notifications);
//await Notification.insertMany(notifications)




let getNotifications=await Notification.find();

        res.status(201).json(newBidding)


     
    }else{
        res.status(401).json({msg:"User not authorized"})
    }
  
} catch (error) {
    console.error(error);
    res.status(500).json({msg:"Server Error",error})
}
}

const getBiddings=async(req,res)=>{
try {
    let user=req.user;
    let lot=req.params.id;
if (user) {
    
    const biddings=await Bidding.find({lot:new mongoose.Types.ObjectId(lot)}).sort({amount:-1}).populate("lot").populate({path:"user",select:"name surname"});
console.log(biddings);

 
    res.status(200).json(biddings)
}else{
    res.status(403).json({msg:"You are not authorized"})
}

} catch (error) {
    console.log(error);
    res.status(500).json({msg:"Server Error"})
}
}

const getUserBiddings=async(req,res)=>{

try {
    let user=req.user;
    console.log(user);
let userId=user._id

    if (user) {
        let biddings=await Bidding.find({user:userId}).populate('lot',"auction propertyName code location auctionDate auctionDeadline mileage keyAvailable exteriorImages interiorImages deadline startingPrice currentPrice expectedPrice sold lotImages").populate("user",'_id').populate("auction","_id auctionDeadline auctionTime")

        let lots=await Lots.find().populate({
        path:"bids",
        populate:{
            path:"user",
            select:"_id name"
        }
     })

     let userBids=await Bidding.find().populate("lot","auction propertyName auctionTime code location auctionDate auctionDeadline mileage keyAvailable exteriorImages interiorImages deadline startingPrice currentPrice expectedPrice sold lotImages").populate("auction","auctionDate auctionDeadline auctionTime code location auctionDate auctionDeadline mileage keyAvailable exteriorImages interiorImages deadline startingPrice currentPrice expectedPrice sold").lean();
    let grouped={};
    userBids.forEach(bid=>{
        console.log(bid);
        let lotId=bid.lot?._id.toString();

        if (!grouped[lotId]) 
            grouped[lotId]=[];
            grouped[lotId].push(bid)
        
    })
    let rankedBids=[];
    Object.values(grouped).forEach(bids=>{
      
        let sorted=bids.sort((a,b)=>b.amount-a.amount);
        sorted.forEach((bid,index)=>{
            console.log(bid.amount);
            rankedBids.push({
                ...bid,rank:index+1,
            })
        })
    })
    let userRankedBids=rankedBids.filter(bid=>bid.user._id.toString()===userId);

        res.status(200).json(userRankedBids)
    }
    
   
} catch (error) {
    console.log(error);
    res.status(500).json({msg:"Server Error"})
}
}
const getBid=async(req,res)=>{

try {
    let user=req.user;
    let id=req.params.id
    console.log(user);
console.log("hello world");

        let bid=await Bidding.findById(id)


        res.status(200).json(bid)

    
   
} catch (error) {
    console.log(error);
    res.status(500).json({msg:"Server Error"})
}
}
const getBidding=async(req,res)=>{
    const id=req.params;
try {

    const bidding=await Bidding.findById(id);
    if (!bidding) {
        res.status(200).json({msg:"Bidding not found"})
    }
    res.status(200).json(bidding)
} catch (error) {
    console.log(error);
    res.status(500).json({msg:"Server Error"})
}
}
const updateBidding=async(req,res)=>{
   let {amount}=req.body
console.log(req.params);
    try {
        const user=req.user;
      
        if (user) {
         
        const bid = await Bidding.findById(req.params.id);
        let lot=bid.lot;
let getLot=await Lots.findById(lot);

       
        if (!bid) {
            res.status(404).json({message:"Bid not found"})
        }
        if (bid.user.toString()!==req.user._id) {
            return  res.status(401).json({msg:"User not authorized"})
        }
        getLot.currentPrice=amount
  
      await getLot.save();
   let updateBid=await    Bidding.findByIdAndUpdate(req.params.id,req.body,{new:true})

      res.status(201).json(updateBid)
        }else{
            res.status(401).json({msg:"User not authorized"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Server Error"})
    }
}

const deleteBidding=async(req,res)=>{
    const user=req.user;
    let id=req.params.id
    
    try {
        if (user) {
let getBid= await Bidding.findById(id)
let getBids= await Bidding.find()

console.log(getBids);
console.log(getBid);
let lotId= getBid.lot.toString()
let getLot=await Lots.findById(lotId);
let updateLot=          await Lots.findByIdAndUpdate(lotId,{
    $pull:{
        bids:new mongoose.Types.ObjectId(id)
    }
})

            const bidding=await Bidding.findByIdAndDelete(id);
            
      
         

        
            res.status(200).json({msg:"Bidding Deleted"})
        
        }else{
            res.status(401).json({msg:"User not authorized"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Server Error"})
    }
}

module.exports={CreateBidding,getBidding,getBiddings,updateBidding,deleteBidding,getUserBiddings,getBid}

