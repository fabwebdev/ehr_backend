import dotenv from "dotenv";
import auth from "./src/config/betterAuth.js";
import { fromNodeHeaders } from "better-auth/node";

dotenv.config();

async function testSignInEmailEndpoint() {
  try {
    const email = "admin@example.com";
    const password = "123123";
    
    console.log(`🔍 Testing sign in for: ${email}`);
    console.log("🔧 Using /api/auth/sign-in/email endpoint (Better Auth direct)");
    
    // Try to sign in through Better Auth's direct email endpoint
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
      
      // Check if session was created
      if (response.session) {
        console.log("✅ Session created:");
        console.log(`   Session ID: ${response.session.id}`);
        console.log(`   Expires At: ${response.session.expiresAt}`);
      }
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

testSignInEmailEndpoint();