import { XMLParser } from "fast-xml-parser";

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};


export async function fetchFeed(feedURL: string) {
  //fetch rss feed
  const feedData = await fetch(feedURL, {
    method: "GET",
    headers: {
      'User-Agent': 'gator',
      accept: "application/rss+xml",
    },
  });

  // make sure http response ok
  if (!feedData.ok) {
  throw new Error(`failed to fetch: ${feedData.status} ${feedData.statusText}`);
  }
  //convert to text and parse xml string into json
  const xml = await feedData.text();
  const parser = new XMLParser();
  let jsonObj = parser.parse(xml);

  //make sure rss channel is there
  const channel = jsonObj.rss?.channel;

  if(!channel){
    throw new Error("could not parse channel");
  }

  if(
    !channel.title ||
    !channel.link ||
    !channel.description ||
    !channel.item
  ) {
    throw new Error("could not parse channel data");
  }

  //make sure channel.item has array of items
  const items: any[] = Array.isArray(channel.item) ? channel.item : [channel.item];

  const rssItems: RSSItem[] = [];

  for (let item of items){
    if(!item.title || !item.link || !item.description || !item.pubDate) {
      continue;
    }
    //push rss object
    rssItems.push({
      title: item.title,
      link: item.link,
      description: item.description,
      pubDate: item.pubDate,
    });

  }
  const feed :RSSFeed = {
    channel: {
    title: channel.title,
    link: channel.link,
    description: channel.description,
    item: rssItems,
    }
  }

  return feed;

}