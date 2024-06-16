import express from "express";
import cors from "cors";

import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";

import cookieParser from "cookie-parser";
//create an server
const app = express();

//credentials for cookies
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// body parser
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);
app.use("/api/test", testRoute);
app.use("/api/users", userRoute);

app.listen(8000, () => {
  console.log("server started");
});
