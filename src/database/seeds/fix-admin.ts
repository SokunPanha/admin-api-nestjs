import { AppDataSource } from '../data-source';
import { CenterUser } from '../entities/center-user.entity';
import { CenterUserRole } from '../entities/center-user-role.entity';
import { Role } from '../entities/role.entity';
import * as bcrypt from 'bcrypt';

async function fixAdmin() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established');

    const userRepository = AppDataSource.getRepository(CenterUser);
    const userRoleRepository = AppDataSource.getRepository(CenterUserRole);
    const roleRepository = AppDataSource.getRepository(Role);

    // Find admin user
    const adminUser = await userRepository.findOne({
      where: { username: 'admin' },
    });

    if (!adminUser) {
      console.log('❌ Admin user not found!');
      return;
    }

    // Update password to admin123
    const password_hash = await bcrypt.hash('admin123', 10);
    adminUser.password_hash = password_hash;
    await userRepository.save(adminUser);
    console.log('✅ Updated admin password to: admin123');

    // Find Super Admin role
    const superAdminRole = await roleRepository.findOne({
      where: { code: 'super_admin' },
    });

    if (!superAdminRole) {
      console.log('❌ Super Admin role not found!');
      return;
    }

    // Check if role is already assigned
    const existingUserRole = await userRoleRepository.findOne({
      where: {
        user_id: adminUser.id,
        role_id: superAdminRole.id,
      },
    });

    if (!existingUserRole) {
      // Assign Super Admin role
      const userRole = userRoleRepository.create({
        user_id: adminUser.id,
        role_id: superAdminRole.id,
      });
      await userRoleRepository.save(userRole);
      console.log('✅ Assigned Super Admin role to admin user');
    } else {
      console.log('✅ Admin already has Super Admin role');
    }

    console.log('');
    console.log('🎉 Admin user fixed successfully!');
    console.log('📝 Login Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Email: admin@example.com');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

fixAdmin();
