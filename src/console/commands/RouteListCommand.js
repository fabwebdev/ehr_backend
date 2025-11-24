import { Command } from "commander";

class RouteListCommand {
  constructor() {
    this.command = new Command("route:list");
    this.configureCommand();
  }

  configureCommand() {
    this.command
      .description("List all registered routes")
      .option(
        "-m, --methods <methods>",
        "Filter routes by HTTP methods (GET,POST,PUT,DELETE)"
      )
      .action((options) => {
        this.listRoutes(options);
      });
  }

  listRoutes(options) {
    console.log("Available Routes:");
    console.log("==================");

    // In a real implementation, we would extract routes from the Fastify app
    // For now, we'll show some example routes
    let routes = [
      {
        method: "GET",
        path: "/api/health",
        description: "Health check endpoint",
      },
      {
        method: "POST",
        path: "/api/register",
        description: "User registration",
      },
      { method: "POST", path: "/api/login", description: "User login" },
      { method: "POST", path: "/api/logout", description: "User logout" },
      {
        method: "GET",
        path: "/api/dischargeSections",
        description: "Get discharge sections",
      },
      {
        method: "GET",
        path: "/api/generate-his-pdf",
        description: "Generate HIS PDF",
      },
      {
        method: "GET",
        path: "/api/patients/:id/chart",
        description: "Get patient chart",
      },
      {
        method: "GET",
        path: "/api/nursing-clinical-notes/:id",
        description: "Get nursing clinical note",
      },
      {
        method: "PUT",
        path: "/api/nursing-clinical-notes/:id",
        description: "Update nursing clinical note",
      },
      // Add more routes as needed
    ];

    // Filter by methods if specified
    if (options.methods) {
      const methods = options.methods.split(",").map((m) => m.toUpperCase());
      routes = routes.filter((route) => methods.includes(route.method));
    }

    // Display routes in a table format
    console.log("Method\tPath\t\t\t\tDescription");
    console.log("------\t----\t\t\t\t-----------");

    routes.forEach((route) => {
      console.log(`${route.method}\t${route.path}\t\t${route.description}`);
    });
  }

  getCommand() {
    return this.command;
  }
}

export default RouteListCommand;
