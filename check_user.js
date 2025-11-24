import dotenv from "dotenv";
import { db } from "./src/config/db.drizzle.js";
import { users, accounts } from "./src/db/schemas/index.js";
import { eq } from "drizzle-orm";

dotenv.config();

async function checkUser(email) {
  try {
    console.log(`🔍 Checking user with email: ${email}`);
    
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
    console.log(`   Has password: ${!!user.password}`);
    console.log(`   Password preview: ${user.password ? user.password.substring(0, 20) + "..." : "None"}`);
    console.log(`   Created At: ${user.createdAt}`);
    console.log(`   Updated At: ${user.updatedAt}`);
    
    // Check accounts table
    console.log("\n🔍 Checking accounts table...");
    const userAccounts = await db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, user.id));
    
    if (userAccounts.length === 0) {
      console.log("⚠️  No accounts found for this user");
    } else {
      console.log(`✅ Found ${userAccounts.length} account(s):`);
      userAccounts.forEach((account, index) => {
        console.log(`   Account ${index + 1}:`);
        console.log(`     Provider: ${account.providerId}`);
        console.log(`     Has password: ${!!account.password}`);
        console.log(`     Password preview: ${account.password ? account.password.substring(0, 20) + "..." : "None"}`);
      });
    }
    
  } catch (error) {
    console.error("❌ Error checking user:", error);
  } finally {
    process.exit(0);
  }
}

// Use the email from your logs
checkUser("admin@example.com");