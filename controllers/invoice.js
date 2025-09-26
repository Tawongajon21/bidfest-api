const Invoice=require("../models/Invoices");
const Lot=require("../models/Lot");
const ExcelJs=require("exceljs");
const path=require("path");
const fs=require("fs");
const {formatDate}=require("../utils/index")
async function generateInvoice(data) {
    const {name,surname,email,phone,amount,buyersPremium,vat,total,invoiceNumber,lot}=data
    const workbook= new ExcelJs.Workbook();
    await workbook.xlsx.readFile(path.join(__dirname,'templates','invoice_template.xlsx'));
    const worksheet= workbook.getWorksheet(1);
    worksheet.eachRow( (row)=>{
        row.eachCell(async(cell)=>{
          if (typeof cell.value==="string") {
            cell.value=cell.value
            .replace(`{{name}}`,name)
            .replace(`{{surname}}`,surname)
            .replace(`{{email}}`,email)
            replace(`{{phone}}`,phone)
            replace(`{{invoiceNumber}}`,invoiceNumber)
            .replace(`{{createdAt}}`,formatDate(createdAt))
            .replace(`{{propertyName}}`,propertyName)
            .replace(`{{amount}}`,String(amount))
            .replace(`{{buyersPremium}}`,String(buyersPremium))
            .replace(`{{vat}}`,String(vat))
            .replace(`{{totalWithVatWithCashHandling}}`,String(total))
    let outputFileName=`${name} ${surname} invoice`
            let outputPath=path.join(__dirname,"invoices",outputFileName)
            await workbook.xlsx.writeFile(outputPath)
    return outputPath
          }
        })
      })

}

const CreateInvoice=async(req,res)=>{
const {name,surname,email,phone,amount,buyersPremium,vat,total,invoiceNumber,lot}=req.body
const user=req.user;
let userId=user._id;

try {
    if (user) {
let getLot=await Lot.findById(lot);
let propertyName=getLot.propertyName
    let newInvoice=await Invoice.create({
        name,surname,email,phone,amount,buyersPremium,vat,total,invoiceNumber,lot,propertyName
    })


const excelPath= await generateInvoice(newInvoice);

res.download(excelPath)



    }

} catch (error) {
    console.error(error);
    res.status(500).json({msg:"Server Error"})
}
}

const getInvoices=async(req,res)=>{
    try {
        let user=req.user;
        let lot=req.params.id;
    if (user) {
        
        const invoices=await Invoices.find()

     
        res.status(200).json(invoices)
    }else{
        res.status(403).json({msg:"You are not authorized"})
    }
    
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Server Error"})
    }
    }

    const getInvoice=async(req,res)=>{

        try {
            let user=req.user;
            let id=req.params.id
            console.log(user);
     
                let invoice=await Invoice.findById(id)
        
        
                res.status(200).json(invoice)
        
            
           
        } catch (error) {
            console.log(error);
            res.status(500).json({msg:"Server Error"})
        }
        }
    


module.exports={CreateInvoice,getInvoices,getInvoice}