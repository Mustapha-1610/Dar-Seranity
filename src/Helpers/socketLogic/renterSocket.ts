// socket.js
import { io } from "socket.io-client";

const renterSocket = io("http://localhost:3001/renter");
renterSocket.connect();
export default renterSocket;
