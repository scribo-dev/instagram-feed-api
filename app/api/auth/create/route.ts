import * as bcrypt from "bcrypt";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

const saltRounds = 10;

export async function POST(req: NextRequest) {
  let errors = [];
  const { name, email, password } = await req.json();

  if (password.length < 6) {
    errors.push("password length should be more than 6 characters");
    return new Response(JSON.stringify({ errors }), { status: 400 });
  }
  try {
    const hash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, password: hash },
    });
    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return new Response(JSON.stringify({ message: e.message }), {
          status: 400,
        });
      }
      return new Response(JSON.stringify({ message: e.message }), {
        status: 400,
      });
    }
  }
}

export const hashPassword = (string: string) => {
  return bcrypt.hash(string, saltRounds);
};
