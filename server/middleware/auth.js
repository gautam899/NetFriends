import jwt from "jsonwebtoken";
//Here we will be taking care of the authorisation. Basically means that there are function and API endpoints that a user logged in can hit but not a user who is not logged in.
export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    //If the token does not exist we will send a Access Denied Message to the frontend.
    if (!token) {
      return res.status(403).send("Access Denied");
    }

    //We will take the token and only consider whatever is written after the Bearer Word
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next(); //We will proceed to the next function.
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
