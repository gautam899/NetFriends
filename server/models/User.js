//This is where we will actually use the user object
import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    min: 2,
    max: 50,
  },
  lastName: {
    type: String,
    required: true,
    min: 2,
    max: 50,
  },
  email: {
    type: String,
    required: true,
    max: 50,
    unique: true, //The user cannot have duplicate emails.
  },
  password: {
    type: String,
    required: true,
    min: 5,
  },
  picturePath: {
    type: String,
    default:"",
  },
  friends: {
    type: Array,
    default:[],
  },
  location: String,
  occupation:String,
  viewedProfile:Number,
  impressions:Number,
},{timestamps:true});

const Users = mongoose.model("User",UserSchema);
export default Users; 


