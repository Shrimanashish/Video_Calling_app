// import {WebSocketServer} from 'ws';
import { Server } from "socket.io";
// import express from 'express';
const io = new Server(8000 , {
   cors : true,
})
// const app = express();
// const PORT = 8080;


// const server = app.listen(PORT , ()=>{
//     console.log(`Server is running on ${PORT} Port successfully....` )
// })

// const ws = new WebSocketServer(8080);  
const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();  


io.on("connection" , (socket)=>{
   console.log(`Socket Connected...` , socket.id);
   socket.on("room:join" , (data) =>{
      const{email , room} = data;
      emailToSocketIdMap.set(email , socket.id);
      socketidToEmailMap.set(socket.id , email);
      io.to(room).emit("user:joined",{email , id:socket.id});
      socket.join(room);
      io.to(socket.id).emit('room:join' , data);
   });


   socket.on('user:call' , ({to , offer}) =>{
      io.to(to).emit("incomming:call", {from : socket.id , offer});
   });

    socket.on('call:accepted' , ({to , ans})=>{
      io.to(to).emit('call:accepted', {from : socket.id , ans});
    });

    socket.on('peer:nego:needed' , ({to , offer})=>{
      io.to(to).emit('peer:nego:needed', {from : socket.id , offer});
    });

    socket.on('peer:nego:done' , ({to , ans})=>{
      io.to(to).emit("peer:nego:final", {from : socket.id , ans});
    });

});

