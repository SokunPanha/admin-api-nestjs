import { DataSource } from 'typeorm';
import 'dotenv/config';
import { AppDataSource } from '../data-source';

async function activateAdmin() {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');

    // Update admin user status to active
    await AppDataSource.query(
      `UPDATE center_users SET status = 'active' WHERE username = 'admin'`,
    );

    console.log('Admin user activated successfully');
  } catch (error) {
    console.error('Error activating admin user:', error);
    throw error;
  } finally {
    await AppDataSource.destroy();
    console.log('Database connection closed');
  }
}

activateAdmin();
