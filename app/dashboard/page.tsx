import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { revalidate } from "../api/[account]/route";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/db";

import FacebookLogin from "./FacebookLogin";

// export const runtime = "edge";

export const metadata: Metadata = {
  title: "FAQ | Instagram Feed API",
  description: "Common questions about Instagram Feed API",
};

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const tokens = await prisma?.apiToken.findMany({
    where: { userId: session?.user?.id },
    include: {
      accounts: true,
    },
  });
  const selectedToken = tokens && tokens[0];

  async function create(formData: FormData) {
    "use server";

    if (!session?.user) throw new Error("Unauthorized");

    await prisma?.apiToken.create({
      data: {
        id: formData.get("value") as string,
        description: formData.get("description") as string,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard");
  }

  async function addAccount(formData: FormData) {
    "use server";
    if (!session?.user) throw new Error("Unauthorized");

    if (!selectedToken) throw new Error("No token found");

    let account = formData.get("account") as string;
    await prisma?.apiToken.update({
      where: { id: selectedToken?.id },
      data: {
        userId: session.user.id,
        accounts: {
          connectOrCreate: {
            where: {
              username: account,
            },
            create: {
              username: account,
            },
          },
        },
      },
    });

    revalidatePath("/dashboard");
  }

  return (
    <div className="">
      <div className="mx-auto max-w-7xl divide-y divide-gray-900/10 px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
          Dashboard
        </h2>

        <div className="pt-4">
          Hello {session?.user?.name}
          {!selectedToken ? (
            <form action={create}>
              <input name="value" defaultValue={uuidv4()} hidden />
              <button type="submit">Get started</button>
            </form>
          ) : (
            <div>
              <span>{selectedToken.id}</span>

              <form action={addAccount}>
                <input name="account" />
                <button type="submit">Add account</button>
              </form>
            </div>
          )}
          {selectedToken &&
            selectedToken?.accounts?.map((account) => (
              <div key={account.id} className="flex gap-2">
                {account.username}
                {account.accessToken ? (
                  "connected"
                ) : (
                  <FacebookLogin token={selectedToken.id} />
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
