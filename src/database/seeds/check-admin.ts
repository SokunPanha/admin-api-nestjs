import { AppDataSource } from '../data-source';
import { CenterUser } from '../entities/center-user.entity';
import * as bcrypt from 'bcrypt';

async function checkAdmin() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established');

    const userRepository = AppDataSource.getRepository(CenterUser);

    // Check if admin user exists
    const adminUser = await userRepository.findOne({
      where: { username: 'admin' },
      relations: ['user_roles', 'user_roles.role'],
    });

    if (!adminUser) {
      console.log('❌ Admin user not found!');
      console.log('Please run: npm run seed:run');
      return;
    }

    console.log('✅ Admin user found:');
    console.log('   ID:', adminUser.id);
    console.log('   Username:', adminUser.username);
    console.log('   Email:', adminUser.email);
    console.log('   Status:', adminUser.status);
    console.log('   Roles:', adminUser.user_roles?.map(ur => ur.role?.name).join(', ') || 'None');

    // Test password
    const testPassword = 'admin123';
    const isMatch = await bcrypt.compare(testPassword, adminUser.password_hash || '');
    console.log('');
    console.log('🔐 Password test (admin123):', isMatch ? '✅ MATCH' : '❌ NO MATCH');

    if (!isMatch) {
      console.log('');
      console.log('⚠️  Password does not match! The database may have been seeded with a different password.');
      console.log('   Consider dropping the database and running migrations + seed again.');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

checkAdmin();
