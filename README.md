Blog Aggregator

- This is a command line tool for Linux (or WSL, osx, etc.) written in TypeScript for scraping RSS feeds. It stores feed data and user info on a postgreSQL database. 
- Makes use of nodeJS, XMLParser from fast xml parser, and Drizzle ORM for database interaction.
- need to setup a postgreSQL database called gator
- make a .gatorconfig.json file in your home (~) directory with  {"db_url":"postgres://postgres:postgres@localhost:5432/gator?sslmode=disable"}
- boot with npm run start [command [options]],  make sure to register a user first
- Commands:
    * login [name] (used to login by name, name must be a registered user)
	* register [name] (registers a new user then logs them in)
	* reset (deletes all users from database; other records cascade delete from this)
	* users (gets list of all users from database)
	* agg [duration integer ms, s, m, or h] (collects feeds from links current user has followed evry duration i.e. "10m", should be run in background and rest of app used in new terminal window)
	* feeds (gets all feeds added by the current user)	
	* addfeed [FeedName FeedURL] (adds a new feed to database)
	* follow [FeedURL] (follows a feed by url, feed must already be in database to be followed)
	* listFeedFollows (gets feeds followed)
	* unfollow [FeedURL] (unfollows feed)
	* browse [optional:integer] (returns newest feeds limited to 2 unless otherwise specified)

- OR use npm run start tui for a user interface, but still start npm run agg [duration integer ms, s, m, or h] in a separate window first