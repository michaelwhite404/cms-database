import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

import app from "./app";

const DB = process.env.DATABASE!.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD!
);

// Connect to database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"));

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("App running on port " + port);
});