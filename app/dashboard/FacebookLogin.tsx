import { Button } from "@/components/ui/button";

export default function FacebookLogin({
  redirectUri,
}: {
  redirectUri: string;
}) {
  const clientId = process.env.FACEBOOK_CLIENT_ID;
  return (
    <Button asChild>
      <a
        href={`https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&display=page&extras={"setup":{"channel":"IG_API_ONBOARDING"}}&redirect_uri=${redirectUri}&response_type=token&scope=instagram_basic,instagram_manage_insights,pages_show_list,pages_read_engagement,business_management`}
        target="_blank"
      >
        Login to Facebook
      </a>
    </Button>
  );
}
