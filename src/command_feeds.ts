import { readConfig } from "./config";
import { getFeeds } from "./lib/db/queries/feeds";
import { getUserNameById } from "./lib/db/queries/users";


export async function feeds(cmdName: string, ...args: string[]) {
    const result = await getFeeds();
    for (let feed of result){
        let userName = await getUserNameById(feed.user_id);
        console.log(`user: ${userName}`);
        console.log(`${feed.name} - ${feed.url} - ${userName}`);
    }
};