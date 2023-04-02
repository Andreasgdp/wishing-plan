import { User } from "@wishingplan/db";
import { clerkClient } from "@clerk/nextjs/server";

export async function getClerkUserFromPrismaUser(user: User | null) {
  if (!user) return null;

  const clerkUser = await clerkClient.users.getUser(user.id);
  return clerkUser;
}

export async function getClerkUsersFromListOfPrismaUsers(users: User[] | null) {
  if (!users) return [];

  const clerkUsers = await Promise.all(
    users.map(async (user) => await clerkClient.users.getUser(user.id)),
  );

  return clerkUsers;
}
