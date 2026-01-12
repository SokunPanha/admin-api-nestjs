# Menu Access Control Implementation Guide

This document explains how to implement comprehensive menu access control in the application, ensuring that users cannot access inactive or unauthorized menus via direct URL navigation.

## Problem Statement

Currently, the frontend hides inactive menus from the navigation sidebar, but users can still access those routes by typing the URL directly. We need to enforce menu access control at both the frontend (route level) and backend (API level).

## Solution Architecture

### Backend: API-Level Menu Access Control

#### 1. Menu Access Guard

**File:** `src/common/guards/menu-access.guard.ts`

The `MenuAccessGuard` validates:
- Menu exists in the database
- Menu status is `active`
- Menu is visible (`is_visible = true`)
- User's role has been assigned access to the menu

**Usage Example:**

```typescript
import { MenuPath, SkipMenuCheck } from './common/guards/menu-access.guard';

@Controller('users')
export class UsersController {

  // Protect this endpoint - requires access to /admin/users menu
  @MenuPath('/admin/users')
  @Post('list')
  async listUsers() {
    // Only accessible if user has access to /admin/users menu
  }

  // Skip menu check for this specific endpoint
  @SkipMenuCheck()
  @Get('profile')
  async getProfile() {
    // Accessible to all authenticated users
  }
}
```

#### 2. Applying the Guard Globally

Add the `MenuAccessGuard` to your `AppModule` or relevant module:

```typescript
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuAccessGuard } from './common/guards/menu-access.guard';
import { Menu } from './database/entities/menu.entity';
import { RoleMenu } from './database/entities/role-menu.entity';

@Module({
  imports: [
    // ... other imports
    TypeOrmModule.forFeature([Menu, RoleMenu]),
  ],
  providers: [
    // Apply JWT guard first
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Apply Roles guard second
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // Apply Menu Access guard third (after authentication)
    {
      provide: APP_GUARD,
      useClass: MenuAccessGuard,
    },
  ],
})
export class AppModule {}
```

**Important:** Guard execution order matters:
1. `JwtAuthGuard` - Authenticates user
2. `RolesGuard` - Checks role-based permissions
3. `MenuAccessGuard` - Validates menu access

#### 3. Decorators Reference

**`@MenuPath(path: string)`**
- Specifies the frontend route path that corresponds to this API endpoint
- Guard will check if user has access to this menu path
- Example: `@MenuPath('/admin/users')`

**`@SkipMenuCheck()`**
- Skips menu access validation for specific routes
- Use for public endpoints or system endpoints (login, refresh, etc.)
- Example: `@SkipMenuCheck()`

#### 4. Example Controller Implementation

```typescript
import { Controller, Post, Get, Body } from '@nestjs/common';
import { MenuPath, SkipMenuCheck } from '../common/guards/menu-access.guard';
import { Public } from '../common/decorators/public.decorator';

@Controller('center-users')
export class CenterUsersController {

  // Menu-protected endpoint
  @MenuPath('/admin/system-settings/users')
  @Post('list')
  async listUsers(@Body() listDto: UserListRequest) {
    // Requires user to have access to /admin/system-settings/users menu
    return this.usersService.list(listDto);
  }

  // Menu-protected endpoint
  @MenuPath('/admin/system-settings/users')
  @Post('create')
  async createUser(@Body() createDto: UserCreateRequest) {
    // Requires user to have access to /admin/system-settings/users menu
    return this.usersService.create(createDto);
  }

  // Skip menu check for user profile (all authenticated users can access)
  @SkipMenuCheck()
  @Get('profile')
  async getProfile(@CurrentUser() user: CenterUser) {
    return this.usersService.findById(user.id);
  }

  // Public endpoint (no authentication required)
  @Public()
  @SkipMenuCheck()
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordRequest) {
    return this.usersService.sendPasswordReset(dto);
  }
}
```

### Frontend: Route-Level Access Control

#### 1. Create Menu Access Utility

**File:** `src/lib/menuAccess.ts`

```typescript
import { MenuItemData } from '@/core/services/api';

/**
 * Check if user has access to a specific route based on menu data
 */
export function hasMenuAccess(
  route: string,
  menuItems: MenuItemData[],
): boolean {
  for (const item of menuItems) {
    // Check direct match
    if (item.route_path === route) {
      return true;
    }

    // Check children recursively
    if (item.children && item.children.length > 0) {
      if (hasMenuAccess(route, item.children)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Get all accessible route paths from menu items
 */
export function getAccessibleRoutes(menuItems: MenuItemData[]): string[] {
  const routes: string[] = [];

  function collectRoutes(items: MenuItemData[]) {
    for (const item of items) {
      if (item.route_path) {
        routes.push(item.route_path);
      }
      if (item.children && item.children.length > 0) {
        collectRoutes(item.children);
      }
    }
  }

  collectRoutes(menuItems);
  return routes;
}
```

#### 2. Update Middleware for Route Protection

**File:** `src/middleware.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');
  const { pathname } = request.nextUrl;

  // Protected routes
  const isProtectedRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname.startsWith('/login');

  // System pages that don't require menu access
  const isSystemPage =
    pathname === '/admin' ||
    pathname === '/admin/profile' ||
    pathname === '/admin/settings' ||
    pathname === '/service-unavailable';

  // Redirect to login if not authenticated
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to admin if already logged in
  if (isLoginPage && token) {
    const adminUrl = new URL('/admin', request.url);
    return NextResponse.redirect(adminUrl);
  }

  // For protected routes (except system pages), we'll validate menu access client-side
  // The middleware only handles authentication, menu validation happens in the page component

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
```

#### 3. Create Route Guard Component

**File:** `src/components/RouteGuard/index.tsx`

```typescript
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMenuData } from '../Layout/hooks/useMenuData';
import { hasMenuAccess } from '@/lib/menuAccess';
import { Result, Spin } from 'antd';
import { LockOutlined } from '@ant-design/icons';

interface RouteGuardProps {
  children: React.ReactNode;
  skipCheck?: boolean; // Allow bypassing check for certain pages
}

export function RouteGuard({ children, skipCheck = false }: RouteGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { menuData, loading, error } = useMenuData();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (skipCheck) {
      setHasAccess(true);
      return;
    }

    if (loading) {
      return;
    }

    if (error || !menuData) {
      setHasAccess(false);
      return;
    }

    // Check if current path has menu access
    const menuItems = menuData.routes || [];
    const access = hasMenuAccess(pathname, menuItems as any);

    setHasAccess(access);

    if (!access) {
      // Optionally redirect to a "no access" page or homepage
      // router.push('/admin/no-access');
    }
  }, [pathname, menuData, loading, error, skipCheck]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (hasAccess === false) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you don't have permission to access this page."
        icon={<LockOutlined />}
        extra={
          <a href="/admin">
            Back to Home
          </a>
        }
      />
    );
  }

  return <>{children}</>;
}
```

#### 4. Apply Route Guard to Pages

**File:** `src/app/admin/system-settings/users/page.tsx`

```typescript
import { RouteGuard } from '@/components/RouteGuard';
import UsersPage from '@/components/Page/Center/Users';

export default function Page() {
  return (
    <RouteGuard>
      <UsersPage />
    </RouteGuard>
  );
}
```

**For system pages (skip menu check):**

```typescript
import { RouteGuard } from '@/components/RouteGuard';
import ProfilePage from '@/components/Page/Profile';

export default function Page() {
  return (
    <RouteGuard skipCheck>
      <ProfilePage />
    </RouteGuard>
  );
}
```

## Implementation Checklist

### Backend
- [ ] Create `MenuAccessGuard` in `src/common/guards/menu-access.guard.ts`
- [ ] Add guard to `AppModule` providers with `APP_GUARD`
- [ ] Add `TypeOrmModule.forFeature([Menu, RoleMenu])` to module imports
- [ ] Add `@MenuPath('/route')` decorator to all protected endpoints
- [ ] Add `@SkipMenuCheck()` to system endpoints (auth, refresh, profile)
- [ ] Test API endpoints return 403 for inactive menus

### Frontend
- [ ] Create `menuAccess.ts` utility in `src/lib/`
- [ ] Create `RouteGuard` component in `src/components/RouteGuard/`
- [ ] Wrap all protected pages with `<RouteGuard>`
- [ ] Add `skipCheck` prop for system pages
- [ ] Test route navigation blocks access to inactive menus

## Testing

### Backend Testing

```bash
# Test with inactive menu
1. Mark a menu as inactive in database
2. Try to access the corresponding API endpoint
3. Should return 403 Forbidden

# Test with role without menu access
1. Remove menu assignment from user's role
2. Try to access the API endpoint
3. Should return 403 Forbidden

# Test with active menu and proper access
1. Ensure menu is active
2. Ensure user's role has menu assigned
3. Should return success
```

### Frontend Testing

```bash
# Test route guard
1. Mark a menu as inactive
2. Refresh to reload menu data
3. Try to navigate to the route via URL
4. Should see 403 error page

# Test navigation
1. Menu should be hidden from sidebar (already working)
2. Direct URL access should be blocked (new behavior)
3. User should see access denied message
```

## Error Messages

**Backend Error Messages:**
- `"Menu not found"` - Menu doesn't exist in database
- `"This menu is currently inactive"` - Menu status is not active
- `"This menu is not accessible"` - Menu is_visible is false
- `"User has no roles assigned"` - User has no roles
- `"You do not have permission to access this menu"` - Role doesn't have menu access

**Frontend Error Messages:**
- `"403 - Sorry, you don't have permission to access this page"`

## Best Practices

1. **Always use decorators** - Never protect routes manually, use `@MenuPath()` consistently
2. **Skip system routes** - Use `@SkipMenuCheck()` for auth, profile, settings
3. **Match paths exactly** - Ensure `/admin/users` in menu matches decorator path
4. **Test both layers** - Always test both frontend route guard and backend API guard
5. **Graceful degradation** - Show user-friendly error messages, not technical errors

## Troubleshooting

**Issue: Guard not working**
- Check guard is registered in `AppModule` providers
- Verify `TypeOrmModule.forFeature([Menu, RoleMenu])` is imported
- Ensure JWT guard runs before Menu guard

**Issue: All requests blocked**
- Check if `@MenuPath()` decorator is on correct methods
- Verify menus in database have correct `route_path`
- Use `@SkipMenuCheck()` for auth endpoints

**Issue: Frontend shows page but API returns 403**
- Menu data might be cached, refresh browser
- Check menu status in database is `active`
- Verify user's role has menu assignment in `role_menus` table

## Database Schema Reference

```sql
-- Menus table
CREATE TABLE menus (
  id BIGSERIAL PRIMARY KEY,
  parent_id BIGINT REFERENCES menus(id),
  labels JSONB NOT NULL,  -- {"en": "Users", "zh": "用户"}
  icon VARCHAR(100),
  route_path VARCHAR(255),  -- '/admin/users'
  sort_order INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',  -- active, inactive, draft
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Role-Menu junction table
CREATE TABLE role_menus (
  id BIGSERIAL PRIMARY KEY,
  role_id BIGINT REFERENCES roles(id) ON DELETE CASCADE,
  menu_id BIGINT REFERENCES menus(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(role_id, menu_id)
);
```

## API Endpoints

- `POST /admin/v1/auth/menus` - Get user's accessible menus
- `POST /admin/v1/system-setting/menus/list` - List all menus (admin)
- `POST /admin/v1/system-setting/menus/update-status` - Update menu status
- `POST /admin/v1/system-setting/roles/assign-menus` - Assign menus to role
