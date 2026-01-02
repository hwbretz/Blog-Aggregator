import { error } from "console";
import fs from "fs";
import os from "os";
import path from "path";

type Config = {
	dbUrl: string,
	currentUserName: string,
};

export function setUser(name: string) {
	let cfg: Config = readConfig();
	cfg.currentUserName = name;
	writeConfig(cfg);
};

export function readConfig(): Config {
	const readFile = fs.readFileSync(getConfigFilePath(),{encoding:'utf-8'});
	const input = JSON.parse(readFile);
	//to go between camel_case and snakeCase
	const jsonObj: Config = {
		dbUrl: input.db_url,
		currentUserName: input.current_user_name
	};
	return validateConfig(jsonObj);
};

function getConfigFilePath(): string {
	return path.join(`${os.homedir()}`,'./.gatorconfig.json');
};

function writeConfig(cfg: Config): void {
	//write back to camel_case
	const jsonObj = {
		db_url : cfg.dbUrl,
		current_user_name: cfg.currentUserName
	};
	const configData = JSON.stringify(jsonObj);
	fs.writeFileSync(getConfigFilePath(),configData);
};

function validateConfig(rawConfig: any): Config {
	
	try {
		// starting file has no username
		const url = rawConfig.db_Url;
	} catch (err) {
		console.log("ERROR: ",err);
	}
	return rawConfig;
}



