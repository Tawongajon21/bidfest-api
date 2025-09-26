const http=require("http");
const {app,attachSocket}=require("./app");
const {initSocket}=require("./utils/socket");
const os=require("os");
const cluster= require("cluster");
const cCPUS= require("os").cpus().length;
const server=http.createServer(app);
let io=initSocket(server)
attachSocket(io)





    const start= async()=>{
        try {
      
            //Start the Server
  
            server.listen(process.env.PORT,()=>{
                console.log("Server running on port " + process.env.PORT);
            })
        } catch (error) {
           throw error
        }
      }
      module.exports=start





   





