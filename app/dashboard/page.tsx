import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, FacebookIcon, RefreshCcw } from "lucide-react";
import { prisma } from "@/lib/db";
import Link from "next/link";
import DisconnectButton from "./components/DisconnectButton";
import AddAccountButton from "./components/AddAccountButton";
import { Metadata } from "next";
import { authOptions } from "@/lib/auth-options";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Page() {
  const session = await getServerSession(authOptions);

  const tokens = await prisma?.apiToken.findMany({
    where: { userId: session?.user?.id },
    include: {
      accounts: true,
    },
  });
  const selectedToken = tokens && tokens[0];
  const clientId = process.env.FACEBOOK_CLIENT_ID;
  const redirectUri = `${process.env.APP_URL}/dashboard/auth-integration`;

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

    let account = (formData.get("account") as string).replace("@", "").trim();
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

  async function disconnect(formData: FormData) {
    "use server";
    await prisma.apiToken.update({
      where: { id: selectedToken?.id },
      data: {
        accounts: {
          disconnect: {
            username: formData.get("account") as string,
          },
        },
      },
    });

    revalidatePath("/dashboard");
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 container">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex gap-2 items-center">
          <h2 className="text-3xl font-bold tracking-tight">Accounts</h2>
          <Badge variant="outline">{selectedToken?.id}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant={"secondary"}>
            <a
              href={`https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&display=page&extras={"setup":{"channel":"IG_API_ONBOARDING"}}&redirect_uri=${redirectUri}&response_type=token&scope=instagram_basic,instagram_manage_insights,pages_show_list,pages_read_engagement,business_management`}
              target="_blank"
            >
              <FacebookIcon size={16} className="mr-2" />
              Sync Facebook
            </a>
          </Button>
          or
          <form action={addAccount} className="flex gap-2">
            <Input name="account" placeholder="Instagram username" />
            <AddAccountButton />
          </form>
        </div>
      </div>
      <div className="pt-4">
        {selectedToken?.accounts?.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Username</TableHead>
                <TableHead className="text-right">Connect</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedToken &&
                selectedToken?.accounts?.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>
                      <Link
                        href={`/dashboard/${account.username}`}
                        className="flex items-center hover:underline"
                      >
                        {account.username}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      {account.accessToken ? (
                        <form action={disconnect}>
                          <Input
                            name="account"
                            defaultValue={account.username}
                            type="hidden"
                          />
                          <DisconnectButton />
                        </form>
                      ) : (
                        <Button asChild>
                          <Link href="/install">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Install Guide
                          </Link>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        ) : (
          <div className="mt-32 flex items-center justify-center flex-col">
            <RefreshCcw size={64} />
            <p className="mt-12 text-zinc-500 text-center">
              No accounts found. Click on the "Connect with Facebook" <br /> to
              select an account
            </p>
            <Button
              asChild
              variant={"default"}
              className="mt-4 bg-blue-700 hover:bg-blue-600"
            >
              <a
                href={`https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&display=page&extras={"setup":{"channel":"IG_API_ONBOARDING"}}&redirect_uri=${redirectUri}&response_type=token&scope=instagram_basic,instagram_manage_insights,pages_show_list,pages_read_engagement,business_management`}
                target="_blank"
              >
                <FacebookIcon size={16} className="mr-2" />
                Connect with Facebook
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
