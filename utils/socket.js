const {Server}=require("socket.io");
const {app}=require("../app")
const jwt=require("jsonwebtoken");
let secret=process.env.APP_SECRET
const OnlineUsers=require("../models/Online")
let ioInstance
function initSocket(server) {



   ioInstance=new Server(server,{
     cors:{
        origin:"*",
        methods:['GET','POST'],
        credentials:true
     },
     transports:['websocket','polling']
    })
  //  app.use((req,res,next)=>{res.locals['socketio']=io;next()})

    ioInstance.use((socket,next)=>{
        let token= socket.handshake.auth.token;
        if (!token) {
          return next(new Error("Not Authenticated"))
        }
        try {
          let decoded=jwt.verify(token,process.env.APP_SECRET)
       
          socket.user=decoded;
          next()
        } catch (error) {
          next(new Error("Invalid token"))
        }
      })
      ioInstance.on("connection",(socket)=>{
      console.log("hello");
        socket.on("add-user",async()=>{
          let userId=socket.user._id
        console.log("User connected",socket.id);
      
      if (!userId) {
        return
      }else{
      
        let users= await OnlineUsers.findOneAndUpdate({userId},{socketId:socket.id,connectedAt: new Date()  }, {    upsert:true,new:true  }  )
       let getUsers=await OnlineUsers.find()
       
      }
      
      
        })
      
      
      
      {/**
      (userId)=>{
          console.log("user");
          console.log(userId);
          if (userId) {
            onlineUsers[userId]=socket.id;
            console.log("Users",onlineUsers);
            socket.emit("userAdded",{message:"new user has been added"})
            return {message:"New user has been added"}
          }
        } */}
        socket.on("disconnect",async()=>{
      await OnlineUsers.findOneAndDelete({socketId:socket.id})
         
        })
      })
      
      
    return ioInstance
}
function getIO() {
 
    if (!ioInstance) {
        throw new Error("Socket.io not initialized")
    }




    return ioInstance
}

module.exports={initSocket,getIO}


/**
 * x
    
    
 */