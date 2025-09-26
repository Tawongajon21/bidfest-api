const fs=require("fs")
const path=require('path')

const imagePath='photo-one.jpg';
const imageBuffer=fs.readFileSync(imagePath)
const imageDimensions=getImageDimensions(imageBuffer);
const width=imageDimensions.width;
const height=imageDimensions.height;

const newWidth=1280;
const newHeight=Math.round(height*(newWidth/width));
const resizedBuffer=Buffer.alloc(newWidth*newHeight*3);

for(let y=0;y<newHeight;++y){
for(let x=0;x<newWidth;x++){
const originalX=Math.round(x*(width/newWidth));
const originalY=Math.round(y*(height/newHeight));
const originalIndex=(originalY*width*3)+(originalX*3);
const newIndex=(y*newWidth*3)+(x*3);
resizedBuffer[newIndex]=imageBuffer[originalIndex];
resizedBuffer[newIndex+1]=imageBuffer[originalIndex+1];
resizedBuffer[newIndex+2]=imageBuffer[originalIndex+2];

}
}

const outputPath='new-photo-one.jpg';
fs.writeFileSync(outputPath,resizedBuffer);

function getImageDimensions(buffer){
    const SOI= buffer.indexOf(0xff);
    const APPO= buffer.indexOf(0xff,SOI+1);
    const DHT=buffer.indexOf(0xff,APPO+1);
    const SOS= buffer.indexOf(0xff,DHT+1);
    const height=buffer.readUInt16BE(SOS+3);
    const width=buffer.readUInt16BE(SOS+1);
    return {width,height}
}