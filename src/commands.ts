import { db } from "./index.js";
import { createUser, getUserByName, getUserId } from "src/lib/db/queries/users";
import { setUser, getUser, readConfig } from "./config"
import { deleteAllUsers } from "src/lib/db/queries/users";
import { getAllUsers } from "src/lib/db/queries/users";
import { fetchFeed } from "./rss"
import { createFeed, printFeed, getFeeds } from "./lib/db/queries/feeds"
import { createFeedFollow, getFeedByUrl, getFeedFollowsForUser } from "./lib/db/queries/feedFollows";
import { feedFollows } from "./lib/db/schema";
import { eq, and } from "drizzle-orm";
// Command handler type
export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>

// Commands registry type: map of command names to handlers
export type CommandsRegistry = Record<string, CommandHandler>

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length === 0) {
    throw new Error("Username is required for login")
  }

  const username = args[0]
  const existing = await getUserByName(username);
     if (!existing)
	  throw new Error(`User "${username}" does not  exist`);

  setUser(username);
  console.log(`Logged in as "${username}"`);
}

// Register a command
export async function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler
) {
  registry[cmdName] = handler
}


// Run a command
export async function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  const handler = registry[cmdName]
  if (!handler) {
    console.error(`Unknown command: ${cmdName}`)
    process.exit(1)
  }

  try {
    await handler(cmdName, ...args)
  } catch (err: any) {
    console.error(err.message)
    process.exit(1);
  }
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (!args[0]) throw new Error("Username is required");

  const username = args[0];

  const existing = await getUserByName(username);
  if (existing) throw new Error(`User "${username}" already exists`);

  const user = await createUser(username);
  setUser(username);

  console.log(`User "${username}" created!`);
  console.log(user); // for debugging
}

export async function handlerReset(cmdName: string, ...args: string[]) {
  try{
     await deleteAllUsers();
     console.log("Database reset successfully.");
     process.exit(0);
  } catch(err){
    console.error("Error resetting database:", err);
    process.exit(1);
  }
}

export async function handlerList(cmdName: string, ...args: string[]) {
   try{
     const  users = await getAllUsers();
      for(let i = 0; i < users.length; i++){
          if(getUser() == users[i].name){
	    console.log(users[i].name + " (current)"); 
	  }
	 console.log(users[i].name);
      }
        
   } catch(err){
     console.error("Error listing users:", err);
     process.exit(1);
  }
}

export async function handlerAgg(cmdName: string, ...args: string[]) {
  try {

    const feed = await fetchFeed("https://www.wagslane.dev/index.xml")

    console.log(JSON.stringify(feed, null, 2))

  } catch (err) {
    console.error("Error fetching feed:", err)
    process.exit(1)
  }
}

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
  // Join all args except the last one into the name
  const url = args[args.length - 1];
  const name = args.slice(0, args.length - 1).join(" ");
  console.log("url = " + url);
  console.log("name = " + name);  
  if (!name || !url) {
    console.error("Usage: addfeed <name> <url>")
    process.exit(1)
  }
  const config = readConfig();
  const currentUsername = config.currentUserName;
  const user = await getUserByName(currentUsername)
//  const feed = await createFeed(name, url, user.id)
 // Create the feed in the DB
  const feedFollow = await createFeed(name, url, user.id);

  // Automatically follow it for the user
  await createFeedFollow(user.id, feedFollow.id);

  // Print info
  console.log(`${currentUsername} is now following ${feedFollow.name}`);
  printFeed(feedFollow, user)
}

export async function handlerFeeds() {
  const feeds = await getFeeds()

  for (const feed of feeds) {
    console.log(`Name: ${feed.feedName}`)
    console.log(`URL: ${feed.url}`)
    console.log(`User: ${feed.userName}`)
    console.log("----")
  }
}

export async function handlerFollow(cmdName: string, ...args: string[]) {
  const url = args[0];
  if (!url) {
    console.error("Usage: follow <url>");
    process.exit(1);
  }

  const config = readConfig();
  if (!config.currentUserName) {
  	console.error("No user logged in. Please login first.");
 	 process.exit(1);
  }
  const user = await getUserByName(config.currentUserName);
  if (!user) {
    console.error("Current user not found!");
    process.exit(1);
  }

  const feed = await getFeedByUrl(url);
  if (!feed) {
    console.error("Feed not found for URL:", url);
    process.exit(1);
  }

/*const existingFollow = await db
  .select()
  .from(feedFollows)
  .where(
    and(
      eq(feedFollows.userId, user.id),
      eq(feedFollows.feedId, feed.id)
    )
  )
  .limit(1)
  ;
  if (existingFollow.length > 0) {
    console.log(`${user.name} is already following ${feed.name}`);
    return;
  }*/

  const follow = await createFeedFollow(user.id, feed.id);
  console.log(`${follow.userName} is now following ${follow.feedName}`);
}


export async function handlerFollowing() {
  const config = readConfig();
  const user = await getUserByName(config.currentUserName);
    if (!user) {
    console.error("User not found");
    process.exit(1);
  }
  const follows = await getFeedFollowsForUser(user.id);

  for (const f of follows) {
    console.log(f.feedName);
  }
}
