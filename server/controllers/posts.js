import Post from "../models/Post.js";
import User from "../models/User.js";
// Create
export const createPost = async (req, res) => {
  try {
    //We need the userWho is passing it, description,picturePath
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    //Now we need to save the post.
    await newPost.save();

    //Now we can grab all the posts and we now return so that the frontend can get the updated list of the posts.
    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

// Read
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params; //Get the specific userId from the req parameters
    const post = await Post.find({ userId });
    res.status(200).json(post); //Send the posts back to the frontend.
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// update
export const likePost = async (req, res) => {
  try {
    const { id } = req.params; //Here we are extracting the id from the request parameters. This Id is the identifier of the post that user want to like or unlike.
    const { userId } = req.body; //This is the identifier of the user who is liking or unliking the posts.
    const post = await Post.findById(id); //Grab the post with the specified if "id"
    const isLiked = post.likes.get(userId); //Here we are checking if the user have liked the post. If yes, isLiked will be true else it will be undefined.

    if (isLiked) {
      post.likes.delete(userId); //Delete if it already exist else sets it if it alrady exist.
    } else {
      post.likes.set(userId, true);
    }
    //Now we need to update the likes of the post and get the updated post.
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    //Returning the updated data to the frontEnd or the client with status code 200 i.e the request was successfull.
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
