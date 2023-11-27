"use server";

import * as bcrypt from "bcrypt";
import { prisma } from "@/lib/db";

const saltRounds = 10;

export async function register(name: string, email: string, password: string) {
  if (password.length < 6) {
    return {
      error: "password length should be more than 6 characters",
    };
  }
  try {
    const hash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, password: hash },
    });

    return { data: user };
  } catch (e: any) {
    return { error: e.message };
  }
}

export const hashPassword = (string: string) => {
  return bcrypt.hash(string, saltRounds);
};
