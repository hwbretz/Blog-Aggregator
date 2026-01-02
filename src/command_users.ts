import { readConfig } from "./config";
import { getUsers } from "./lib/db/queries/users";

export async function users(cmdName: string, ...args: string[]) {
    const currentUser = readConfig().currentUserName;
    const result = await getUsers();
    for (let user of result){
        let outString = user.name === currentUser ? `* ${user.name} (current)`: `* ${user.name}`;
        console.log(outString);
    }
};