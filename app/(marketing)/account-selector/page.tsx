import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { CheckIcon, PlusCircleIcon } from "lucide-react";

// export const runtime = "edge";
export const dynamic = "force-dynamic";

type FacebookResponse = {
  data: FacebookAccount[];
};

type FacebookAccount = {
  id: string;
  name: string;
  access_token: string;
  instagram_business_account: {
    id: string;
    name: string;
    username: string;
  };
};

async function getData(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  const res = await fetch(
    `https://graph.facebook.com/v18.0/me/accounts?fields=id%2Cname%2Caccess_token%2Cinstagram_business_account{id,name,username}&access_token=${
      searchParams["long_lived_token"] || searchParams["access_token"]
    }`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return (await res.json()) as FacebookResponse;
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const data = await getData(searchParams);

  const alreadyConnected = await prisma.instagramAccount.findMany({
    select: {
      id: true,
      username: true,
    },
    where: {
      username: {
        in: data?.data
          ?.filter((a) => a.instagram_business_account)
          .map((a) => a.instagram_business_account.username),
      },
    },
  });

  async function connect(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const instagramUsername = formData.get("username") as string;
    const authToken = formData.get("token") as string;
    await prisma.instagramAccount.upsert({
      where: {
        username: instagramUsername,
      },
      create: {
        id: id,
        username: instagramUsername,
        accessToken: authToken,
      },
      update: { id: id, accessToken: authToken, updatedAt: new Date() },
    });
    revalidatePath("/account-selector");
    // mutate data
    // revalidate cache
  }

  return (
    <div className="">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
          Accounts
        </h2>
        <div className="pt-4 flex flex-col divide-y">
          {data?.data
            ?.filter((a) => a.instagram_business_account)
            .map((account) => (
              <form key={account.id} action={connect} className="py-4">
                <div className="flex">
                  <span className="flex-1 font-medium">
                    {account.instagram_business_account.username}
                  </span>
                  <input
                    name="id"
                    defaultValue={account.instagram_business_account.id}
                    hidden
                  />
                  <input
                    name="username"
                    defaultValue={account.instagram_business_account.username}
                    hidden
                  />
                  <input
                    name="token"
                    defaultValue={account.access_token}
                    hidden
                  />
                  {alreadyConnected.find(
                    (a) => a.id === account.instagram_business_account.id
                  ) ? (
                    <Button variant="outline" disabled={true}>
                      <CheckIcon className="h-4 w-4 mr-2" />
                      Connected
                    </Button>
                  ) : (
                    <Button type="submit">
                      <PlusCircleIcon className="h-4 w-4 mr-2" />
                      connect
                    </Button>
                  )}
                </div>
              </form>
            ))}
        </div>
      </div>
    </div>
  );
}
