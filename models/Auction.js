const mongoose= require('mongoose');


const AuctionSchema=mongoose.Schema({
 
name:{
  type:String,
  required:true
},
type:{
  type:String,
  required:true,
  enum:["Online","Onsite"]
},
location:{
  type:String
},
date:{
  type:Date,

},
openTime:{
  type:Date
},
closeTime:{
  type:Date
},
startDateTime:{
  type:Date
},

view:{
  type:Boolean,
  default:true
},
lots:[{
    type:mongoose.Types.ObjectId,
    ref:'lot'
  }],
featuredImage:[
  {
    newPath:{
      type:String
    },
    thumbnail:{
      type:String
    }
  }
],

  



    


},

{
  timestamps:true
}
);

const Auction= mongoose.model('auction',AuctionSchema);

module.exports=Auction