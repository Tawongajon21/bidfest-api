

const  express= require('express');
const bidRoutes= express.Router();
const {CreateBidding,getUserBiddings,updateBidding,deleteBidding,getBiddings,getBid} = require('../controllers/bidding');
const isAuth = require('../middlewares/auth');


bidRoutes.post("/add-bid",isAuth,CreateBidding);
bidRoutes.get("/get-user-bid/:id",isAuth,getUserBiddings);
bidRoutes.get("/get-bids/:id",isAuth,getBiddings);
bidRoutes.get("/get-bid/:id",getBid);
bidRoutes.patch("/update-bid/:id",isAuth,updateBidding);
bidRoutes.delete("/delete-bid/:id",isAuth,deleteBidding);


/*
bidRoutes.get("/get-lots/:id",getLots);
bidRoutes.get("/get-lot/:id",getLot);
bidRoutes.delete("/delete-lot/:id",isAuth,deleteLot);

*/

module.exports=bidRoutes