const mongoose=require("mongoose");

const InvoiceSchema=new mongoose.Schema({
name:{
    type:String,
    required:true
},
surname:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
phone:{
    type:String,
    required:true
},
amount:{
    type:Number,
    required:true
},
buyersPremium:{
    type:Number,
    required:true
},
vat:{
    type:Number,
    required:true
},
total:{
    type:Number,
    required:true
},
userId:{
    type:String,
},
invoiceNumber:{
    type:String,
    unique:true
},
lot:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"lot",
    default:null
},

propertyName:{
    type:String,
}

},
{
    timestamps:true
}
)


const Invoice= mongoose.model("invoice",InvoiceSchema);

module.exports=Invoice;
