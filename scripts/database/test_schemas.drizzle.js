import { db } from '../config/db.drizzle.js';
import { users, patients, roles, permissions, role_has_permissions, pain_data } from '../db/schemas/index.js';
import { sql } from 'drizzle-orm';

async function testSchemas() {
  try {
    console.log('Testing Drizzle ORM schemas...');
    
    // Test users table
    const userCount = await db.select({ count: users.id }).from(users);
    console.log(`Found ${userCount.length} users in the database`);
    
    // Test patients table
    const patientCount = await db.select({ count: patients.id }).from(patients);
    console.log(`Found ${patientCount.length} patients in the database`);
    
    // Test roles table
    const roleCount = await db.select({ count: roles.id }).from(roles);
    console.log(`Found ${roleCount.length} roles in the database`);
    
    // Test permissions table
    const permissionCount = await db.select({ count: permissions.id }).from(permissions);
    console.log(`Found ${permissionCount.length} permissions in the database`);
    
    // Test role_has_permissions table
    const rolePermissionCount = await db.select().from(role_has_permissions);
    console.log(`Found ${rolePermissionCount.length} role-permission relationships in the database`);
    
    // Test pain_data table
    const painDataCount = await db.select({ count: pain_data.id }).from(pain_data);
    console.log(`Found ${painDataCount.length} pain data records in the database`);
    
    console.log('\n✅ All schemas are working correctly!');
  } catch (error) {
    console.error('Error testing schemas:', error);
  }
}

testSchemas();