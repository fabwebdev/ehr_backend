import { Command } from "commander";
import readline from "readline";
import { db } from "../../config/db.drizzle.js";
import { users, roles, user_has_roles } from "../../db/schemas/index.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

class MakeUserCommand {
  constructor() {
    this.command = new Command("make:user");
    this.configureCommand();
  }

  configureCommand() {
    this.command
      .description("Create a new user")
      .option("-n, --name <name>", "User name")
      .option("-e, --email <email>", "User email")
      .option("-p, --password <password>", "User password")
      .option("-r, --role <role>", "User role (default: patient)")
      .action((options) => {
        this.createUser(options);
      });
  }

  async createUser(options) {
    console.log("Creating a new user...");

    // If options are provided via command line, use them
    if (options.name && options.email && options.password) {
      await this.saveUser(options.name, options.email, options.password, options.role);
      return;
    }

    // Otherwise, prompt for user input
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const askQuestion = (question) => {
      return new Promise((resolve) => {
        rl.question(question, (answer) => {
          resolve(answer);
        });
      });
    };

    try {
      const name = options.name || (await askQuestion("Name: "));
      const email = options.email || (await askQuestion("Email: "));
      const password = options.password || (await askQuestion("Password: "));
      const role = options.role || (await askQuestion("Role (default: patient): ")) || "patient";

      await this.saveUser(name, email, password, role);
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      rl.close();
    }
  }

  async saveUser(name, email, password, role = "patient") {
    try {
      // Check if user already exists
      const existingUsers = await db.select().from(users).where(eq(users.email, email));
      
      if (existingUsers.length > 0) {
        console.log("User with this email already exists!");
        return;
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Generate user ID
      const userId = nanoid();

      // Create the user
      const newUser = await db.insert(users).values({
        id: userId,
        name: name,
        email: email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      console.log("User created successfully!");
      console.log("Name:", name);
      console.log("Email:", email);
      console.log("User ID:", userId);

      // Assign role to user
      if (role) {
        // Get role ID
        const roleResult = await db.select().from(roles).where(eq(roles.name, role));
        
        if (roleResult.length > 0) {
          const roleId = roleResult[0].id;
          
          // Assign role to user
          await db.insert(user_has_roles).values({
            user_id: userId,
            role_id: roleId
          });
          
          console.log(`Role '${role}' assigned successfully!`);
        } else {
          console.log(`Role '${role}' not found. Available roles: admin, doctor, nurse, patient, staff`);
          
          // Assign default patient role
          const patientRole = await db.select().from(roles).where(eq(roles.name, "patient"));
          if (patientRole.length > 0) {
            await db.insert(user_has_roles).values({
              user_id: userId,
              role_id: patientRole[0].id
            });
            console.log("Assigned default 'patient' role.");
          }
        }
      }
    } catch (error) {
      console.error("Error saving user:", error);
    }
  }

  getCommand() {
    return this.command;
  }
}

export default MakeUserCommand;