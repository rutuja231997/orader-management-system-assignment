"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
const initSocket = (server) => {
    exports.io = io = new socket_io_1.Server(server, {
        cors: {
            origin: "*", //frontend url
            methods: ["GET", "POST", "PUT", "DELETE"]
        }
    });
    io.on("connection", (socket) => {
        console.log("Admin connected:", socket.id);
        socket.on("disconnect", () => {
            console.log("Admin disconnected:", socket.id);
        });
    });
    return io;
};
exports.initSocket = initSocket;
