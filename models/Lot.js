const mongoose= require('mongoose');
const LotSchema=mongoose.Schema({
  auction:{
  
    type:mongoose.Types.ObjectId,
    ref:'auction'
  
},
propertyName:{
      type:String
  },
expectedPrice:{
      type:Number
  },
currentPrice:{
      type:Number
  },
  startingPrice:{
    type:Number
}
,
itemType:{
    type:String,
    required:true
  },

code:{type:String
    },

lotImages:[
        {
          newPath:{
            type:String
          },
          thumbnail:{
            type:String
          }
        }
      ]
      ,
sold:{
        type:Boolean,
        default:false
}
,
view:{
    type:Boolean
  }
,
specs:mongoose.Schema.Types.Mixed,
bids:[{
    type:mongoose.Types.ObjectId,
    ref:'bidding'
  }]



},
{
  timestamps:true
}

);

const Lot= mongoose.model('lot',LotSchema);

module.exports=Lot



