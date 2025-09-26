const Lot =require("../models/Lot");
const Auction =require("../models/Auction");
const fs=require("fs")
const sharp=require("sharp")

const CreateLot=async(req,res)=>{
const {auction,propertyName,expectedPrice,currentPrice,startingPrice,itemType,code,specs} =req.body;
const user=req.user;

let lotImages;

async    function handleFile(data){
    let newPath;
let image;
let newFiles=[];
for(let i=0;i<data.length;++i){
const {originalname,path}=data[i];

const parts= originalname.split('.');
const ext= parts[parts.length-1];

newPath=path;


fs.renameSync(path,newPath);



 async  function createThumbnail(data) {
 let getData=await sharp(data).resize(500,500).jpeg({quality:80}).toBuffer();
 let convertedString=getData.toString('base64')
    return convertedString
}



let thumbnail= await createThumbnail(newPath);

image={newPath,thumbnail}
newFiles.push(image)
}








return newFiles


}



let newArray
if (req.files.length>0) {
 
   
    lotImages=await handleFile(req.files);
      }


   
console.log(lotImages);



try {
    if (user) {
        if (user.role==="Exec" || "Admin") {
            const newLot=await Lot.create({
                auction,propertyName,expectedPrice,currentPrice,startingPrice,itemType,code,lotImages,specs
            })

let findAuction=await Auction.findOne({_id:auction})


  let updateAuction=          await Auction.findByIdAndUpdate(auction,{
                $push:{
                    lots:newLot._id
                }
            })
           

            res.status(201).json(newLot)
        }
        else{
            res.status(401).json({msg:"User is not fit to do this task"})
        }
     
    }else{
        res.status(401).json({msg:"User not authorized"})
    }
  
} catch (error) {
    console.error(error);
    res.status(500).json({msg:"Server Error"})
}
}

const getLots=async(req,res)=>{
try {
    let id=req.params.id;
 
    const lots=await Lot.find({auction:id}).populate("bids");
    res.status(200).json(lots)
} catch (error) {
    res.status(500).json({msg:"Server Error"})
}
}
const getLot=async(req,res)=>{
    const id=req.params.id;
    console.log(id);
   
try {
    const lot=await Lot.findById(id).populate("bids").populate("auction");
    if (!lot) {
        res.status(200).json({msg:"Lot not found"})
    }else{
        res.status(200).json(lot)
    }
   
} catch (error) {
    console.log(error);
    res.status(500).json({msg:"Server Error"})
}
}
const updateLot=async(req,res)=>{
    const {auctionId,propertyName,code,location,auctionDate,mileage,keyAvailable,startingPrice,currentPrice,expectedPrice,vehicleType,seats,year,fuelType,numberOfDoors} =req.body;

    const user=req.user;
    let id=req.params.id
    try {
        if (user) {
         if (user.role==="Exec" || "Admin") {
         let lot=await Lot.findById(id);
         if (!lot) {
            res.status(404).json({msg:"Lot not found"})
         }
         async    function handleFile(data){
            let newPath;
        let image;
        for(let i=0;i<data.length;++i){
        const {originalname,path}=data[i];
        const parts= originalname.split('.');
        const ext= parts[parts.length-1];
        newPath=path+'.'+ext;
        
        fs.renameSync(path,newPath);
        
         async  function createThumbnail(data) {
         let getData=await sharp(data).resize(500,500).jpeg({quality:80}).toBuffer();
         let convertedString=getData.toString('base64')
            return convertedString
        }
        
        
        
        let thumbnail= await createThumbnail(newPath);
        
        image={newPath,thumbnail}
        
        }
         
        let newFiles=[];
        for(let i=0;i<data.length;++i){
        newFiles.push(image)
        }
        
        
        
        return newFiles
        
        
        }
            
if(auctionId) lot.auction=auctionId
if(propertyName) lot.propertyName=propertyName
if(code) lot.code=code
if(location)lot.location=location
if(auctionDate)lot.auctionDate=auctionDate
if(mileage)lot.mileage=mileage
if(keyAvailable)lot.keyAvailable=keyAvailable
if(startingPrice)lot.startingPrice=startingPrice
if(currentPrice)lot.currentPrice=currentPrice
if(expectedPrice)lot.expectedPrice=expectedPrice
if(vehicleType)lot.vehicleType=vehicleType
if(seats)lot.seats=seats
if(year)lot.year=year
if(fuelType)lot.fuelType=fuelType
if(numberOfDoors)lot.numberOfDoors=numberOfDoors
if (req.files) {
    let exteriorFiles=req.files.filter((item)=>item.fieldname==="exteriorImages[]");

let interiorFiles=req.files.filter((item)=>item.fieldname==="interiorImages[]");

if (exteriorFiles.length>0) {
    lot.exteriorImages=await handleFile(exteriorFiles)

}
if (interiorFiles.length>0) {
    lot.interiorImages=await handleFile(interiorFiles)
}
}
if (req.body.removedImages) {
    let removedImages=req.body.removedImages
    lot.exteriorImages=lot.exteriorImages.filter((image)=>!removedImages.includes(image._id))
    lot.interiorImages=lot.interiorImages.filter((image)=>!removedImages.includes(image._id))
}
await lot.save()
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

const deleteLot=async(req,res)=>{
    const user=req.user;
    let id=req.params.id
    try {
        if (user) {
         if (user.role==="Exec" || "Admin") {
            const lot=await Lot.findByIdAndDelete(id);
            res.status(200).json({msg:"Lot Deleted"})
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
const getSearchLots=async(req,res)=>{
    try {
const {cursor=null,limit=5,search="",minimumPrice="",maximumPrice="",vehicleType="",itemType=""}=req.query;

let filter={};

let now=new Date();
let twoWeeksFromNow=new Date();
twoWeeksFromNow.setDate(now.getDate()+14)
if (search) {
    filter.propertyName=new RegExp(search,'i')

}
if (vehicleType && vehicleType !== 'All') {
 
        filter.vehicleType=new RegExp(vehicleType,'i')
    


}
if (itemType && itemType !== 'All') {
 
        filter.itemType=new RegExp(itemType,'i')
    


}
if (minimumPrice||maximumPrice){
    filter.currentPrice={};

    if (minimumPrice) {
        filter.currentPrice.$gte=Number(minimumPrice);
    }

 if (maximumPrice) {
  filter.currentPrice.$lte=Number(maximumPrice)  
 }
}

console.log(filter);
if (cursor) {
    filter._id={$lt:cursor}
}


//console.log(filter);

     let lots=await Lot.find(filter).sort({_id:-1}).limit(Number(limit)).populate("auction").populate("bids");
  
     let filteredData=lots.map(lot=> {
        let isLive=lot.auction&& lot.auction.auctionDeadline>=now && lot.auction.auctionDate<twoWeeksFromNow;

     return {
        ...lot.toObject(),
        isLive
     }   

     })


     let nextCursor=lots.length ? lots[lots.length-1]._id: null
let data=filteredData

       // const lots=await Lot.find({auction:id}).populate("bids");
let resultsFound=cursor? undefined: await Lot.countDocuments(filter)
        res.status(200).json({
            data,nextCursor,hasMore:!nextCursor,resultsFound
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Server Error"})
    }
    }

    const getFeaturedLots=async(req,res)=>{
        try {
            let id=req.params.id;
         
            const lots=await Lot.find();
            res.status(200).json(lots)
        } catch (error) {
            res.status(500).json({msg:"Server Error"})
        }
        }





module.exports={CreateLot,getLot,getLots,updateLot,deleteLot,getSearchLots,getFeaturedLots}

