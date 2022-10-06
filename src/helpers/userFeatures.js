import jwt from "jsonwebtoken";

function generateToken(id, name, type) {
  const JWT_SECRET = process.env.JWT_SECRET;

  return jwt.sign(
    {
      infoUser: {
        id,
        name,
        type,
      },
    },
    JWT_SECRET,
    {
      expiresIn: 86400, // 24 hours
    }
  );
}

export default generateToken;
