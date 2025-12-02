import { db } from '../config/db.drizzle.js';
import { users } from '../db/schemas/user.schema.js';
import { eq } from 'drizzle-orm';

async function testDrizzle() {
  try {
    console.log('Testing Drizzle ORM connection...');
    
    // Test query - try to get count of users
    const userCount = await db.select({ count: users.id }).from(users);
    console.log(`Found ${userCount.length} users in the database`);
    
    console.log('Drizzle ORM is working correctly!');
  } catch (error) {
    console.error('Error testing Drizzle ORM:', error);
  }
}

testDrizzle();