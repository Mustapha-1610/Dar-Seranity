import axios from "axios";

let connectedRenters: any[] = [];

const renterNameSpaceLogic = (renterNameSpace: any) => {
  renterNameSpace.on("connection", (socket: any) => {
    socket.on("newRenterConnected", (data: any) => {
      const renterExists = connectedRenters.some(
        (renter) => renter.renterMail === data.renterMail
      );
      if (!renterExists) {
        connectedRenters.push({ renterMail: data.renterMail });
        renterNameSpace.emit("userConnected", connectedRenters);
      } else {
        renterNameSpace.emit("userConnected", connectedRenters);
      }
    });
    //
    socket.on("testing", () => {
      renterNameSpace.emit("testRenter");
    });
  });

  renterNameSpace.on("disconnect", (socket: any) => {});
};

export default renterNameSpaceLogic;
