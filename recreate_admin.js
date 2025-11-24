import dotenv from "dotenv";
import auth from "./src/config/betterAuth.js";
import { db } from "./src/config/db.drizzle.js";
import { users, accounts } from "./src/db/schemas/index.js";
import { eq } from "drizzle-orm";
import { fromNodeHeaders } from "better-auth/node";

dotenv.config();

async function recreateAdminUser() {
  try {
    const email = "admin@example.com";
    const password = "123123";
    const name = "Admin User";
    
    console.log(`🔍 Checking existing user with email: ${email}`);
    
    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    if (existingUser.length > 0) {
      const user = existingUser[0];
      console.log("⚠️  User already exists:");
      console.log(`   ID: ${user.id}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      
      // Delete the existing user and all related records
      console.log("\n🗑️  Deleting existing user and related records...");
      
      // Delete accounts first (due to foreign key constraints)
      await db.delete(accounts).where(eq(accounts.userId, user.id));
      console.log("✅ Deleted account records");
      
      // Delete the user
      await db.delete(users).where(eq(users.id, user.id));
      console.log("✅ Deleted user record");
    }
    
    console.log("\n🔧 Creating new admin user through Better Auth...");
    
    // Create user through Better Auth's signUpEmail API
    const signUpResponse = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
      headers: fromNodeHeaders({}),
      cookies: {},
    });
    
    if (!signUpResponse || !signUpResponse.user) {
      throw new Error("Failed to create user through Better Auth");
    }
    
    console.log("✅ User created successfully through Better Auth!");
    console.log(`   User ID: ${signUpResponse.user.id}`);
    console.log(`   Name: ${signUpResponse.user.name}`);
    console.log(`   Email: ${signUpResponse.user.email}`);
    
    // Verify account was created
    const userAccounts = await db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, signUpResponse.user.id));
    
    if (userAccounts.length > 0) {
      console.log("✅ Account record automatically created by Better Auth!");
      userAccounts.forEach((account, index) => {
        console.log(`   Account ${index + 1}:`);
        console.log(`     Provider: ${account.providerId}`);
        console.log(`     Account ID: ${account.accountId}`);
      });
    } else {
      console.log("⚠️  No account record found");
    }
    
    console.log("\n🎉 Admin user recreation completed!");
    console.log("💡 You can now sign in with:");
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    
  } catch (error) {
    console.error("❌ Error recreating admin user:", error);
  } finally {
    process.exit(0);
  }
}

recreateAdminUser();