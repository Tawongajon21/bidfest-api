

const  express= require('express');
const multer=require("multer");
const { getAuction,getAuctions,createAuction,updateAuction,deleteAuction,getOnlineAuctions,getOnsiteAuctions} = require('../controllers/auction');
const uploadMiddleware = multer({ dest: 'uploads/' });


const isAuth = require('../middlewares/auth');
const auctionRoutes= express.Router();

const upload=multer({
    storage,
    limits:{
        fileSize:100*1024*1024
    }
})


auctionRoutes.post("/add-auction",isAuth,upload.any('images'),createAuction);
auctionRoutes.get("/get-auctions",getAuctions);
auctionRoutes.get("/get-online-auctions",getOnlineAuctions);
auctionRoutes.get("/get-onsite-auctions",getOnsiteAuctions);
auctionRoutes.get("/get-auction/:id",getAuction);
auctionRoutes.put("/update-auction/:id",isAuth,uploadMiddleware.any('images'),updateAuction)
auctionRoutes.delete("/delete-auction/:id",isAuth,deleteAuction);


module.exports=auctionRoutes
