import { db } from "..";
import { Feed, feed_follows, feeds,posts,User,users } from "../schema";
import { eq,and, sql, asc, desc} from "drizzle-orm";
import { getUser } from "./users";
import { readConfig } from "src/config";
import { fetchFeed, RSSItem } from "src/rss";

export async function createFeed(name: string, url: string, userName: string) {
    const [user] = await db.select().from(users).where(eq(users.name, userName));
    const [feed] = await db.insert(feeds).values({ name: name, url: url, user_id:user.id }).returning();
    printFeed(feed, user);
    return feed;
};

export function printFeed(feed: Feed, user: User) {
    console.log(`Feed: ${feed.name}`);
    console.log(`URL: ${feed.url}`);
    console.log(`Added: ${feed.createdAt}`);
    console.log(`By user: ${user.name} : ${feed.user_id}`);
};

export async function getFeeds() {
    const result = await db.select().from(feeds);
    return result;
};

export async function getFeed(url: string){
    const [feed] = await db.select().from(feeds).where(eq(feeds.url, url));
    return feed;
}

export async function createFeedFollow(url: string, user: User) {
    //const currentUser = readConfig().currentUserName;
    //const user = await getUser(currentUser);
    const feed = await getFeed(url);
    if(!feed){
        console.log("feed not in database");
        process.exit(1);
    }
    const [newFollow] = await db.insert(feed_follows).values({user_id: user.id, feed_id: feed.id}).returning();

    const [jointTable] = await db.select({
        id: feed_follows.id, 
        createdAt: feed_follows.createdAt,
        updatedAt: feed_follows.updatedAt,
        user_id: feed_follows.user_id,
        feed_id: feed_follows.feed_id,
        feedName: feeds.name,
        userName: users.name,
    })
    .from(feed_follows)
    .innerJoin(feeds, eq(feed_follows.feed_id, feeds.id))
    .innerJoin(users, eq(feed_follows.user_id, users.id))
    .where(
        and(
            eq(feed_follows.id, newFollow.id),
            eq(users.id, newFollow.user_id),
        ),
    );
    return jointTable;


};

export async function getFeedFollowsByUser(user_id: string) {
  const result = await db.select({
    id: feed_follows.id,
    createdAt: feed_follows.createdAt,
    updatedAt: feed_follows.updatedAt,
    user_id: feed_follows.user_id,
    feed_id: feed_follows.feed_id,
    feedName: feeds.name,
  }).from(feed_follows)
    .innerJoin(feeds, eq(feed_follows.feed_id, feeds.id))
    .where(eq(feed_follows.user_id,user_id));
    return result;  
};

export async function deleteFollow(feed: Feed, user: User) {
    
    await db.delete(feed_follows).where(and(eq(feed.id,feed_follows.feed_id),eq(user.id,feed_follows.user_id))).returning();
};

export async function markFeedFetched(feed: Feed) {
    await db.update(feeds).set({last_fetched_at: sql`NOW()`, updatedAt: sql`NOW()`}).where(eq(feed.id,feeds.id));
};

export async function getNextFeedToFetch() {
    const [feed] = await db.execute(sql`SELECT * FROM ${feeds} ORDER BY ${feeds.last_fetched_at} ASC NULLS FIRST LIMIT 1`);
    //const [row] = await db.select().from(feeds).orderBy(asc(feeds.last_fetched_at), sql`NULLS FIRST`);
    return feed;
};

export async function scrapeFeeds() {
    const feed : Feed = await getNextFeedToFetch();
    await markFeedFetched(feed);
    const fetchedFeed = await fetchFeed(feed.url);
    for(let item of fetchedFeed.channel.item){
        //console.log(`${item.title}`);
        const testFeed = await getFeed(item.link);
        if(testFeed){
            await createPost(item, feed);
        }
        
    }
};

export async function createPost(post: RSSItem, feed: Feed) {
    //console.log(`****URL:${ post.link}, title: ${post.title}, description: ${post.description}, published_at: ${post.pubDate}, feed_id: ${feed.id}`)
    const published = new Date(post.pubDate);
    const [result] = await db.insert(posts).values({url: post.link, title: post.title, description: post.description, published_at: published, feed_id: feed.id}).returning();
    return result;
};

export async function getPostsForUser(user: User, limit = 2) {

    let query = db.select({title: posts.title, url: posts.url, description: posts.description, pubDate: posts.published_at, feedName: feeds.name}).from(posts)
    .innerJoin(feed_follows, eq(posts.feed_id, feed_follows.feed_id))
    .innerJoin(feeds, eq(posts.feed_id, feeds.id))
    .where(eq(feed_follows.user_id, user.id))
    .orderBy(desc(posts.published_at))
    .limit(limit);

    /*
    if(limit === undefined){
        query = query.limit(limit);
    }
    */

    const result = await query;

    return result;
};