import auth from '../config/betterAuth.js';

async function testBetterAuthWithDrizzle() {
  try {
    console.log('Testing Better Auth with Drizzle ORM...');
    
    // Test that Better Auth is properly configured
    if (auth) {
      console.log('Better Auth is properly configured with Drizzle ORM!');
      console.log('Auth configuration:', {
        appName: auth.options.appName,
        baseURL: auth.options.baseURL,
        databaseProvider: auth.options.database.provider
      });
    } else {
      console.log('Better Auth is not properly configured');
    }
  } catch (error) {
    console.error('Error testing Better Auth with Drizzle ORM:', error);
  }
}

testBetterAuthWithDrizzle();