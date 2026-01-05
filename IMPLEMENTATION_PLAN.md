# Database Design Plan: Authentication & Authorization System

## Overview
Design a PostgreSQL database schema for authentication and authorization with:
- User authentication
- Role-based access control (RBAC)
- Menu-based permissions (each role has a set of menus)
- Users can have multiple roles
- Multi-language menu labels (English and Khmer)

## Current Project State
- **No database configured yet** - clean slate
- NestJS v11 with Swagger and i18n already configured
- No ORM installed yet

## User Preferences (Confirmed)

✅ **ORM Choice**: TypeORM (native NestJS integration)
✅ **Authentication**: JWT with refresh tokens
✅ **Additional User Fields**: phone_number, avatar_url
✅ **Language Code**: 'kh' for Khmer
✅ **Menu Permissions**: Simple role-based menu access (each role has a set of menus)
✅ **Note**: CRUD permissions deferred for later - focus on menu visibility only

## Critical Requirements

### 1. Database
- ✅ **PostgreSQL** as the database
- ✅ **Connect using DATABASE_URL** (single connection string)
- ✅ **Must create migrations** - Use TypeORM migrations for all schema changes
- ✅ **Must create seed data** with:
  - Parent menu: "System Settings" (English) / "ការកំណត់ប្រព័ន្ធ" (Khmer)
  - Child menus:
    - "Users" / "អ្នកប្រើប្រាស់"
    - "Roles" / "តួនាទី"
    - "Menus" / "ម៉ឺនុយ"

### 2. Table Naming
- ✅ **Rename `users` table to `center_users`** to avoid confusion
- ✅ All related foreign keys updated accordingly

### 3. API Design
- ✅ **POST method only** for all operations (create, read, update, delete)
- ✅ **Clear request/response types** defined for all endpoints
- ✅ **All APIs documented in Swagger** with proper decorators
- ✅ **System Setting resources grouped** under `/admin/v1/system-setting/*`
- ✅ **Use `/list` for collection queries** (not `/find-all`)
- ✅ **Descriptive API paths** following naming conventions:
  - System Setting Pattern: `/admin/v1/system-setting/{resource}/{action}`
  - Example: `/admin/v1/system-setting/center-users/create`
  - Example: `/admin/v1/system-setting/center-users/list`
  - Example: `/admin/v1/system-setting/roles/list`
  - Example: `/admin/v1/system-setting/menus/list`
  - Auth Exception: `/admin/v1/auth/menus` - Get user-accessible menus after login

### 4. Frontend Compatibility (Ant Design Pro + Auto-gen Script)
- ✅ **Swagger YAML export** at `/admin/v1/api-docs/yaml`
- ✅ **Compatible with auto-generation script** that:
  - Reads Swagger YAML
  - Generates TypeScript APIs with `createApi<Request, Response>(path)`
  - Expects request/response DTOs in Swagger schemas
- ✅ **Ant Design Pro Table compatibility**:
  - List endpoints accept:
    ```typescript
    {
      page: number;
      page_size: number;
      keyword?: string;  // Quick search across multiple fields
      sort?: { field: string; order: 'ASC' | 'DESC' };
      filters?: {
        // Resource-specific filters (see details below)
      }
    }
    ```
  - List responses return: `{code, message, data: {total, items}}`
- ✅ **Authorization header**: `Authorization: Bearer <token>`
- ✅ **Language header**: `Accept-Language: en | kh`

---

## Database Schema (6 Tables)

### 1. center_users
```sql
CREATE TABLE center_users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone_number VARCHAR(20),
  avatar_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'pending_verification',  -- 'active', 'inactive', 'suspended', 'pending_verification'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

-- Add index for status filtering
CREATE INDEX idx_center_users_status ON center_users(status);
```

### 2. roles
```sql
CREATE TABLE roles (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',  -- 'active', 'inactive'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add index for status filtering
CREATE INDEX idx_roles_status ON roles(status);
```

### 3. center_user_roles
```sql
CREATE TABLE center_user_roles (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES center_users(id) ON DELETE CASCADE,
  role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_by BIGINT REFERENCES center_users(id) ON DELETE SET NULL,
  UNIQUE(user_id, role_id)
);
```

### 4. menus
```sql
CREATE TABLE menus (
  id BIGSERIAL PRIMARY KEY,
  parent_id BIGINT REFERENCES menus(id) ON DELETE CASCADE,
  code VARCHAR(100) UNIQUE NOT NULL,
  labels JSONB NOT NULL,  -- {"en": "Dashboard", "kh": "ផ្ទាំងគ្រប់គ្រង"}
  icon VARCHAR(100),
  route_path VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',  -- 'active', 'inactive', 'draft'
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add index for status filtering
CREATE INDEX idx_menus_status ON menus(status);
```

### 5. role_menus
```sql
CREATE TABLE role_menus (
  id BIGSERIAL PRIMARY KEY,
  role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  menu_id BIGINT NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(role_id, menu_id)
);
```

### 6. refresh_tokens
```sql
CREATE TABLE refresh_tokens (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES center_users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revoked_at TIMESTAMP NULL,
  replaced_by BIGINT REFERENCES refresh_tokens(id) ON DELETE SET NULL
);
```

---

## API Endpoints

### System Setting - Center Users
- `POST /admin/v1/system-setting/center-users/create`
- `POST /admin/v1/system-setting/center-users/list`
- `POST /admin/v1/system-setting/center-users/find-by-id`
- `POST /admin/v1/system-setting/center-users/update`
- `POST /admin/v1/system-setting/center-users/delete`
- `POST /admin/v1/system-setting/center-users/assign-roles`

### System Setting - Roles
- `POST /admin/v1/system-setting/roles/create`
- `POST /admin/v1/system-setting/roles/list`
- `POST /admin/v1/system-setting/roles/find-by-id`
- `POST /admin/v1/system-setting/roles/update`
- `POST /admin/v1/system-setting/roles/delete`
- `POST /admin/v1/system-setting/roles/assign-menus`

### System Setting - Menus
- `POST /admin/v1/system-setting/menus/create`
- `POST /admin/v1/system-setting/menus/list`
- `POST /admin/v1/system-setting/menus/find-by-id`
- `POST /admin/v1/system-setting/menus/update`
- `POST /admin/v1/system-setting/menus/delete`

### Auth (Exception - Not under system-setting)
- `POST /admin/v1/auth/register`
- `POST /admin/v1/auth/login`
- `POST /admin/v1/auth/refresh`
- `POST /admin/v1/auth/logout`
- `POST /admin/v1/auth/get-profile`
- `POST /admin/v1/auth/menus` - Get user-accessible menus

---

## List Request DTOs with Specific Filters

### Center Users List Request
```typescript
POST /admin/v1/system-setting/center-users/list
{
  page: number;
  page_size: number;
  keyword?: string;  // Searches: username, email, first_name, last_name
  sort?: { field: string; order: 'ASC' | 'DESC' };
  filters?: {
    id?: number;
    username?: string;
    email?: string;
    phone_number?: string;
    status?: string;            // 'active' | 'inactive' | 'suspended' | 'pending_verification'
    role_ids?: number[];        // Filter by assigned roles
    created_at_from?: string;   // ISO date string
    created_at_to?: string;     // ISO date string
  };
}
```

### Roles List Request
```typescript
POST /admin/v1/system-setting/roles/list
{
  page: number;
  page_size: number;
  keyword?: string;  // Searches: name, code, description
  sort?: { field: string; order: 'ASC' | 'DESC' };
  filters?: {
    id?: number;
    name?: string;
    code?: string;
    status?: string;           // 'active' | 'inactive'
    menu_ids?: number[];       // Filter by assigned menus
    created_at_from?: string;
    created_at_to?: string;
  };
}
```

### Menus List Request
```typescript
POST /admin/v1/system-setting/menus/list
{
  page: number;
  page_size: number;
  keyword?: string;  // Searches: code, labels (multi-language)
  sort?: { field: string; order: 'ASC' | 'DESC' };
  filters?: {
    id?: number;
    parent_id?: number | null;  // null = root menus only
    code?: string;
    status?: string;           // 'active' | 'inactive' | 'draft'
    is_visible?: boolean;
    route_path?: string;
    created_at_from?: string;
    created_at_to?: string;
  };
}
```

---

## Unified Response Format

All API responses follow this structure:

```typescript
{
  code: number;        // 200 = success, others = error codes
  message: string;     // Human-readable message
  data: {
    total?: number;    // For list operations
    items?: T[];       // For list operations
    [key: string]: any; // Extensible
  } | T;
}
```

**Examples:**

```json
// List response
{
  "code": 200,
  "message": "Success",
  "data": {
    "total": 25,
    "items": [...]
  }
}

// Single item response
{
  "code": 200,
  "message": "User created successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com"
  }
}

// Error response
{
  "code": 400,
  "message": "Validation failed",
  "data": {
    "errors": [...]
  }
}
```

---

## Status Codes Definition

All API status codes are centralized in a YAML file for consistency across backend and frontend.

### File Location
`src/common/constants/status-codes.yaml`

### Status Code Categories

#### Success Codes (2xx)
```yaml
SUCCESS:
  code: 200
  message: Success
  description: Request completed successfully

CREATED:
  code: 201
  message: Created successfully
  description: Resource created successfully
```

#### Client Error Codes (4xx)
```yaml
BAD_REQUEST:
  code: 400
  message: Bad request
  description: Invalid request parameters

UNAUTHORIZED:
  code: 401
  message: Unauthorized
  description: Authentication required

FORBIDDEN:
  code: 403
  message: Forbidden
  description: Insufficient permissions

NOT_FOUND:
  code: 404
  message: Resource not found
  description: Requested resource does not exist

CONFLICT:
  code: 409
  message: Resource already exists
  description: Duplicate resource

VALIDATION_ERROR:
  code: 422
  message: Validation failed
  description: Request validation failed
```

#### Server Error Codes (5xx)
```yaml
INTERNAL_ERROR:
  code: 500
  message: Internal server error
  description: Unexpected server error
```

#### Custom Business Logic Codes (1xxx)
```yaml
# Authentication & Authorization (1001-1099)
INVALID_CREDENTIALS:
  code: 1001
  message: Invalid credentials
  description: Username or password is incorrect

TOKEN_EXPIRED:
  code: 1002
  message: Token expired
  description: Access token has expired

REFRESH_TOKEN_INVALID:
  code: 1003
  message: Invalid refresh token
  description: Refresh token is invalid or revoked

USER_NOT_VERIFIED:
  code: 1004
  message: User not verified
  description: Email verification required

USER_ALREADY_EXISTS:
  code: 1005
  message: User already exists
  description: Username or email already registered

# User & Role Management (1100-1199)
ROLE_ALREADY_ASSIGNED:
  code: 1100
  message: Role already assigned
  description: User already has this role

ROLE_NOT_ASSIGNED:
  code: 1101
  message: Role not assigned
  description: User does not have this role

ROLE_IN_USE:
  code: 1102
  message: Role is in use
  description: Cannot delete role assigned to users

USER_INACTIVE:
  code: 1103
  message: User is inactive
  description: Account has been deactivated

# Menu Management (1200-1299)
MENU_HAS_CHILDREN:
  code: 1200
  message: Cannot delete menu with children
  description: Remove child menus first

MENU_ALREADY_ASSIGNED:
  code: 1201
  message: Menu already assigned
  description: Role already has access to this menu

MENU_IN_USE:
  code: 1202
  message: Menu is in use
  description: Cannot delete menu assigned to roles

INVALID_PARENT_MENU:
  code: 1203
  message: Invalid parent menu
  description: Parent menu does not exist or creates circular reference
```

### TypeScript Integration

The YAML file will be used to generate TypeScript constants:

```typescript
// src/common/constants/status-codes.ts (auto-generated)
export enum StatusCode {
  // Success
  SUCCESS = 200,
  CREATED = 201,

  // Client errors
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  VALIDATION_ERROR = 422,

  // Server errors
  INTERNAL_ERROR = 500,

  // Custom codes
  INVALID_CREDENTIALS = 1001,
  TOKEN_EXPIRED = 1002,
  REFRESH_TOKEN_INVALID = 1003,
  USER_NOT_VERIFIED = 1004,
  USER_ALREADY_EXISTS = 1005,
  ROLE_ALREADY_ASSIGNED = 1100,
  ROLE_NOT_ASSIGNED = 1101,
  ROLE_IN_USE = 1102,
  USER_INACTIVE = 1103,
  MENU_HAS_CHILDREN = 1200,
  MENU_ALREADY_ASSIGNED = 1201,
  MENU_IN_USE = 1202,
  INVALID_PARENT_MENU = 1203,
}

export const StatusMessages: Record<StatusCode, string> = {
  [StatusCode.SUCCESS]: 'Success',
  [StatusCode.CREATED]: 'Created successfully',
  // ... (auto-generated from YAML)
};
```

### Usage Examples

**Backend (NestJS):**
```typescript
import { StatusCode, StatusMessages } from '@/common/constants/status-codes';

// Success response
return {
  code: StatusCode.SUCCESS,
  message: StatusMessages[StatusCode.SUCCESS],
  data: users,
};

// Error response
throw new HttpException(
  {
    code: StatusCode.INVALID_CREDENTIALS,
    message: StatusMessages[StatusCode.INVALID_CREDENTIALS],
    data: null,
  },
  HttpStatus.UNAUTHORIZED,
);
```

**Frontend (Auto-generated):**
```typescript
import { StatusCode } from '@/constants/status-codes';

if (response.code === StatusCode.SUCCESS) {
  message.success('Operation successful');
} else if (response.code === StatusCode.INVALID_CREDENTIALS) {
  message.error('Invalid username or password');
} else if (response.code === StatusCode.TOKEN_EXPIRED) {
  // Redirect to login
}
```

### Benefits
- ✅ Single source of truth for all status codes
- ✅ No magic numbers in code
- ✅ Type-safe on both backend and frontend
- ✅ Easy to maintain and extend
- ✅ Auto-documented in Swagger
- ✅ Frontend and backend always in sync

---

## Entity Status Enums

Entity status fields are stored as **VARCHAR strings** in the database for readability, but validated using **TypeScript enums** in code for type safety.

### File Location
`src/common/constants/entity-status.yaml`

### Entity Status Definitions

```yaml
# User Status
user_status:
  active:
    value: active
    label_en: Active
    label_kh: សកម្ម
    description: User account is active and can log in
    color: success
    badge_status: success

  inactive:
    value: inactive
    label_en: Inactive
    label_kh: អសកម្ម
    description: User account is deactivated by admin
    color: default
    badge_status: default

  suspended:
    value: suspended
    label_en: Suspended
    label_kh: ផ្អាក
    description: User account is temporarily suspended
    color: error
    badge_status: error

  pending_verification:
    value: pending_verification
    label_en: Pending Verification
    label_kh: រង់ចាំការផ្ទៀងផ្ទាត់
    description: User registered but email not verified
    color: warning
    badge_status: warning

# Role Status
role_status:
  active:
    value: active
    label_en: Active
    label_kh: សកម្ម
    description: Role is active and can be assigned
    color: success
    badge_status: success

  inactive:
    value: inactive
    label_en: Inactive
    label_kh: អសកម្ម
    description: Role is inactive and cannot be assigned
    color: default
    badge_status: default

# Menu Status
menu_status:
  active:
    value: active
    label_en: Active
    label_kh: សកម្ម
    description: Menu is visible to users with permission
    color: success
    badge_status: success

  inactive:
    value: inactive
    label_en: Inactive
    label_kh: អសកម្ម
    description: Menu is hidden from all users
    color: default
    badge_status: default

  draft:
    value: draft
    label_en: Draft
    label_kh: ព្រាង
    description: Menu is in draft mode (admin only)
    color: warning
    badge_status: warning
```

### TypeScript Integration

The YAML file will be used to generate TypeScript enums:

```typescript
// src/common/constants/entity-status.ts (auto-generated)

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
}

export enum RoleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum MenuStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
}

// Labels for multi-language support
export const UserStatusLabels: Record<UserStatus, { en: string; kh: string }> = {
  [UserStatus.ACTIVE]: { en: 'Active', kh: 'សកម្ម' },
  [UserStatus.INACTIVE]: { en: 'Inactive', kh: 'អសកម្ម' },
  [UserStatus.SUSPENDED]: { en: 'Suspended', kh: 'ផ្អាក' },
  [UserStatus.PENDING_VERIFICATION]: { en: 'Pending Verification', kh: 'រង់ចាំការផ្ទៀងផ្ទាត់' },
};

// Colors for UI components (Ant Design)
export const UserStatusColors: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: 'success',
  [UserStatus.INACTIVE]: 'default',
  [UserStatus.SUSPENDED]: 'error',
  [UserStatus.PENDING_VERIFICATION]: 'warning',
};

// Similar exports for RoleStatus and MenuStatus...
```

### Database Storage

**Stored as VARCHAR(50) in PostgreSQL:**
```sql
-- In database
status VARCHAR(50) DEFAULT 'active'

-- Example values stored: 'active', 'inactive', 'suspended', 'pending_verification'
-- NOT stored as: 1, 2, 3, 4
```

### Usage Examples

**Backend - Entity Definition (TypeORM):**
```typescript
import { UserStatus } from '@/common/constants/entity-status';

@Entity('center_users')
export class CenterUser {
  @Column({
    type: 'varchar',
    length: 50,
    default: UserStatus.PENDING_VERIFICATION,
  })
  status: UserStatus;  // TypeScript enum for type safety
}
```

**Backend - Validation:**
```typescript
import { IsEnum } from 'class-validator';
import { UserStatus } from '@/common/constants/entity-status';

export class CreateUserDto {
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;
}
```

**Backend - Business Logic:**
```typescript
import { UserStatus } from '@/common/constants/entity-status';

// Type-safe comparison
if (user.status === UserStatus.SUSPENDED) {
  throw new HttpException('Account is suspended', HttpStatus.FORBIDDEN);
}

// Update status
user.status = UserStatus.ACTIVE;
await userRepository.save(user);
```

**Frontend - Display (Ant Design Pro):**
```typescript
import { Badge } from 'antd';
import { UserStatus, UserStatusLabels, UserStatusColors } from '@/constants/entity-status';

// In table column
{
  title: 'Status',
  dataIndex: 'status',
  render: (status: UserStatus, record) => (
    <Badge
      status={UserStatusColors[status]}
      text={UserStatusLabels[status][locale]}
    />
  ),
}

// In filter dropdown
filters: [
  { text: 'Active', value: UserStatus.ACTIVE },
  { text: 'Inactive', value: UserStatus.INACTIVE },
  { text: 'Suspended', value: UserStatus.SUSPENDED },
  { text: 'Pending', value: UserStatus.PENDING_VERIFICATION },
]
```

**API Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "username": "john",
    "status": "active"  // String value, not number
  }
}
```

### Benefits

- ✅ **Database**: Human-readable strings ('active' vs 1)
- ✅ **Type Safety**: TypeScript enums prevent invalid values
- ✅ **No Mapping**: Frontend receives strings directly
- ✅ **Self-Documenting**: SQL queries are clear (`WHERE status = 'active'`)
- ✅ **Multi-Language**: Labels defined for i18n
- ✅ **UI Ready**: Colors and badge status included
- ✅ **Validation**: class-validator @IsEnum decorator
- ✅ **Indexed**: Database indexes on status columns for performance

---

## Implementation Phases

### Phase 1: Package Installation & Configuration (2-4 hours)
- Install TypeORM, PostgreSQL driver, JWT, Passport, Bcrypt
- Create `.env` file with DATABASE_URL
- Create database configuration files
- Add TypeORM scripts to package.json

### Phase 2: Database Schema Implementation (4-8 hours)
- Create entity files (base, center-user, role, menu, etc.)
- Generate and run migrations
- Create seed data with System Settings menu

### Phase 3: Module Implementation (8-12 hours)
- Create CenterUsers Module with POST-only endpoints
- Create Roles Module with menu assignment
- Create Menus Module with hierarchical tree support

### Phase 4: Authentication & Authorization (8-12 hours)
- Create Auth Module with JWT strategies
- Implement guards (JWT, Roles)
- Create decorators (@Public, @Roles, @CurrentUser)
- Implement auth endpoints

### Phase 5: Global Integration (2-4 hours)
- Add global response interceptor
- Add global validation pipe
- Update Swagger with Bearer auth
- Add Khmer language support

### Phase 6: Testing & Seed Data (2-4 hours)
- Test authentication flow
- Test multi-language support
- Verify Ant Design Pro compatibility
- Test auto-gen script compatibility

---

## File Structure

```
src/
├── common/
│   ├── constants/
│   │   ├── status-codes.yaml
│   │   ├── status-codes.ts (auto-generated)
│   │   ├── entity-status.yaml
│   │   └── entity-status.ts (auto-generated)
│   ├── decorators/
│   │   └── api-response.decorator.ts
│   ├── interceptors/
│   │   └── response.interceptor.ts
│   └── interfaces/
│       └── api-response.interface.ts
├── config/
│   └── database.config.ts
├── database/
│   ├── entities/
│   │   ├── base.entity.ts
│   │   ├── center-user.entity.ts
│   │   ├── center-user-role.entity.ts
│   │   ├── menu.entity.ts
│   │   ├── refresh-token.entity.ts
│   │   ├── role-menu.entity.ts
│   │   ├── role.entity.ts
│   │   └── index.ts
│   ├── migrations/
│   └── seeds/
│       └── initial-seed.ts
├── modules/
│   ├── auth/
│   │   ├── decorators/
│   │   ├── dto/
│   │   ├── guards/
│   │   ├── strategies/
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   ├── center-users/
│   │   ├── dto/
│   │   ├── center-users.controller.ts
│   │   ├── center-users.module.ts
│   │   └── center-users.service.ts
│   ├── menus/
│   │   ├── dto/
│   │   ├── menus.controller.ts
│   │   ├── menus.module.ts
│   │   └── menus.service.ts
│   └── roles/
│       ├── dto/
│       ├── roles.controller.ts
│       ├── roles.module.ts
│       └── roles.service.ts
└── i18n/
    ├── en/
    │   └── common.json
    └── kh/
        └── common.json
```

---

## Success Criteria

✅ PostgreSQL database with all 6 tables
✅ Database migrations created and executable
✅ Seed data with System Settings menu
✅ TypeORM entities with proper relationships
✅ JWT authentication with refresh tokens
✅ Role-based menu access control
✅ Multi-language support (English + Khmer)
✅ Hierarchical menu structure
✅ POST-only API endpoints
✅ System Setting APIs under `/admin/v1/system-setting/*`
✅ Unified response format with interceptor
✅ Centralized status codes in YAML file
✅ Entity status stored as VARCHAR strings with TypeScript enums
✅ Specific filter fields for all list endpoints
✅ Swagger YAML compatible with auto-gen script
✅ Ant Design Pro Table compatibility
✅ All APIs documented in Swagger

---

## Next Steps

1. Start with Phase 1: Install dependencies
2. Create database configuration
3. Set up entities and migrations
4. Build modules incrementally
5. Test each phase before moving forward

