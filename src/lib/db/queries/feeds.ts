import { db } from "../index"
import { feeds, users } from "../schema"
import { eq, sql } from "drizzle-orm"

export async function createFeed(name: string, url: string, userId: string) {
  const result = await db
    .insert(feeds)
    .values({
      name,
      url,
      userId
    })
    .returning()

  return result[0]
}

export function printFeed(feed: Feed, user: User) {
  console.log(`Feed: ${feed.name}`)
  console.log(`URL: ${feed.url}`)
  console.log(`User: ${user.name}`)
}

export async function getFeeds() {
  const result = await db
    .select({
      feedName: feeds.name,
      url: feeds.url,
      userName: users.name,
    })
    .from(feeds)
    .innerJoin(users, eq(feeds.userId, users.id))

  return result
}

/*
export async function markFeedFetched(feedId: string) {
  await db.update(feeds)
    .set({
      lastFetchedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(feeds.id, feedId));
}

export async function getNextFeedToFetch() {
  const result = await db.execute(sql`
    SELECT * FROM feeds
    ORDER BY last_fetched_at NULLS FIRST
    LIMIT 1
  `);

  return result.rows[0];
}
*/

export async function markFeedFetched(feedId: string) {
  const result = await db
    .update(feeds)
    .set({
      lastFetchedAt: new Date(),
    })
    .where(eq(feeds.id, feedId))
    .returning();
    return result[0];
//  return firstOrUndefined(result);
}

export async function getNextFeedToFetch() {
  const result = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchedAt} asc nulls first`)
    .limit(1);
return result[0];
    //  return firstOrUndefined(result);
}
