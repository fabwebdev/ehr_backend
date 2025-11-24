import dotenv from "dotenv";
import auth from "./src/config/betterAuth.js";
import { fromNodeHeaders } from "better-auth/node";

dotenv.config();

async function testSignIn() {
  try {
    const email = "admin@example.com";
    const password = "123123";
    
    console.log(`🔍 Testing sign in for: ${email}`);
    
    // Try to sign in through Better Auth
    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: fromNodeHeaders({}),
      cookies: {},
    });
    
    if (response && response.user) {
      console.log("✅ Sign in successful!");
      console.log(`   User ID: ${response.user.id}`);
      console.log(`   User Name: ${response.user.name}`);
      console.log(`   User Email: ${response.user.email}`);
    } else {
      console.log("❌ Sign in failed");
      console.log("   Response:", response);
    }
    
  } catch (error) {
    console.error("❌ Sign in error:", error);
  } finally {
    process.exit(0);
  }
}

testSignIn();