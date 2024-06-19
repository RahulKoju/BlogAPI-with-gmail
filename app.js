require("dotenv").config();
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const { connectToDB } = require("./connection");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const { renderHomePage }=require("./controller/home");
const { checkForAuthentication, setUserValue } = require("./middlewares/authentication");
const PORT = process.env.PORT ||8001;

const app = express();

connectToDB(process.env.MONGODB_URL).then(() => {
  console.log("MongoDB connected");
});

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication("token"));
app.use(setUserValue());
app.use(express.static("./public"));

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.get("/", renderHomePage);

app.listen(PORT, () => {
  console.log(`server started at port:${PORT}`);
});
