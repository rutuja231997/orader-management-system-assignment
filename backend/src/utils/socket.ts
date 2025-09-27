import { Server } from "socket.io";

let io: Server;

export const initSocket = (server: any)=>{
    io = new Server(server, {
        
        cors:{
            origin: "*", //frontend url
            methods:["GET","POST","PUT","DELETE"]
        }
    });

    io.on("connection", (socket)=>{
        console.log("Admin connected:", socket.id);
    
        socket.on("disconnect", ()=>{
            console.log("Admin disconnected:", socket.id);
        })
    })

    return io;
}

export {io}; //this will be imported in controllers