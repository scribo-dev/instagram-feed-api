import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { revalidatePath } from "next/cache";

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
    `https://graph.facebook.com/v17.0/me/accounts?fields=id%2Cname%2Caccess_token%2Cinstagram_business_account{id,name,username}&access_token=${searchParams["long_lived_token"]}`,
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
  const token = searchParams["apiToken"] as string;

  const alreadyConnected = await prisma.instagramAccount.findMany({
    select: {
      id: true,
      username: true,
    },
    where: {
      username: {
        in: data.data.map((a) => a.instagram_business_account.username),
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
        username_apiTokenId: { apiTokenId: token, username: instagramUsername },
      },
      create: {
        id: id,
        username: instagramUsername,
        accessToken: authToken,
        apiTokenId: token,
      },
      update: { id: id, accessToken: authToken, updatedAt: new Date() },
    });
    revalidatePath("/account-selector");
    // mutate data
    // revalidate cache
  }

  return (
    <div className="">
      <div className="mx-auto max-w-7xl divide-y divide-gray-900/10 px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
          Accounts
        </h2>
        {token ? (
          <div className="pt-4">
            {data?.data?.map((account) => (
              <form key={account.id} action={connect}>
                <div className="flex">
                  <span className="flex-1">
                    {account.instagram_business_account.name}
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
                    "connected with success"
                  ) : (
                    <button type="submit">connect</button>
                  )}
                </div>
              </form>
            ))}
          </div>
        ) : (
          <div>token not found</div>
        )}
      </div>
    </div>
  );
}
