import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoute.js";
import cors from "cors";
import subscriberRoutes from "./routes/subscriberRoute.js";
import StripeRoute from "./routes/StripeRoute.js";
import fluxStripeRoute from "./routes/fluxStripeRoute.js";
import cartRoutes from "./routes/cartRoutes.js";
import ourstoryRoutes from "./routes/ourstoryRoute.js";

//pass : mk0dsWGiINJqz77m

const app = express();

//config env
dotenv.config();
const PORT = process.env.PORT || 5050;

//middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

//routes
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/subscriber", subscriberRoutes );
app.use("/api/v1",StripeRoute)
app.use("/api/v1/flux", fluxStripeRoute)
// app.use("/api/v1/user", UserRouter);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/ourstory", ourstoryRoutes);

//rest api
app.get("/", (req, res) => {
  res.send(`this is a mern stack project`);
});


//server run
app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`.bgMagenta);
  connectDB();
});
