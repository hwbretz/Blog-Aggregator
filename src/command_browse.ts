import { getPostsForUser } from "./lib/db/queries/feeds";
import { User } from "./lib/db/schema";

export async function browse(cmdName: string, user: User, ...args: string[]) {
    let limit = 5;
    let posts;
    if (args.length >0){
        try {
            limit = parseInt(args[0]);
            posts = await getPostsForUser(user, limit);
        } catch (error) {
            console.log("Error parsing input.");
            posts = await getPostsForUser(user);
        }
    } else {
        posts = await getPostsForUser(user);
    }

    
    for(let post of posts){
        console.log(`Feed: ${post.feedName}`);
        console.log(`Title: ${post.title}`);
        console.log(`Published: ${post.pubDate}`);
        console.log(`Description: ${post.description}`);
    }
}