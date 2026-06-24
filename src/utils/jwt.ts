import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (
  payload: JwtPayload,
  secret: string,
  expireIn: SignOptions,
) => {
  const token = jwt.sign(payload, secret, {
    expiresIn: expireIn,
  } as SignOptions);

  return token;
};

const verifyToken = (token: string, secret: string) => {
  try {
    const verifiedtoken = jwt.verify(token, secret);
    return verifiedtoken;
  } catch (err: any) {
    console.log("Token verification failed:", err);
    throw new Error(err.message);
  }
};

export const jwtUtils = {
  createToken,
  verifyToken,
};
