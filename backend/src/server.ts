import http from "http";

import app from "./app";
import connectDB from "./config/db";
import { initSocket } from "./utils/socket";

const server = http.createServer(app);

initSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, async()=>{
    await connectDB();
    console.log(`🚀 server running on port ${PORT}`);
})
