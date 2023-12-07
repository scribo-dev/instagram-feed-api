export type InstagramProfile = {
  id: string;
  profile_picture_url: string;
};

export async function getMetrics(account: string) {
  const instagramAccount = await prisma?.instagramAccount?.findFirst({
    where: {
      username: account,
    },
  });

  if (!instagramAccount) return { error: "Instagram account not synched" };

  const profileRequest = await fetch(
    `https://graph.facebook.com/v18.0/${instagramAccount.id}?fields=profile_picture_url&access_token=${instagramAccount?.accessToken}`
  );

  const profile = (await profileRequest.json()) as InstagramProfile;
  return { profile, error: null };
}
