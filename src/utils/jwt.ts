import jwt, { Secret } from "jsonwebtoken";
import CONFIG from "../config/env";
import { getUserByUsernameFromDB } from "../services/user.service";

export const assignJWT = (
  payload: object,
  options?: jwt.SignOptions | undefined
) => {
  const jwtPrivateKey: Secret = CONFIG.JWT_PRIVATE_KEY || "";

  return jwt.sign(payload, jwtPrivateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
};

export const verifyJWT = (accessToken: string) => {
  const jwtPublicKey: Secret = CONFIG.JWT_PUBLIC_KEY || "";

  try {
    const decoded = jwt.verify(accessToken, jwtPublicKey);
    return {
      valid: true,
      expired: false,
      decoded: decoded,
    };
  } catch (error: any) {
    return {
      valid: false,
      expired: error.message === "jwt is expired or not eligible to use",
      decoded: null,
    };
  }
};

export const reassignJWT = async (refreshToken: string) => {
  const { decoded }: any = verifyJWT(refreshToken);

  const user = await getUserByUsernameFromDB(decoded._doc.username);

  if (!user) {
    return null;
  }

  const accessToken = assignJWT({ ...user }, { expiresIn: "1d" });
  return accessToken;
};
