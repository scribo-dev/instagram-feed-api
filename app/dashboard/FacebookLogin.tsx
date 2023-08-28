"use client";

export default function FacebookLogin({ token }: { token: string }) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return (
    <div>
      <a
        href={`https://www.facebook.com/v17.0/dialog/oauth?client_id=262115046660775&display=page&extras={"setup":{"channel":"IG_API_ONBOARDING"}}&redirect_uri=${origin}/auth-integration/${token}&response_type=token&scope=instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,pages_show_list,pages_read_engagement`}
        target="_blank"
      >
        Login to Facebook
      </a>
    </div>
  );
}
