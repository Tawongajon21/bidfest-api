const mongoose= require('mongoose');


const BiddingSchema=mongoose.Schema({
    auction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"auction"
    },

    
    amount:{
        type:Number,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    lot:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"lot"
    },
  
    buyersPremium:{
        type:Number

    },
    vatOnBuyersPremium:{
        type:Number
    },
   total:{
        type:Number
    }    ,
   
  

    


},

{
    timestamps:true
  }
);
BiddingSchema.index({user:1,lot:1})

const Bidding= mongoose.model('bidding',BiddingSchema);

module.exports=Bidding