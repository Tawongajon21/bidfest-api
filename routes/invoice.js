

const  express= require('express');
const multer=require("multer");
const { CreateInvoice,getInvoices,getInvoice} = require('../controllers/invoice');
const uploadMiddleware = multer({ dest: 'uploads/' });


const isAuth = require('../middlewares/auth');
const invoiceRoutes= express.Router();

invoiceRoutes.post("/add-invoice",isAuth,CreateInvoice);
invoiceRoutes.get("/get-invoices",getInvoices);
invoiceRoutes.get("/get-invoice/:id",getInvoice);
/*
auctionRoutes.put("/update-auction/:id",isAuth,uploadMiddleware.any('images'),updateAuction)
auctionRoutes.delete("/delete-auction/:id",isAuth,deleteAuction);
*/

module.exports=invoiceRoutes