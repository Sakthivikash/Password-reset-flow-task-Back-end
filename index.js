import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { userRouters } from "./Routes/routers.js";
import cors from "cors";

const app = express();

dotenv.config();

//Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world!!!!");
});
app.use("/user", userRouters);

//Database Connetion
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
mongoose
  .connect(`${MONGO_URL}`)
  .then(app.listen(PORT))
  .then(() =>
    console.log(`Server is running at ${PORT} port && Mongo is connected`)
  )
  .catch((err) => console.log(err));
