import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriends,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router  = express.Router();

//Now we need to read the data therefore we will use the get method to read the data.
router.get("/:id",verifyToken,getUser);
router.get("/:id/friends",verifyToken,getUserFriends);

// Update
router.patch("/:id/:friendId",verifyToken,addRemoveFriends);

export default router;

