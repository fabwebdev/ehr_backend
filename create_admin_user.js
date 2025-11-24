import dotenv from "dotenv";
import auth from "./src/config/betterAuth.js";
import { db } from "./src/config/db.drizzle.js";
import { users, roles, user_has_roles } from "./src/db/schemas/index.js";
import { eq, and } from "drizzle-orm";
import { fromNodeHeaders } from "better-auth/node";

dotenv.config();

/**
 * Script to create an admin user with Better Auth
 * This creates a user through Better Auth's API and assigns the admin role
 */

async function createAdminUser(
  email,
  password,
  name,
  firstName,
  lastName
) {
  try {
    console.log("🔧 Creating admin user...\n");

    // Use provided credentials or defaults
    email = email || "admin@ehrsystem.com";
    password = password || "Admin@123456"; // Strong password
    name = name || "System Administrator";
    const [derivedFirst, ...restName] = (name || "").trim().split(" ");
    const safeFirstName = firstName || derivedFirst || "Admin";
    const safeLastName =
      lastName || (restName.length > 0 ? restName.join(" ") : "User");

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    let userId;

    if (existingUser.length > 0) {
      console.log("⚠️  User already exists with this email.");
      userId = existingUser[0].id;
      console.log(`   User ID: ${userId}`);
    } else {
      // Create user using Better Auth's signUpEmail API
      console.log("📝 Creating new user through Better Auth...");
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

      userId = signUpResponse.user.id;
      console.log(`✅ User created successfully!`);
      console.log(`   User ID: ${userId}`);

      // Update user with firstName and lastName
      await db
        .update(users)
        .set({
          firstName: safeFirstName,
          lastName: safeLastName,
        })
        .where(eq(users.id, userId));
      console.log(`✅ Updated user with firstName and lastName`);
    }

    // Get admin role
    console.log("\n🔍 Finding admin role...");
    const adminRole = await db
      .select()
      .from(roles)
      .where(eq(roles.name, "admin"))
      .limit(1);

    if (adminRole.length === 0) {
      console.log("❌ Admin role not found. Creating it...");
      // Create admin role if it doesn't exist
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
          and(
            eq(user_has_roles.user_id, userId),
            eq(user_has_roles.role_id, roleId)
          )
        )
        .limit(1);

      if (existingRoleAssignment.length > 0) {
        console.log("⚠️  User already has admin role assigned.");
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
    console.log("✅ ADMIN USER CREATED SUCCESSFULLY!");
    console.log("=".repeat(50));
    console.log("\n📧 Email:    " + email);
    console.log("🔑 Password: " + password);
    console.log("\n💡 You can now log in with these credentials.");
    console.log("=".repeat(50) + "\n");
    
    return {
      email,
      password,
      name: name || `${safeFirstName} ${safeLastName}`,
      firstName: safeFirstName,
      lastName: safeLastName,
      userId,
    };
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    console.error("Stack:", error.stack);
    throw error;
  }
}

// Check if the script is being run directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('create_admin_user.js')) {
  // Use provided credentials
  const email = "fabAdmin@gmail.com";
  const password = "yayakhan";
  const firstName = "Fab";
  const lastName = "Admin";
  const name = "Fab Admin";
  
  createAdminUserWithDetails(email, password, name, firstName, lastName);
}

async function createAdminUserWithDetails(email, password, name, firstName, lastName) {
  try {
    console.log("🔧 Creating admin user...\n");

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    let userId;

    if (existingUser.length > 0) {
      console.log("⚠️  User already exists with this email.");
      userId = existingUser[0].id;
      console.log(`   User ID: ${userId}`);
    } else {
      // Create user using Better Auth's signUpEmail API
      console.log("📝 Creating new user through Better Auth...");
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

      userId = signUpResponse.user.id;
      console.log(`✅ User created successfully!`);
      console.log(`   User ID: ${userId}`);

      // Update user with firstName and lastName
      await db
        .update(users)
        .set({
          firstName: firstName,
          lastName: lastName,
        })
        .where(eq(users.id, userId));
      console.log(`✅ Updated user with firstName and lastName`);
    }

    // Get admin role
    console.log("\n🔍 Finding admin role...");
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
          and(
            eq(user_has_roles.user_id, userId),
            eq(user_has_roles.role_id, roleId)
          )
        )
        .limit(1);

      if (existingRoleAssignment.length > 0) {
        console.log("⚠️  User already has admin role assigned.");
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
    console.log("✅ ADMIN USER CREATED SUCCESSFULLY!");
    console.log("=".repeat(50));
    console.log("\n📧 Email:    " + email);
    console.log("🔑 Password: " + password);
    console.log("👤 Name:     " + name);
    console.log("📝 First:    " + firstName);
    console.log("📝 Last:     " + lastName);
    console.log("\n💡 You can now log in with these credentials.");
    console.log("=".repeat(50) + "\n");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    console.error("Stack:", error.stack);
    process.exit(1);
  }
}

export default createAdminUser;