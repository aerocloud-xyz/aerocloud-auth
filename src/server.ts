import { JWT_SECRET, makeid } from "./constants";
import express, {Request, Response} from "express";
import mongoose from "mongoose";
import userrouter from "./routes/user"
import apirouter from "./routes/api"
import morgan from "morgan";
import cors from "cors";
import http from 'http';
import dotenv from 'dotenv';
const app = express();
dotenv.config();

// Mongoose
mongoose
  .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_SERVER}/?retryWrites=true&w=majority`, {
  })
  .then(() => console.log("Connected to database", "INFO"))
  .catch((err) => {
    console.log("Database setup failed.", "ERROR");
  });

app.use(morgan("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(function (req: Request, res: Response, next: Function) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Routes
app.use("/users", userrouter);
app.use("/api", apirouter);

const port = process.env.PORT || 3001;
const httpServer = http.createServer(app);

httpServer.listen(port, () => {
  console.log(`HTTP server listening on ${port}`);
  makeid();
  console.log(`This time JWT_SECRET is ${JWT_SECRET}`)
});