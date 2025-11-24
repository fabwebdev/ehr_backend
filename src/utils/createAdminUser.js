import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { eq, and } from "drizzle-orm";

import { db } from "../config/db.drizzle.js";
import { users, roles, user_has_roles } from "../db/schemas/index.js";

dotenv.config();

function sanitize(value) {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export default async function createAdminUser(
  email,
  password,
  name,
  firstName,
  lastName
) {
  const normalizedEmail = sanitize(email);
  const normalizedPassword = password?.trim();

  if (!normalizedEmail) {
    throw new Error("Email is required");
  }

  if (!normalizedPassword) {
    throw new Error("Password is required");
  }

  const displayName =
    sanitize(name) ||
    [sanitize(firstName), sanitize(lastName)].filter(Boolean).join(" ") ||
    "Admin User";

  const hashedPassword = await bcrypt.hash(normalizedPassword, 10);

  const existingUsers = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  let userId;

  if (existingUsers.length > 0) {
    userId = existingUsers[0].id;

    await db
      .update(users)
      .set({
        name: displayName,
        firstName: sanitize(firstName),
        lastName: sanitize(lastName),
        password: hashedPassword,
        role: "admin",
        emailVerified: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  } else {
    userId = nanoid();

    const now = new Date();
    await db.insert(users).values({
      id: userId,
      name: displayName,
      firstName: sanitize(firstName),
      lastName: sanitize(lastName),
      email: normalizedEmail,
      password: hashedPassword,
      role: "admin",
      emailVerified: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  const adminRole = await db
    .select()
    .from(roles)
    .where(eq(roles.name, "admin"))
    .limit(1);

  if (adminRole.length === 0) {
    throw new Error("Admin role not found in the database");
  }

  const roleId = adminRole[0].id;

  const existingAssignment = await db
    .select()
    .from(user_has_roles)
    .where(
      and(
        eq(user_has_roles.user_id, userId),
        eq(user_has_roles.role_id, roleId)
      )
    )
    .limit(1);

  if (existingAssignment.length === 0) {
    await db.insert(user_has_roles).values({
      user_id: userId,
      role_id: roleId,
    });
  }

  return {
    id: userId,
    email: normalizedEmail,
    name: displayName,
    role: "admin",
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [, , cliEmail, cliPassword, cliName] = process.argv;

  createAdminUser(cliEmail, cliPassword, cliName)
    .then((result) => {
      console.log("Admin user created:", result);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to create admin user:", error);
      process.exit(1);
    });
}
