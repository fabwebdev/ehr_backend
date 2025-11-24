import dotenv from "dotenv";
import { db } from "./src/config/db.drizzle.js";
import { users, accounts } from "./src/db/schemas/index.js";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

dotenv.config();

async function createMissingAccountRecord() {
  try {
    const email = "admin@example.com";
    
    console.log(`🔍 Looking for user with email: ${email}`);
    
    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    if (existingUser.length === 0) {
      console.log("❌ User not found in database");
      return;
    }
    
    const user = existingUser[0];
    console.log("✅ User found:");
    console.log(`   ID: ${user.id}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    
    // Check if account already exists
    console.log("\n🔍 Checking if account already exists...");
    const existingAccounts = await db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, user.id));
    
    if (existingAccounts.length > 0) {
      console.log("✅ Account already exists, nothing to do");
      return;
    }
    
    console.log("⚠️  No account found - creating one...");
    
    // Create the account record that Better Auth expects
    // For credential accounts, Better Auth expects:
    // - providerId: "credential"
    // - accountId: usually the email
    // - password: the hashed password (we'll copy it from the users table)
    const newAccount = await db.insert(accounts).values({
      id: nanoid(), // Generate a new ID for the account
      userId: user.id,
      accountId: user.email,
      providerId: "credential",
      password: user.password, // Copy the hashed password from users table
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    console.log("✅ Account record created successfully!");
    console.log(`   Account ID: ${newAccount[0].id}`);
    console.log(`   Provider: ${newAccount[0].providerId}`);
    console.log(`   Account Identifier: ${newAccount[0].accountId}`);
    
    console.log("\n🎉 The admin user should now be able to sign in!");
    console.log("💡 Try signing in with:");
    console.log(`   Email: ${email}`);
    console.log(`   Password: 123123`);
    
  } catch (error) {
    console.error("❌ Error creating account record:", error);
  } finally {
    process.exit(0);
  }
}

createMissingAccountRecord();