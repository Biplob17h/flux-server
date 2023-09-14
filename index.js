import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoute.js";
import cors from "cors";
import subscriberRoutes from "./routes/subscriberRoute.js";
import StripeRoute from "./routes/StripeRoute.js";

//pass : mk0dsWGiINJqz77m

const app = express();

//config env
dotenv.config();
const PORT = process.env.PORT || 5050;

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/subscriber", subscriberRoutes);
app.use("/api/v1", StripeRoute);

//rest api
app.get("/", (req, res) => {
  res.send(`<h1>Wellcome to flux server</h1>`);
});

//server run
app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`.bgMagenta);
  connectDB();
});
