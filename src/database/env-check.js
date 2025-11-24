#!/usr/bin/env node

// Environment variable check for Render deployment

console.log("🔍 Environment Variable Check");
console.log("============================");

console.log(
  "NODE_ENV:",
  process.env.NODE_ENV || "Not set (defaults to development)"
);
console.log("PORT:", process.env.PORT || "Not set (defaults to 3000)");

console.log("\nDatabase Configuration:");
console.log(
  "DB_HOST:",
  process.env.DB_HOST || "Not set (defaults to localhost)"
);
console.log("DB_PORT:", process.env.DB_PORT || "Not set (defaults to 5432)");
console.log(
  "DB_USER:",
  process.env.DB_USER ? "Set" : "Not set (defaults to api_user)"
);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "Set" : "Not set");
console.log(
  "DB_NAME:",
  process.env.DB_NAME || "Not set (defaults to travel_db)"
);

console.log("\nRender Specific:");
console.log("RENDER:", process.env.RENDER || "Not set");

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
  console.log(
    "\n⚠️  Warning: Essential database environment variables are not set!"
  );
  console.log("   This may cause database connection issues.");
} else {
  console.log(
    "\n✅ Database environment variables appear to be set correctly."
  );
}
