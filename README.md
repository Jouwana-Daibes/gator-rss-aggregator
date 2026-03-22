# Gator - RSS Feed Aggregator CLI
Gator is a CLI tool designed to aggregate RSS feeds, manage users, and interact with a PostgreSQL database. It allows users to register, log in, and fetch posts from various feeds.

# Features
- User Management: Register new users and log in with existing users.
- RSS Feed Aggregation: Add RSS feeds, view summaries of the posts, and manage them through the CLI.
- PostgreSQL Integration: Stores user data and feed information in a PostgreSQL database.

# Prerequisites
Before using Gator, make sure you have the following installed:
- Node.js (>= 16.0.0)
- PostgreSQL (running locally or on a remote server)
- Install Node.js

If you don't have Node.js installed, you can install it by following the official guide.

- Install PostgreSQL
  - **Linux**: Install PostgreSQL using your system's package manager. For example, on Ubuntu:
    ```bash
    sudo apt update
    sudo apt install postgresql postgresql-contrib
    ```
  - **macOS**: You can install PostgreSQL using Homebrew:
    ```bash
    brew install postgresql
    ```
# Installation
```
Clone the repository
```
```
git clone <repository-url>
```
```
cd gator-rss-aggregator
```
```
Install Dependencies
```
```
npm install
```
# Create the Database

Before running the application, create the gator database in PostgreSQL.
```
psql -U postgres
```
```
CREATE DATABASE gator;
```
# Configuration

Create a .gatorconfig.json file in your home directory with the following structure:
```
{
  "db_url": "postgres://<username>:<password>@localhost:5432/gator?sslmode=disable",
  "current_user_name": "your_username"
}
```
Replace <username> and <password> with your PostgreSQL credentials.

# Command Overview

- **register \<username>**:
  This command registers a new user with the specified username. It will check if the user already exists and create a new user in the database if not.
- **login \<username>**:
  This command logs in a user by setting the current_user_name in the configuration. If the user does not exist, it throws an error.
- **users**:
Lists all the users in the PostgreSQL database.
- **addfeed \<name> \<url>**: Add a new RSS feed to the database and automatically follow it with the current user.
    - name → The display name of the feed.
    - url → The RSS feed URL.
    - Adds the feed to the database.
    - Automatically sets the current user as a follower of the feed.
- **follow \<url>**: Follow an existing feed for the current user.
      - url → The RSS feed URL to follow.
      - If the user is already following the feed, a message will indicate it.
- **following**: List all feeds that the current user is following.
- **unfollow \<url>**: Stop following a feed for the current user (Stop following a feed for the current user).
- **agg \<inerval>**: Start the feed aggregator to collect new posts at a given interval.
    - interval → Time between feed fetches (ms, s, m, h).
    - Fetches posts from all feeds and stores them in the database.
    - Runs continuously until interrupted (CTRL+C).
- **browse [limit]**: View the latest posts from feeds the current user follows.
      - limit → Optional. Number of posts to display (default: 2).
      - Shows post titles, URLs, and feed information.
      - Posts are sorted from most recent to oldest.
  ## Notes
  - Make sure a user is logged in before using addfeed, follow, following, unfollow, or browse.
  - The agg command requires feeds to be added first. otherwise, it keeps printing "No feed to fetch"
  - The aggregator will only fetch posts that are not already stored in the database.
  
# Usage
- Start the CLI tool
- To start the Gator CLI tool, use the following commands:
  - Register a new user:
    ```bash
    npm run start register <username>
    ```
  - Log in:
    ```bash
    npm run start login <username>
    ```
  - List all users:
    ```bash
    npm run start users
    ```
  - addfeed:
    ```bash
    npm run start addfeed <name> <url>
    ```
  - follow:
    ```bash
    npm run start follow <url>
    ```
  - following:
    ```bash
    npm run start following
    ```
  - unfollow:
    ```bash
    npm run start unfollow <url>
    ```
   - agg:
     ```bash
     npm run start agg <interval>
     ```
  - browse:
    ```bash
    npm run start browse [limit]
    ``` 
# Adding New Commands
You can extend Gator by adding new commands to the commands.ts file. Follow the existing structure of command handlers to register and run new commands.

# License
This project is licensed under the MIT License - see the LICENSE file for details.
