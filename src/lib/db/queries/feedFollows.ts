import { db } from "../index"
import { feedFollows, feeds, users } from "../schema";
import { eq } from "drizzle-orm";

export async function createFeedFollow(userId: string, feedId: string) {
  // Insert the follow
  const [newFollow] = await db.insert(feedFollows)
    .values({ userId, feedId })
    .returning();

  // Join to get feed name and username
  const [result] = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      feedName: feeds.name,
      userName: users.name
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.id, newFollow.id));

  return result;
}

export async function getFeedByUrl(url: string) {
  const [feed] = await db.select().from(feeds).where(eq(feeds.url, url));
  return feed; // returns feed object or undefined
}


export async function getFeedFollowsForUser(userId: string) {
  const follows = await db
    .select({
      feedName: feeds.name,
      userName: users.name
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.userId, userId));

  return follows;
}

export async function deleteFeedFollow(userId: string, feedId: string) {
  await db.delete(feedFollows).where(
    eq(feedFollows.userId, userId),
    eq(feedFollows.feedId, feedId)
  );
}














