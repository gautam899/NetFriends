// Here we we will setting up the Redux Toolkit slice for managing authentication and user data in a Redux store.

// createSlice is a function from Redux Toolkit that generates action creators and action types that correspond to the reducers and state.
import { createSlice } from "@reduxjs/toolkit";

// This is the initial state of the application. It includes the mode (light or dark), user data, authentication token, and posts.
const initialState = {
  mode: "light", //This is going to define our mode from light mode or dark mode
  user: null,
  token: null, //Auth workflow.
  posts: [], //Whatever post we need.
};

// The createSlice function is called with an object that includes the name of the slice, the initial state, and an object of reducer functions.
export const authSlice = createSlice({
  name: "auth",
  initialState,

  // Reducers are functions that determine changes to the state. Each function corresponds to a different action that could be taken. In this case, there are actions for setting the mode, logging in and out, setting friends, and setting posts.
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light"; //If the mode is light it will turn dark and if it is dark it will turn light
    },
    setLogin: (state, action) => {
      //So basically we are sending parameters
      state.user = action.payload.user; //We are sending a user parameter from this function.
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null; //When we logout we set everything to null.
    },
    setFriends: (state, action) => {
      //If the user already exist. We will set the friends inside the state.
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("User friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      //So we are going to grab all the posts and map to each one of those and if post id is same as the current post id that we are sending into this function then we return the post
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
  },
});

//Now we are exporting the action and the reducer so that they can be used elsewhere in the application.
export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } =
  authSlice.actions;
export default authSlice.reducer;
