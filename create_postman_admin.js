import dotenv from "dotenv";
import auth from "./src/config/betterAuth.js";
import { db } from "./src/config/db.drizzle.js";
import { users, roles, user_has_roles } from "./src/db/schemas/index.js";
import { eq } from "drizzle-orm";
import { fromNodeHeaders } from "better-auth/node";

dotenv.config();

async function createAdminUserViaPostman(email, password, firstName, lastName) {
  try {
    console.log("🔧 Creating admin user for Postman testing...\n");
    
    const name = `${firstName} ${lastName}`;
    
    // Step 1: Create user through Better Auth (same as Postman would do)
    console.log("📝 Step 1: Creating user through Better Auth API...");
    const signUpResponse = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        firstName,
        lastName
      },
      headers: fromNodeHeaders({}),
      cookies: {},
    });
    
    if (!signUpResponse || !signUpResponse.user) {
      throw new Error("Failed to create user through Better Auth");
    }
    
    const userId = signUpResponse.user.id;
    console.log(`✅ User created successfully!`);
    console.log(`   User ID: ${userId}`);
    console.log(`   Email: ${email}`);
    
    // Step 2: Update user with firstName and lastName
    console.log("\n📝 Step 2: Updating user with firstName and lastName...");
    await db
      .update(users)
      .set({
        firstName: firstName,
        lastName: lastName,
      })
      .where(eq(users.id, userId));
    console.log("✅ User updated with firstName and lastName");
    
    // Step 3: Assign admin role
    console.log("\n📝 Step 3: Assigning admin role...");
    
    // Get admin role
    const adminRole = await db
      .select()
      .from(roles)
      .where(eq(roles.name, "admin"))
      .limit(1);
    
    if (adminRole.length === 0) {
      console.log("❌ Admin role not found. Creating it...");
      const newRole = await db
        .insert(roles)
        .values({
          name: "admin",
          guard_name: "web",
        })
        .returning();
      
      const roleId = newRole[0].id;
      console.log(`✅ Admin role created with ID: ${roleId}`);
    } else {
      const roleId = adminRole[0].id;
      console.log(`✅ Admin role found with ID: ${roleId}`);
      
      // Check if user already has admin role
      const existingRoleAssignment = await db
        .select()
        .from(user_has_roles)
        .where(
          eq(user_has_roles.user_id, userId)
        )
        .limit(1);
      
      if (existingRoleAssignment.length > 0) {
        console.log("⚠️  User already has a role assigned.");
      } else {
        // Assign admin role to user
        console.log("\n🔗 Assigning admin role to user...");
        await db.insert(user_has_roles).values({
          user_id: userId,
          role_id: typeof roleId === "string" ? parseInt(roleId) : roleId,
        });
        console.log("✅ Admin role assigned successfully!");
      }
    }
    
    console.log("\n" + "=".repeat(50));
    console.log("✅ ADMIN USER CREATED SUCCESSFULLY FOR POSTMAN!");
    console.log("=".repeat(50));
    console.log("\n📧 Email:    " + email);
    console.log("🔑 Password: " + password);
    console.log("👤 Name:     " + name);
    console.log("\n💡 You can now use these credentials in Postman:");
    console.log("   POST http://localhost:3000/api/auth/sign-in/email");
    console.log("   Body: {\"email\": \"" + email + "\", \"password\": \"" + password + "\"}");
    console.log("=".repeat(50) + "\n");
    
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    console.error("Stack:", error.stack);
  } finally {
    process.exit(0);
  }
}

// Create a fresh admin user for Postman testing
createAdminUserViaPostman(
  "postmanadmin@example.com",
  "PostmanPass123!",
  "Postman",
  "Admin"
);