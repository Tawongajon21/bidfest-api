let departure="2025-04-20T08:30"

const monthNames=['January','February','March','April','May','June','July','August','September','October','November','December']

function fixDate(date) {
    let getMonth=date.substring(6,7) - 1;
    let getMonthName=monthNames[getMonth];
    let day=date.slice(8,10);
    let year=date.slice(0,4)

    let letter="T";
    const index=date.indexOf(letter);
    const getTime= date.slice(index+1);
   
let newDate={time:getTime,date:`${day} ${getMonthName} ${year}`}  
return newDate
    
}



module.exports=fixDate