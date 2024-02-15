import * as constants from "./constants";
import express, {Request, Response} from "express";
import mongoose from "mongoose";
import userrouter from "./routes/user"
import apirouter from "./routes/api"
import morgan from "morgan";
import cors from "cors";
import https from 'https';
import http from 'http';
import fs from 'fs';
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const privateKey  = fs.readFileSync(__dirname + '/certs/selfsigned.key', 'utf8');
const certificate = fs.readFileSync(__dirname + '/certs/selfsigned.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Mongoose
mongoose
  .connect(`mongodb+srv://${constants.MONGO_USER}:${constants.MONGO_PASSWORD}@${constants.MONGO_SERVER}/?retryWrites=true&w=majority`, {
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
const porthttp = 3080;
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(porthttp, () => {
  console.log(`HTTP server listening on ${porthttp}`);
});

httpsServer.listen(port, () => {
  console.log(`HTTPS Server running on ${port}`);
});
