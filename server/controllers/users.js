import User from "../models/User.js";
// Read
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends); //Send it to the frontEnd
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Update->Add and remove friends.
export const addRemoveFriends = async (req, res) => {
  try {
    const { id, friendId } = req.params;//The user id and  the friend's id are in params
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    //If the friends ID is already a part of the user's friends list we want that to be removed.
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    }
    else{
        user.friends.push(friendId);//If they are not included in the friend list then we will push them.
        friend.friends.push(id);//We also push the user into the friend list of the friend.
    }
    //Now we want to save the updated list for both the user and its friend that we have added or removed
    await user.save();
    await friend.save();

    //Now we will format friends.
    const friends = await Promise.all(
        user.friends.map((id) => User.findById(id))
      );
      //Format the friends so that the front end can use it.
      const formattedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
          return { _id, firstName, lastName, occupation, location, picturePath };
        }
      ); 
      res.status(200).json(formattedFriends);

  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
