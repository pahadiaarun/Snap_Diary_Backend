import jwt from "jsonwebtoken";

// auth middleware  will confirm or denies a request user want to do
const auth = async (req, res, next) => {
  try {
    // checking if it is the user who is claiming to be
    const token = req.headers.authorization.split(" ")[1];

    // we have 2 tokin the one from googleAuth and our custom token
    const isCustomAuth = token.length < 500;

    // the data that we want to get from token it self
    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, "test");

      // the userId if we are working with our own token
      req.userId = decodedData?.id;
    } else {
      // if we are working with google auth token
      decodedData = jwt.decode(token); //here we don't need the secret

      req.userId = decodedData?.sub; // sub property contains the unique user identifier of the user who signed in it will differentiates every single user
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
