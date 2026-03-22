import {
  CommandsRegistry,
  registerCommand,
  runCommand,
  handlerLogin,
  handlerRegister,
  handlerReset,
  handlerList,
  handlerAgg,
  handlerAddFeed,
  handlerFeeds,
  handlerFollow,
  handlerFollowing,
  middlewareLoggedIn,
  handlerUnfollow,
  handlerBrowse,
} from "./commands.js";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { schema } from "./lib/db/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function main() {
  const registry: CommandsRegistry = {}

  registerCommand(registry, "login", handlerLogin)
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "reset", handlerReset);
  registerCommand(registry, "users", handlerList);
  registerCommand(registry, "agg", handlerAgg)
  registerCommand(registry, "addfeed", middlewareLoggedIn(handlerAddFeed))
  registerCommand(registry, "follow", middlewareLoggedIn(handlerFollow))
  registerCommand(registry, "following", middlewareLoggedIn(handlerFollowing))
  registerCommand(registry, "unfollow", middlewareLoggedIn(handlerUnfollow));
  registerCommand(registry,"browse",middlewareLoggedIn(handlerBrowse));

const args = process.argv.slice(2)

  if (args.length === 0) {
    console.error("Not enough arguments")
    process.exit(1)
  }

  const cmdName = args[0]
  const cmdArgs = args.slice(1)

  try {
    await runCommand(registry, cmdName, ...cmdArgs)
  } catch (err: any) {
    console.error(err.message)
    process.exit(1)
  }

  process.exit(0);
}

export const db = drizzle(pool, { schema });

main()
