import mongoose from "mongoose";

mongoose.connect(process.env.DB || "mongodb://localhost/sharenergy");
mongoose.Promise = global.Promise;

export default mongoose;
