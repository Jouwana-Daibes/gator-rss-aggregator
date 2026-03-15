import { db } from "../index"
import { feeds, users } from "../schema"
import { eq } from "drizzle-orm"

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
