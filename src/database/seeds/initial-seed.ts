import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Menu } from '../entities/menu.entity';
import { Role } from '../entities/role.entity';
import { RoleMenu } from '../entities/role-menu.entity';
import { CenterUser } from '../entities/center-user.entity';
import { CenterUserRole } from '../entities/center-user-role.entity';
import { MenuStatus, RoleStatus, UserStatus } from '../../common/constants/entity-status';

export async function runInitialSeed(dataSource: DataSource) {
  console.log('🌱 Starting initial seed...');

  const menuRepository = dataSource.getRepository(Menu);
  const roleRepository = dataSource.getRepository(Role);
  const roleMenuRepository = dataSource.getRepository(RoleMenu);
  const userRepository = dataSource.getRepository(CenterUser);
  const userRoleRepository = dataSource.getRepository(CenterUserRole);

  // Create System Settings parent menu
  const systemSettingsMenu = menuRepository.create({
    code: 'system-settings',
    labels: {
      en: 'System Settings',
      kh: 'ការកំណត់ប្រព័ន្ធ',
    },
    icon: 'SettingOutlined',
    route_path: null,
    sort_order: 100,
    status: MenuStatus.ACTIVE,
    is_visible: true,
    parent_id: null,
  });
  await menuRepository.save(systemSettingsMenu);
  console.log('✅ Created System Settings menu');

  // Create child menus
  const usersMenu = menuRepository.create({
    code: 'users',
    labels: {
      en: 'Users',
      kh: 'អ្នកប្រើប្រាស់',
    },
    icon: 'UserOutlined',
    route_path: '/system-settings/users',
    sort_order: 1,
    status: MenuStatus.ACTIVE,
    is_visible: true,
    parent_id: systemSettingsMenu.id,
  });
  await menuRepository.save(usersMenu);
  console.log('✅ Created Users menu');

  const rolesMenu = menuRepository.create({
    code: 'roles',
    labels: {
      en: 'Roles',
      kh: 'តួនាទី',
    },
    icon: 'TeamOutlined',
    route_path: '/system-settings/roles',
    sort_order: 2,
    status: MenuStatus.ACTIVE,
    is_visible: true,
    parent_id: systemSettingsMenu.id,
  });
  await menuRepository.save(rolesMenu);
  console.log('✅ Created Roles menu');

  const menusMenu = menuRepository.create({
    code: 'menus',
    labels: {
      en: 'Menus',
      kh: 'ម៉ឺនុយ',
    },
    icon: 'MenuOutlined',
    route_path: '/system-settings/menus',
    sort_order: 3,
    status: MenuStatus.ACTIVE,
    is_visible: true,
    parent_id: systemSettingsMenu.id,
  });
  await menuRepository.save(menusMenu);
  console.log('✅ Created Menus menu');

  // Create Super Admin role
  const superAdminRole = roleRepository.create({
    name: 'Super Admin',
    code: 'super_admin',
    description: 'Full system access',
    status: RoleStatus.ACTIVE,
  });
  await roleRepository.save(superAdminRole);
  console.log('✅ Created Super Admin role');

  // Assign all menus to Super Admin role
  const allMenus = [systemSettingsMenu, usersMenu, rolesMenu, menusMenu];
  for (const menu of allMenus) {
    const roleMenu = roleMenuRepository.create({
      role_id: superAdminRole.id,
      menu_id: menu.id,
    });
    await roleMenuRepository.save(roleMenu);
  }
  console.log('✅ Assigned all menus to Super Admin role');

  // Create demo admin user
  const password_hash = await bcrypt.hash('admin123', 10);
  const adminUser = userRepository.create({
    username: 'admin',
    email: 'admin@example.com',
    password_hash,
    first_name: 'Admin',
    last_name: 'User',
    status: UserStatus.ACTIVE,
  });
  await userRepository.save(adminUser);
  console.log('✅ Created demo admin user (username: admin, password: admin123)');

  // Assign Super Admin role to admin user
  const userRole = userRoleRepository.create({
    user_id: adminUser.id,
    role_id: superAdminRole.id,
  });
  await userRoleRepository.save(userRole);
  console.log('✅ Assigned Super Admin role to admin user');

  console.log('🎉 Initial seed completed successfully!');
  console.log('');
  console.log('📝 Demo Admin Credentials:');
  console.log('   Username: admin');
  console.log('   Password: admin123');
  console.log('   Email: admin@example.com');
}
