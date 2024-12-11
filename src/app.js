// Importing required modules
import bodyParser from 'body-parser'
import express from "express";
import "dotenv/config";
import cors from "cors";
// routes
import cartRouter from "./routes/cart.route.js";
import productRouter from "./routes/product.route.js";
import userRouter from "./routes/user.route.js";
// routes end
const app = express();

// cors issue
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//cors issue end

// API endpoints

app.use("/api/cart", cartRouter);
app.use("/api/product", productRouter);
app.use("/api/user", userRouter);
export { app };
