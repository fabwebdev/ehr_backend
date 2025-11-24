import { Command } from "commander";
import seedDatabase from "../database/seed.js";
import InspireCommand from "./commands/InspireCommand.js";
import RouteListCommand from "./commands/RouteListCommand.js";
import JwtSecretCommand from "./commands/JwtSecretCommand.js";
import MakeUserCommand from "./commands/MakeUserCommand.js";
import { registerInspireCommand } from "../routes/console.js";

class Kernel {
  constructor() {
    this.program = new Command();
    this.commands = [];
    this.schedule = {};
  }

  /**
   * Register the commands for the application.
   */
  commands() {
    // Register custom commands
    this.registerCommands();
  }

  /**
   * Register the custom commands for the application.
   */
  registerCommands() {
    // Register built-in commands
    this.program
      .command("seed")
      .description("Seed the database with initial data")
      .action(async () => {
        try {
          await seedDatabase();
          console.log("Database seeding completed successfully.");
        } catch (error) {
          console.error("Error seeding database:", error);
        }
      });

    this.program
      .command("sync")
      .description("Sync database models")
      .action(async () => {
        try {
          const { default: syncDatabase } = await import("../database/sync.js");
          await syncDatabase();
          console.log("Database sync completed successfully.");
        } catch (error) {
          console.error("Error syncing database:", error);
        }
      });

    // Register the inspire command
    const inspireCommand = new InspireCommand();
    this.program.addCommand(inspireCommand.getCommand());

    // Register the route list command
    const routeListCommand = new RouteListCommand();
    this.program.addCommand(routeListCommand.getCommand());

    // Register the JWT secret command
    const jwtSecretCommand = new JwtSecretCommand();
    this.program.addCommand(jwtSecretCommand.getCommand());

    // Register the make user command
    const makeUserCommand = new MakeUserCommand();
    this.program.addCommand(makeUserCommand.getCommand());

    // Register console routes
    registerInspireCommand(this.program);

    // Register custom commands from the commands directory
    this.loadCommands();
  }

  /**
   * Load custom commands from the commands directory.
   */
  loadCommands() {
    // This would dynamically load custom commands
    // For now, we'll just register the built-in ones
  }

  /**
   * Define the application's command schedule.
   */
  scheduleCommands() {
    // Define scheduled commands
    // This would be similar to Laravel's task scheduling
  }

  /**
   * Handle an incoming console command.
   * @param {Array} argv
   */
  handle(argv) {
    this.program.parse(argv);
  }
}

export default new Kernel();