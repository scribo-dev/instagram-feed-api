import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

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

  async function create(formData: FormData) {
    "use server";
  }

  return (
    <div className="">
      <div className="mx-auto max-w-7xl divide-y divide-gray-900/10 px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
          Dashboard
        </h2>

        <div className="pt-4">
          Hello {session?.user?.name}
          <form action={create}>
            <input name="account" />
            <button type="submit">add</button>
          </form>
          <a
            href={`https://www.facebook.com/v17.0/dialog/oauth?client_id=262115046660775&display=page&extras={"setup":{"channel":"IG_API_ONBOARDING"}}&redirect_uri=http://localhost:3000/auth-integration&response_type=token&scope=instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,pages_show_list,pages_read_engagement`}
          >
            Login to Facebook
          </a>
        </div>
      </div>
    </div>
  );
}
