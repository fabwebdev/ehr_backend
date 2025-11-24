import { db } from "../config/db.drizzle.js";
import { users } from "../db/schemas/user.schema.js";
import { roles } from "../db/schemas/role.schema.js";
import { permissions } from "../db/schemas/permission.schema.js";
import { sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

const seedDatabase = async () => {
  try {
    console.log("Database connection has been established successfully.");

    // Create default roles - all required RBAC roles
    const requiredRoles = [
      "admin",
      "doctor",
      "nurse",
      "patient",
      "staff",
      "user",
    ];

    for (const roleName of requiredRoles) {
      await db.execute(sql`
                INSERT INTO ${roles} (name, guard_name, created_at, updated_at)
                VALUES (${roleName}, 'web', NOW(), NOW())
                ON CONFLICT (name) DO NOTHING
            `);
    }

    console.log("Roles seeded successfully.");

    // Create default permissions
    const permissionsList = [
      "view-users",
      "create-users",
      "edit-users",
      "delete-users",
      "view-patients",
      "create-patients",
      "edit-patients",
      "delete-patients",
      // RBAC permissions
      "view:patient",
      "create:patient",
      "update:patient",
      "delete:patient",
      "view:clinical_notes",
      "create:clinical_notes",
      "update:clinical_notes",
      "delete:clinical_notes",
      "view:vital_signs",
      "create:vital_signs",
      "update:vital_signs",
      "delete:vital_signs",
      "view:medications",
      "create:medications",
      "update:medications",
      "delete:medications",
      "view:reports",
      "generate:reports",
      "manage:users",
      "manage:roles",
      "manage:permissions",
      "view:audit_logs",
    ];

    for (const perm of permissionsList) {
      await db.execute(sql`
                INSERT INTO ${permissions} (name, guard_name, created_at, updated_at)
                VALUES (${perm}, 'web', NOW(), NOW())
                ON CONFLICT (name) DO NOTHING
            `);
    }

    console.log("Permissions seeded successfully.");

    // Create admin user if not exists
    const existingUsers = await db.execute(sql`
            SELECT * FROM ${users} WHERE email = 'admin@example.com'
        `);

    if (existingUsers.rows.length === 0) {
      const hashedPassword = await bcrypt.hash("password", 10);
      const userId = nanoid(); // Generate a unique ID for the user

      const newUser = await db.execute(sql`
                INSERT INTO ${users} (id, name, email, password, "createdAt", "updatedAt")
                VALUES (${userId}, 'Admin User', 'admin@example.com', ${hashedPassword}, NOW(), NOW())
                RETURNING id
            `);

      // Get admin role id
      const adminRole = await db.execute(sql`
                SELECT id FROM ${roles} WHERE name = 'admin'
            `);

      if (adminRole.rows.length > 0) {
        const roleId = parseInt(adminRole.rows[0].id); // Convert to integer

        // Assign admin role to admin user using user_has_roles table
        await db.execute(sql`
                    INSERT INTO user_has_roles (user_id, role_id)
                    VALUES (${userId}, ${roleId})
                `);

        console.log("Admin user created and assigned admin role.");
      } else {
        console.log("Admin role not found, skipping role assignment.");
      }
    } else {
      console.log("Admin user already exists.");
    }

    console.log("Database seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Run the seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase;
