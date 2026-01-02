import { readConfig } from "./config";
import { createFeed, createFeedFollow, printFeed } from "./lib/db/queries/feeds";
import { getUser } from "./lib/db/queries/users";
import { User } from "./lib/db/schema";

export async function addfeed(cmdName: string, user: User, ...args: string[]) {
    //const currentUser = readConfig().currentUserName;

    if(!args || args.length <= 0){
            console.log("no command arguments given");
            process.exit(1);
    }
    if(args.length < 2){
        console.log("missing feed info");
        process.exit(1);
    }

    const feedName = args[0];
    const feedURL = args[1];

    const result = await createFeed(feedName,feedURL,user.name);
    //const user = await getUser(currentUser);
    const feedFollow = await createFeedFollow(result.url, user);
    console.log(`Feed followed - User: ${feedFollow.userName} - ${feedFollow.feedName} `);
    printFeed(result, user);

    return;
};