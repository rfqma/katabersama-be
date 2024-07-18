import bcrypt from "bcrypt";

export const encode = (password: string) => {
  return bcrypt.hashSync(password, 10);
};

export const decode = (password: string, encodedPassword: string) => {
  return bcrypt.compareSync(password, encodedPassword);
};
