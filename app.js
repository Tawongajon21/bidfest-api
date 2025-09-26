const express= require('express');
const app = express();
const dotenv= require("dotenv");
const connect = require('./database/connection');
const cors= require('cors');
const isAuth=require("./middlewares/auth")
const OnlineUsers=require("./models/Online")
const authRoutes = require('./routes/auth');
const developerRoutes = require('./routes/developer-auth');
let {formatDate} =require("./utils/index")
const biddingRoutes = require('./routes/bidding');
const {initSocket}=require("./utils/socket") 
const Auction=require("./models/Auction")
const Invoice=require("./models/Invoices")
const Lot=require("./models/Lot")
const Bid=require("./models/Bidding");
const {Workbook}=require("exceljs")
const fs=require("fs")
let path=require('path')

const {getIO}=require("./utils/socket")

const http=require("http")
/*
const checkAuctionDeadlines=()=>{
const now=new Date();
Auction.updateMany(
  {
    auctionDeadline:{
      lt:now,view:true,set:{view:false}
    }
  }
)
.then(result=>{
  console.log("Auctions updated", result.modifiedCount);
})
.catch(err=>{
  console.log("Error updating auctions",err);
})
}
setInterval(checkAuctionDeadlines,30*60*1000)









setInterval(
async()=>{


  let io=getIO()
  let now= new Date();




  let auctions=await Auction.find({auctionType:"Online"}).populate("lots")

  for(const auction of auctions){

let deadlineDate=auction.auctionDeadline.toISOString().split("T")[0];

let fullDeadline=new Date(`${deadlineDate}T${auction.auctionTime}:00Z`);

if (fullDeadline < now) {

  for(let lot of auction.lots){


    let bids=await Bid.find({lot:lot._id}).sort({amount:-1}).populate({path:"user",select:"name surname"}).populate("lot");

   
    if (bids.length>0) {
      let winner=bids[0].user._id;

      let findNotification=await Notification.findOne({messageId:auction._id,userId:winner})
      if (!findNotification) {
     let winnerNote=await Notification.create({
          userId:winner,
          message:`Hey ${bids[0].user.name}, congratulations you have won the bid for the ${lot.propertyName} on the auction ${auction.auctionName} held at ${auction.auctionLocation}.One of our staff members will contact you and inform you about the next steps.Once again congratulations and we wish to see you soon.`,
          read:false,
          messageId:`${auction._id}${winner}${now}`,
          auction:auction._id,
          lot:lot._id
        });
        
       let winnerSocket=await OnlineUsers.findOne({userId:winner});
        if (winnerSocket) {
          io.to(winnerSocket.socketId).emit("notification",{message:winnerNote.message})
    
        }
    for (let i = 1; i < bids.length; i++) {
    let bidder=bids[i].user._id;
    let message=`Hey ${bids[0].user.name}, It is unfortunate that your bid did not win and came on number ${i+1} for ${lot.propertyName} at the ${auction.auctionName} held at ${auction.auctionLocatio}.We appreciate your effort in participating.We wish you all the best in the next edition of our auctions.`
    if (!findNotification) {
      let note=await Notification.create({
        userId:bidder,
        message,
      
        messageId:`${auction._id}${bidder}${now}`,
        auction:auction._id,
        lot:lot._id,
      
    
        read:false
      })
      let socket=await OnlineUsers.findOne({userId:bidder});



      if (socket) {
        io.to(socket.socketId).emit("notification",{message:note.message})
      }
    }

    }
      }

      }
let getLot= await Lot.findById(lot._id);
getLot.sold=true;
await getLot.save();






    }
}
  }


}

,10*1000)

*/

const notificationRoutes = require('./routes/notifications');

const auctionRoutes=require("./routes/auction")
const lotRoutes=require("./routes/lot")
const invoiceRoutes=require("./routes/invoice")
const Notification=require('./models/Notifications')
const server=require('http').createServer(app);
const {Server}=require("socket.io")
const jwt=require("jsonwebtoken")



dotenv.config();

app.use('/uploads',express.static(__dirname+"/uploads"))



app.use(express.json({limit:'100mb'}));
app.use(express.urlencoded({limit:"100mb",extended:true}))
let connections=0;




function attachSocket(io){
app.use((req,res,next)=>{
  res.locals.socketio=io;
  next()
})
}

const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions))

 connect(process.env.MONGODB_URI_TWO);

app.use("/api/v1/auth/",authRoutes);
app.use("/api/v1/auction/",auctionRoutes);
app.use("/api/v1/lot/",lotRoutes);
app.use("/api/v1/developer/",developerRoutes);
app.use("/api/v1/bid/",biddingRoutes);
/*
app.use("/api/v1/invoice/",invoiceRoutes);
*/



app.use("/api/v1/notification/",notificationRoutes);

module.exports={app,attachSocket}
