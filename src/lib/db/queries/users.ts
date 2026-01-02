import { db } from "..";
import { users } from "../schema";
import { eq} from "drizzle-orm";

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
};

export async function getUser(name: string) {
    const [result] = await db.select().from(users).where(eq(users.name, name));
    return result;
};
export async function getUserNameById(user_id: any) {
  const [result] = await db.select().from(users).where(eq(users.id,user_id));
  return result.name;
}

export async function resetRows() {
  await db.delete(users);
  return;
};

export async function getUsers() {
  const result = await db.select({
    name: users.name
  }).from(users);
  return result;
};