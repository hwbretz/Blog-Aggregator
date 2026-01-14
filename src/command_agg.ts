import { scrapeFeeds } from "./lib/db/queries/feeds";
import { fetchFeed } from "./rss";

export async function agg(cmdName: string, ...args: string[]) {

    let time_between_reqs = args[0];

    if(time_between_reqs.length < 2 || time_between_reqs.length > 3){
        throw new Error("bad input");
    }

    const duration = parseDuration(time_between_reqs);
    console.log("Parsed duration (ms):", duration);
    console.log(`Collecting feeds every ${time_between_reqs}`);
    scrapeFeeds().catch(handleError);

    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, duration);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
        console.log("Shutting down feed aggregator...");
        clearInterval(interval);
        resolve();
        });
    });
    /* Original testing implementation
    const feedURL = "https://www.wagslane.dev/index.xml";
    const feed = await fetchFeed(feedURL);
    const feedString = JSON.stringify(feed, null, 2);
    console.log(feedString);
    */
}

function parseDuration(durationStr: string) {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);

    let digit = 10000;
    //convert to milliseconds
    if(match){
        digit = parseInt(match[1]);
        switch (match[2]){
        case 'ms':
            break;
        case 's' :
            digit *= 1000;
            break;
        case 'm':
            digit *= 60000;
            break;
        case 'h':
            digit *= 3600000;
            break;
        }
    } else {
        throw new Error("input missing time format: ms, s, m or h");
    }
    return digit;
    
}

function handleError(error: unknown){
    if (error instanceof Error){
        console.error("Error:", error.message);
  } else {
    // fallback for anything else
    console.error("Unknown error:", error);
  }
    
}