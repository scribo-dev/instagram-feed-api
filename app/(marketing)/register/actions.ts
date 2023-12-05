"use server";

import * as bcrypt from "bcrypt";
import { prisma } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { hashPassword } from "@/lib/password";

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

    await prisma.apiToken.create({
      data: {
        id: uuidv4(),
        description: "",
        userId: user.id,
      },
    });

    return { data: user };
  } catch (e: any) {
    return { error: e.message };
  }
}
