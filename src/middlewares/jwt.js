import jwt from "jsonwebtoken";

function verifyJWT(req, res, next) {
  const JWT_SECRET = process.env.JWT_SECRET;

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ error: "No token provided" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    return res.status(401).send({ error: "Token Invalid" });
  }

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: "Token Malformatted" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: "Token Invalid" });
    }

    req.infoUser = decoded.infoUser;
    return next();
  });
}

export default verifyJWT;
