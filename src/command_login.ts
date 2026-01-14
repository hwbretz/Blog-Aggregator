import { error } from "node:console";
import { setUser } from "./config";
import { getUser } from "./lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]){
    
    if(cmdName.toLowerCase() !== "login"){
        console.log("error routing command");
        process.exit(1);
    }
    if(!args || args.length <= 0){
        console.log("no command arguments given");
        process.exit(1);
    }
     //check if already in db
    const name = args[0];
    const userCheck = await getUser(name);

    if(userCheck === undefined){
        throw new Error("User not registered");

    } else {
        setUser(name);
        console.log(`User name set to ${name}`);
    }
    
};
