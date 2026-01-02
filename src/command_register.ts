import { handlerLogin } from "./command_login";
import { createUser, getUser } from "./lib/db/queries/users";

export async function register(cmdName: string, ...args: string[]) {
    if(cmdName.toLowerCase() !== "register"){
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

    if(userCheck){
        console.log("User already in database");
        process.exit(1);

    } else {
        const result = await createUser(name);
        console.log(`User registered: ${result.name}`);
        console.log(`id: ${result.id}`);
        console.log(`Created at: ${result.createdAt}`);
        console.log(`Updated at: ${result.updatedAt}`);
        await handlerLogin("login", `${name}`);
    }

    
    
}