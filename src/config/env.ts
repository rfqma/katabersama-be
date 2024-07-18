import "dotenv/config";

const CONFIG = {
  MONGODB_URL: process.env.MONGODB_URL,
  JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY,
  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
};

export default CONFIG;
