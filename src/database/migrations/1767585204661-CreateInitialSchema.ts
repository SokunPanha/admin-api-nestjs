import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialSchema1767585204661 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create center_users table
    await queryRunner.query(`
      CREATE TABLE center_users (
        id BIGSERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        phone_number VARCHAR(20),
        avatar_url VARCHAR(500),
        status VARCHAR(50) DEFAULT 'pending_verification',
        last_login_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_center_users_status ON center_users(status);
    `);

    // 2. Create roles table
    await queryRunner.query(`
      CREATE TABLE roles (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        code VARCHAR(50) UNIQUE NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_roles_status ON roles(status);
    `);

    // 3. Create center_user_roles table
    await queryRunner.query(`
      CREATE TABLE center_user_roles (
        id BIGSERIAL PRIMARY KEY,
        user_id BIGINT NOT NULL REFERENCES center_users(id) ON DELETE CASCADE,
        role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        assigned_by BIGINT REFERENCES center_users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP,
        UNIQUE(user_id, role_id)
      );
    `);

    // 4. Create menus table
    await queryRunner.query(`
      CREATE TABLE menus (
        id BIGSERIAL PRIMARY KEY,
        parent_id BIGINT REFERENCES menus(id) ON DELETE CASCADE,
        code VARCHAR(100) UNIQUE NOT NULL,
        labels JSONB NOT NULL,
        icon VARCHAR(100),
        route_path VARCHAR(255),
        sort_order INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        is_visible BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_menus_status ON menus(status);
    `);

    // 5. Create role_menus table
    await queryRunner.query(`
      CREATE TABLE role_menus (
        id BIGSERIAL PRIMARY KEY,
        role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        menu_id BIGINT NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP,
        UNIQUE(role_id, menu_id)
      );
    `);

    // 6. Create refresh_tokens table
    await queryRunner.query(`
      CREATE TABLE refresh_tokens (
        id BIGSERIAL PRIMARY KEY,
        user_id BIGINT NOT NULL REFERENCES center_users(id) ON DELETE CASCADE,
        token_hash VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        revoked_at TIMESTAMP,
        replaced_by BIGINT REFERENCES refresh_tokens(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order (respecting foreign key constraints)
    await queryRunner.query(`DROP TABLE IF EXISTS refresh_tokens CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS role_menus CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS menus CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS center_user_roles CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS roles CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS center_users CASCADE;`);
  }
}
