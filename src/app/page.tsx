"use client";
import renterSocket from "@/Helpers/socketLogic/renterSocket";
export default function Home() {
  renterSocket.on("testRenter", () => {});
  return (
    <div>
      <h1>Hello test</h1>
    </div>
  );
}
