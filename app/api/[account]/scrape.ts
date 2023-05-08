"use server";

type InstagramImage = {
  slug: string;
  image: string;
  description: string;
  takenAt: Date;
  pinned: boolean;
};

export async function scrape(account: string) {
  let responseRequest = await fetch(
    `https://api.scrape.do/?token=${process.env.SCRAPE_API}&url=https://www.instagram.com/${account}/?__a=1%26__d=dis`,
    { next: { revalidate: 60 * 5 } }
  );

  let response = await responseRequest.json();
  let images: InstagramImage[] =
    response.graphql.user.edge_owner_to_timeline_media.edges.map(
      ({ node }: any) =>
        ({
          slug: node.shortcode,
          image: node.display_url,
          description: node.edge_media_to_caption?.edges[0]?.node?.text,
          takenAt: new Date(node.taken_at_timestamp * 1000),
          pinned: node.pinned_for_users && node.pinned_for_users.length > 0,
        } as InstagramImage)
    );

  return images;
}
