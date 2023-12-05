import * as bcrypt from "bcrypt";

const saltRounds = 10;

export const hashPassword = (string: string) => {
  return bcrypt.hash(string, saltRounds);
};
