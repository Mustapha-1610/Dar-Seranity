import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import renterNameSpaceLogic from "../src/renter/renterSocketLogic";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
const serverApp = http.createServer(app);
const io = new Server(serverApp, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

serverApp.listen(3001, () => {
  console.log("Server Running !");
});

const renterNameSpace = io.of("/renter");
renterNameSpaceLogic(renterNameSpace);
export { renterNameSpace };
