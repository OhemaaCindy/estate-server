import express from "express";
// import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js";
import loginRoute from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import "dotenv/config";
import cors from "cors";

// console.log(process.env);

const app = express();
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || process.env.CLIENT_FALLBACK_URL,
//     Credentials: true,
//   })
// );
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = ["http://localhost:5173", "localhost:5173"];
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // Specific origin
  res.header("Access-Control-Allow-Credentials", "true"); // Allow credentials
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

// app.use("/api/posts", postRoute);

app.use("/api/auth", authRoute);
app.use("/api/login", loginRoute);

app.listen(8001, () => {
  console.log("🚀 Server is running! ");
});
