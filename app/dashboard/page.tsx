import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import FacebookLogin from "./FacebookLogin";
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
import { PlusIcon, CheckIcon } from "lucide-react";

export default async function Page() {
  const session = await getServerSession(authOptions);

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

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 container">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex gap-2 items-center">
          <h2 className="text-3xl font-bold tracking-tight">Accounts</h2>
          <Badge variant="outline">{selectedToken?.id}</Badge>
        </div>
        <div className="flex items-center space-x-2">
          {!selectedToken ? (
            <form action={create}>
              <Input name="value" defaultValue={uuidv4()} hidden />
              <Button type="submit">Get started</Button>
            </form>
          ) : (
            <div>
              <form action={addAccount} className="flex gap-2">
                <Input name="account" placeholder="Instagram username" />
                <Button type="submit">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
      <div className="">
        <div className="pt-4">
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
                    <TableCell>{account.username}</TableCell>
                    <TableCell className="text-right">
                      {account.accessToken ? (
                        <Button variant="outline" disabled={true}>
                          <CheckIcon className="h-4 w-4 mr-2" />
                          Connected
                        </Button>
                      ) : (
                        <FacebookLogin token={selectedToken.id} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
