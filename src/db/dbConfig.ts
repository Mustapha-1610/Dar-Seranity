import mongoose from "mongoose";

let connected = false;

export async function connect() {
  if (connected) {
    return;
  }

  try {
    mongoose.connect(process.env.Mongo_Url!);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB connected successfully");
      connected = true;
    });

    connection.on("error", (err) => {
      console.log(
        "MongoDB connection error. Please make sure MongoDB is running. " + err
      );
      process.exit();
    });
  } catch (error) {
    console.log("Something went wrong!");
    console.log(error);
  }
}
