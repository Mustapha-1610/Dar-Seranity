// socket.js
import { io } from "socket.io-client";

// Make sure to use the updated environment variable name with "NEXT_PUBLIC_"
const SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_IO_SERVER;

const renterSocket = io(`${SERVER_URL}/renter`);
export default renterSocket;
