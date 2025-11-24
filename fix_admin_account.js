import dotenv from "dotenv";
import auth from "./src/config/betterAuth.js";
import { db } from "./src/config/db.drizzle.js";
import { users, accounts } from "./src/db/schemas/index.js";
import { eq } from "drizzle-orm";
import { fromNodeHeaders } from "better-auth/node";

dotenv.config();

async function fixAdminUserAccount() {
  try {
    const email = "admin@example.com";
    const password = "123123";
    const name = "Admin User";
    
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
    console.log(`   Has password in users table: ${!!user.password}`);
    
    // Check if account exists for this user
    console.log("\n🔍 Checking accounts table...");
    const userAccounts = await db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, user.id));
    
    if (userAccounts.length === 0) {
      console.log("⚠️  No accounts found for this user - this is the issue!");
      console.log("🔧 Better Auth looks for credentials in the accounts table, not users table");
      console.log("💡 To fix this, we need to either:");
      console.log("   1. Create an account record for this user, or");
      console.log("   2. Recreate the user through Better Auth properly");
      
      console.log("\n🔧 Option 1: Try to create account record manually...");
      
      try {
        // Try to create account through Better Auth's internal method
        const signUpResponse = await auth.api.signUpEmail({
          body: {
            email,
            password,
            name,
          },
          headers: fromNodeHeaders({}),
          cookies: {},
        });
        
        if (signUpResponse && signUpResponse.user) {
          console.log("✅ Better Auth recreated the user successfully!");
          console.log("   This should have created both user and account records properly");
          
          // Check if we now have an account
          const updatedAccounts = await db
            .select()
            .from(accounts)
            .where(eq(accounts.userId, signUpResponse.user.id));
            
          if (updatedAccounts.length > 0) {
            console.log("✅ Account record now exists!");
            updatedAccounts.forEach((account, index) => {
              console.log(`   Account ${index + 1}:`);
              console.log(`     Provider: ${account.providerId}`);
              console.log(`     Account ID: ${account.accountId}`);
            });
          } else {
            console.log("⚠️  Still no account record found");
          }
        }
      } catch (error) {
        console.log("⚠️  Better Auth recreation failed:", error.message);
        console.log("💡 This might be because the user already exists with the same email");
      }
      
    } else {
      console.log(`✅ Found ${userAccounts.length} account(s):`);
      userAccounts.forEach((account, index) => {
        console.log(`   Account ${index + 1}:`);
        console.log(`     Provider: ${account.providerId}`);
        console.log(`     Account ID: ${account.accountId}`);
        console.log(`     Has password: ${!!account.password}`);
      });
      
      // Check if we have a credential account
      const credentialAccount = userAccounts.find(acc => acc.providerId === "credential");
      if (!credentialAccount) {
        console.log("⚠️  No credential account found");
      } else {
        console.log("✅ Credential account already exists");
      }
    }
    
  } catch (error) {
    console.error("❌ Error checking admin user account:", error);
  } finally {
    process.exit(0);
  }
}

fixAdminUserAccount();