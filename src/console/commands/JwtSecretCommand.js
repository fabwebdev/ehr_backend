import { Command } from "commander";
import crypto from "crypto";

class JwtSecretCommand {
  constructor() {
    this.command = new Command("jwt:secret");
    this.configureCommand();
  }

  configureCommand() {
    this.command
      .description("Set the JWTAuth secret key used to sign the tokens")
      .option(
        "-s, --show",
        "Display the generated key instead of modifying .env file"
      )
      .option("-a, --always-no", "Skip generating key if key already exists")
      .action((options) => {
        this.generateSecret(options);
      });
  }

  generateSecret(options) {
    const key = crypto.randomBytes(32).toString("hex");

    if (options.show) {
      console.log("JWT_SECRET=" + key);
      return;
    }

    console.log("JWT secret generated successfully.");
    console.log("Please add the following line to your .env file:");
    console.log("JWT_SECRET=" + key);
  }

  getCommand() {
    return this.command;
  }
}

export default JwtSecretCommand;
