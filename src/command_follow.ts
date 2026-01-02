import { readConfig } from "./config";
import { createFeedFollow, deleteFollow, getFeed, getFeedFollowsByUser } from "./lib/db/queries/feeds";
import { getUser } from "./lib/db/queries/users";
import { User } from "./lib/db/schema";


export async function follow(cmdName: string, user: User, ...args: string[]) {
    if (args.length < 1){
        throw new Error("Missing arguments for command");
    }

    const url = args[0];
    const feed = await getFeed(url);

    if(!feed){
        throw new Error('Feed not found');
    }

    const feedfollow = await createFeedFollow(url,user);
    console.log(`Feed followed - User: ${feedfollow.userName} - ${feedfollow.feedName} `);
}

export async function unfollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length < 1){
        throw new Error("Missing arguments for command");
    }

    const url = args[0];
    const feed = await getFeed(url);

    if(!feed){
        throw new Error('Feed not found');
    }

    await deleteFollow(feed,user);
    
}

export async function listFeedFollows(cmdName: string, user: User, ...args: string[]) {
    //const config = readConfig();
    //const user = await getUser(config.currentUserName);

    if(!user){
        throw new Error("user not found");
    }

    const feedFollows = await getFeedFollowsByUser(user.id);
    if (feedFollows.length <= 0){
        console.log("No follows found");
        return;
    }

    console.log(`Feed Follows for ${user.id}`);
    for(let feed of feedFollows){
        console.log(`* ${feed.feedName}`);
    }
    
}