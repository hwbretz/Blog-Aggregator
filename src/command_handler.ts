import { readConfig } from "./config";
import { getUser } from "./lib/db/queries/users";
import { User } from "./lib/db/schema";


type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string,CommandHandler>;


type UserCommandHandler = (
    cmdName: string,
    user: User,
    ...args: string[]
) => Promise<void>;

export type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;

export function middlewareLoggedIn(handler: UserCommandHandler):CommandHandler {
    
    //return the function with no user parameter
    return async (cmdName: string, ...args: string[]) => {
        //get user
        const userName = await readConfig().currentUserName;
        const user = await getUser(userName);
        if (!user) {
            throw new Error(`User ${userName} not found`);
        }
        //call with user
        await handler(cmdName,user,...args);
    };
}



export async function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    
    registry[cmdName] = handler;

}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {

    try{
        
       await registry[cmdName](cmdName, ...args);
        
    } catch (error){
        if (error instanceof Error) {
            console.log(error.message);
        }
        //console.log(`No command matching: ${cmdName}`);
        process.exit(1);
    }
}



