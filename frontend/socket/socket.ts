import { io } from "socket.io-client";

const socket = io(`${process.env.BACKEND_URL}`, {
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;
