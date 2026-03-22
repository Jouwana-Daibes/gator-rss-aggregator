import { getFeeds, getNextFeedToFetch, markFeedFetched } from "./lib/db/queries/feeds";
import { fetchFeed } from "./rss"; 
/*
export async function scrapeFeeds() {
  const feed = await getNextFeedToFetch();

  if (!feed) {
    console.log("No feeds to fetch yet. Add a feed first!");
    return; // stop early
  }

  console.log(`Fetching feed: ${feed.name}`);

  await markFeedFetched(feed.id);

  const rss = await fetchFeed(feed.url);
console.log("Raw RSS feed:", JSON.stringify(rss, null, 2));
const items =
  rss?.channel?.item
    ? Array.isArray(rss.channel.item)
      ? rss.channel.item
      : [rss.channel.item]
    : [];

if (items.length === 0) {
  console.log("No items in this feed.");
  return;
}
    if (!rss?.channel?.item) {
    console.log("No items found in this feed.");
    return;
  }

    const items = Array.isArray(rss.channel.item)
    ? rss.channel.item
    : [rss.channel.item]; // normalize single-item feeds to array

  for (const item of items) {
    console.log(`- ${item.title}`);
  }
}
*/
export async function parseDuration(durationStr: string): number {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);

  if (!match) throw new Error("Invalid duration");

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case "ms": return value;
    case "s": return value * 1000;
    case "m": return value * 60 * 1000;
    case "h": return value * 60 * 60 * 1000;
  }

  throw new Error("Invalid unit");
}

export async function scrapeFeeds() {
  const feed = await getNextFeedToFetch();

  if (!feed) {
    console.log("No feeds to fetch yet. Add a feed first!");
    return;
  }

  console.log(`Fetching feed: ${feed.name} (${feed.url})`);

  await markFeedFetched(feed.id);

  const rss = await fetchFeed(feed.url);

  console.log("Raw RSS feed:", JSON.stringify(rss, null, 2));

  const items =
    rss?.channel?.item
      ? Array.isArray(rss.channel.item)
        ? rss.channel.item
        : [rss.channel.item]
      : [];

  if (items.length === 0) {
    console.log("No items in this feed.");
    return;
  }

  for (const item of items) {
    console.log(`- ${item.title}`);
  }
}
