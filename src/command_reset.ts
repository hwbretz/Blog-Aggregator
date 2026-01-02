import { resetRows } from "./lib/db/queries/users";

export async function reset(cmdName: string, ...args: string[]) {
    try {
        await resetRows();
        console.log("All rows from users table deleted");
        process.exit(0);
    } catch (error) {
        console.log("Error deleting rows");
        process.exit(1);
    }
    
};