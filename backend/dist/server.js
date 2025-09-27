"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const socket_1 = require("./utils/socket");
const server = http_1.default.createServer(app_1.default);
(0, socket_1.initSocket)(server);
const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
    await (0, db_1.default)();
    console.log(`🚀 server running on port ${PORT}`);
});
