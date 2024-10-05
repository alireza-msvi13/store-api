import errorHandler from "./middlewares/errors";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from 'helmet';
import cors from "cors"
import path from "path";
import authRoutes from "./modules/auth/auth.router"
import userRoutes from "./modules/user/user.router"
import categoryRoutes from "./modules/category/category.router"
import productRoutes from "./modules/product/product.router"
import commentRoutes from "./modules/comment/comment.router"
const app = express();

// BodyParser
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));

// CookieParser
app.use(cookieParser());

//  cors package
app.use(cors())

// Use Helmet
app.use(helmet());

// Static Folder
app.use(express.static(path.join(__dirname, "public")));


// Routes

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Store Api" })
})

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/category", categoryRoutes);
app.use("/product", productRoutes);
app.use("/comment", commentRoutes);





//* Error Controller
app.use((req, res) => {
    console.log("this path is not available:", req.path);
    res.status(404).json({ message: "404 OOPS! PATH NOT FOUND" });
});
app.use(errorHandler);



export { app }