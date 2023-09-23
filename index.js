import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoute.js";
import cors from "cors";
import adminphotoRouter from "./routes/adminPhotoRoutes.js";
import freedom from "./routes/freedomRoute.js";
import village from "./routes/villageRoute.js";
import cartRoutes from "./routes/cartRoutes.js";
import ourstoryRoutes from "./routes/ourstoryRoute.js";
import UserRouter from "./routes/userRoute.js";
import ourstoryRoutes from "./routes/ourstoryRoute.js";


//pass : mk0dsWGiINJqz77m

const app = express();
app.use(express.json());

//config env
dotenv.config();
const PORT = process.env.PORT || 5050;

//middleware
app.use(cors());
app.use(morgan("dev"));


//routes
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/subscriber", subscriberRoutes );
app.use("/api/v1/freedom",freedom)
app.use("/api/v1/village", village)
app.use("/api/v1/store", store)
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/ourstory", ourstoryRoutes);


app.use("/api/v1/adminphoto", adminphotoRouter);

//rest api
app.get("/", (req, res) => {
  res.send(`this is a mern stack project`);
});


//server run
app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`.bgMagenta);
  connectDB();
});
