import {handlerLogin} from "./command_login";
import { register } from "./command_register";
import { CommandsRegistry, registerCommand, runCommand, middlewareLoggedIn } from "./command_handler.js";
import {setUser,readConfig} from "./config.js";
import { reset } from "./command_reset";
import { users } from "./command_users";
import { agg } from "./command_agg";
import { addfeed } from "./command_addfeed";
import { feeds } from "./command_feeds";
import { follow, listFeedFollows, unfollow } from "./command_follow";
import { getUser } from "./lib/db/queries/users";
import { browse } from "./command_browse";

async function main(){
	if(!process.argv[2]){
		console.log("No command given");
		process.exit(1);
	}

	let registry: CommandsRegistry={};
	await registerCommand(registry, "login", handlerLogin);
	await registerCommand(registry, "register", register);
	await registerCommand(registry, "reset",reset);
	await registerCommand(registry, "users",users);
	await registerCommand(registry, "agg", agg);
	await registerCommand(registry, "feeds", feeds);	

	await registerCommand(registry, "addfeed", middlewareLoggedIn(addfeed));
	await registerCommand(registry, "follow", middlewareLoggedIn(follow));
	await registerCommand(registry, "following", middlewareLoggedIn(listFeedFollows));
	await registerCommand(registry, "unfollow", middlewareLoggedIn(unfollow));
	await registerCommand(registry, "browse", middlewareLoggedIn(browse));

	const cmdName = process.argv[2].toLowerCase();
	const args = process.argv.slice(3);
	await runCommand(registry, cmdName, ...args);
	process.exit(0);
}

main();
