

const  express= require('express');
const multer=require("multer");
const { getLot,getLots,CreateLot,updateLot,deleteLot,getSearchLots,getFeaturedLots} = require('../controllers/lot');
const uploadMiddleware = multer({ dest: 'uploads/' });


const isAuth = require('../middlewares/auth');


const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./uploads/")
     

    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+file.originalname);
    }
})
let allowedTypes=[
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/heic",
    "image/heif",
    "image/svg+xml",
    "image/bmp",
    "image/tiff",
    "image/eps"

]
const fileFilter=(req,file,cb)=>{
    if (allowedTypes.includes(file.mimetype)) {
        cb(null,true)
    }else{
        cb(null,false)
    }
}
const upload=multer({
    storage,
    limits:{
        fileSize:100*1024*1024
    },
    fileFilter
})

const lotRoutes= express.Router();


lotRoutes.post("/add-lot",isAuth,upload.any("lotImages",20),CreateLot);
lotRoutes.get("/get-lots/:id",getLots);
lotRoutes.get("/get-search-lots",getSearchLots);
lotRoutes.get("/get-featured-lots",getFeaturedLots);
lotRoutes.get("/get-lot/:id",getLot);
lotRoutes.delete("/delete-lot/:id",isAuth,deleteLot);
lotRoutes.patch("/update-lot/:id",isAuth,updateLot);


module.exports=lotRoutes