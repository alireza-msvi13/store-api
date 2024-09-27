import mongoose from "mongoose";
import { config } from "dotenv";
import { app } from "./app";

// Load env
config();

//  Database connection

(async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI as string,{
      authSource: "admin",
    });
    console.log(`MongoDB Connected: ${connect.connection.host}`);
  } catch (err) {
    //?error catch
    console.log(err);
    process.exit(1);
  }
})();

// running server

const port = process.env.PORT || 3000;
const productionMode = process.env.NODE_ENV === 'production'

app.listen(port, () => {
  console.log(`Server running in ${productionMode?"production":"development"} mode on port ${port}`);
});
