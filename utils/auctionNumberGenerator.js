class AuctionNumberGenerator{
    constructor(){
        this.auctionCount=0;
        this.lastDate=null;
        this.prefix='BF';
        this.eventName="Bidfest"
    }


    generateAuctionNumber(){
        const currentDate=new Date();
       let formattedDate=`${currentDate.getDate().toString().padStart(2,'0')}-${(currentDate.getMonth()+1).toString().padStart(2,'0')}-${currentDate.getFullYear().toString().slice(-2)}}`
    
    if (!this.lastDate||this.lastDate.getDate()!==currentDate.getDate()||this.lastDate.getMonth()!==currentDate.getMonth()||this.lastDate.getFullYear()!==currentDate.getFullYear()) {
        this.auctionCount=0;
        this.lastDate=currentDate
    }


    this.auctionCount++
    formattedDate=formattedDate.toString();
    formattedDate=formattedDate.slice(0,formattedDate.length-1)
   
    const auctionNumber=`${this.prefix}|${formattedDate}|${this.auctionCount.toString().padStart(2,'0')}`;
    const auctionDescription=`${this.prefix}-${this.eventName} ${formattedDate} - ${currentDate.getDate().toString().padStart(2,"0")}-${(currentDate.getMonth()+1).toString().padStart(2,'0')}-${currentDate.getFullYear()}-${this.auctionCount.toString().padStart(2,'0')}`
return {auctionNumber,auctionDescription}     
}
}

module.exports=AuctionNumberGenerator