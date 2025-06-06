import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.middlewares.js";
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import messageRouter from "./routes/msg.routes.js";
import fileUpload from "express-fileupload";
import cloudinary from "cloudinary";
import appointmentRouter from "./routes/appoinment.routes.js";
import chatRouter from "./routes/chat.routes.js";

import healthRecordsRouter from "./routes/healthRecords.js";

try {
  dotenv.config({ path: "./.env", debug: true });
  console.log("dotenv loaded");
} catch (error) {
  console.error("Error loading dotenv or environment variables:", error);
}

const app = express();
const PORT = process.env.PORT || 8000;

//middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    credentials: true,
    exposedHeaders: ["Set-Cookie"]
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/v1", healthRecordsRouter);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

//db connection
const uri = `${process.env.ATLAS_URI}/hms`;
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(uri)
    .then(() =>
      console.log(`connected to MongoDB on: ${mongoose.connection.host}`)
    )
    .catch((err) => {
      console.log("Error connecting to MongoDB!!\n", err);
      process.exit(1);
    });
}

//routes
app.get("/", (req, res) =>
  res.json({ message: "Welcome to the root of the server" })
);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/appoinments", appointmentRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/health-records", healthRecordsRouter);

//error-middleware
app.use(errorMiddleware);

//cloudinary inita
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Only start the server if this file is run directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () =>
    console.log(`server is running on: http://localhost:${PORT}`)
  );
}

export { app };
