import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

// Configurations of middleware
const __filename = fileURLToPath(import.meta.url); //This is to grab the file url.
const __dirname = path.dirname(__filename); // This will return the directory name
dotenv.config(); //This will envoke the .env file.

// Initialize the app and set up middleware
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// File storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

//Routes with files
//Here we will hit the mentioned route and upload a single picture and store it locally in the assets.
app.post("/auth/register", upload.single("picture"), register);

//Now we need to able to allow the user to upload pictures
app.post("/posts", verifyToken, upload.single("picture"), createPost);

// ROutes
app.use("/auth", authRoutes); //This will go to the file auth.js and will prefix with auth/login.

//Now we need three routes. 1. We can pull out the information of the paritcualr user. 2. We can find out the list of friends of the user. 3. We can add and delete friends.
app.use("/users", userRoutes);

//Now we are going to handle the last endpoints i.e the posts.
app.use("/posts", postRoutes);

//MOngoose setup
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    //Now we are going to manually insert the user information. Note: Uncomment the below 2 lines before running the command "npm run start" in the terminal. Also comment the below two line again after the server runs for once.
    //This is to avoid duplicates. Because if the below two lines are not commented again every time you make a change in the server the server will restart and add the users info in the mongodb database.
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
