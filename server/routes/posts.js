import express from "express";
import {getFeedPosts,getUserPosts,likePost} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

//Read
router.get("/",verifyToken,getFeedPosts);//This will give us every single post of the user on the home page.
router.get("/:userId/posts",verifyToken,getUserPosts);//This will only grab the post relevant to the user.
// Update
router.patch("/:id/like",verifyToken,likePost);

export default router;