import { ApiProperty } from '@nestjs/swagger';

// Data classes for nested objects
export class AuthTokenData {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refresh_token: string;

  @ApiProperty({ example: 3600 })
  expires_in: number;
}

export class AuthUserData {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'john_doe' })
  username: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: 'John' })
  first_name: string | null;

  @ApiProperty({ example: 'Doe' })
  last_name: string | null;

  @ApiProperty({ example: '+1234567890' })
  phone_number: string | null;

  @ApiProperty({ example: 'https://example.com/avatar.jpg' })
  avatar_url: string | null;

  @ApiProperty({ example: 'active' })
  status: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  last_login_at: Date | null;
}

export class MenuItemData {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  parent_id: number | null;

  @ApiProperty({ example: 'dashboard' })
  code: string;

  @ApiProperty({ example: { en: 'Dashboard', kh: 'ផ្ទាំងគ្រប់គ្រង' } })
  labels: Record<string, string>;

  @ApiProperty({ example: 'dashboard' })
  icon: string | null;

  @ApiProperty({ example: '/dashboard' })
  route_path: string | null;

  @ApiProperty({ example: 1 })
  sort_order: number;

  @ApiProperty({ type: [Object] })
  children?: MenuItemData[];
}

// Response classes
export class AuthRegisterResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'john_doe' })
  username: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: 'John' })
  first_name: string | null;

  @ApiProperty({ example: 'Doe' })
  last_name: string | null;

  @ApiProperty({ example: '+1234567890' })
  phone_number: string | null;

  @ApiProperty({ example: 'https://example.com/avatar.jpg' })
  avatar_url: string | null;

  @ApiProperty({ example: 'active' })
  status: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  last_login_at: Date | null;
}

export class AuthLoginResponse {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refresh_token: string;

  @ApiProperty({ example: 3600 })
  expires_in: number;
}

export class AuthRefreshTokenResponse {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refresh_token: string;

  @ApiProperty({ example: 3600 })
  expires_in: number;
}

export class AuthLogoutResponse {
  @ApiProperty({ example: 'success' })
  message: string;
}

export class AuthProfileResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'john_doe' })
  username: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: 'John' })
  first_name: string | null;

  @ApiProperty({ example: 'Doe' })
  last_name: string | null;

  @ApiProperty({ example: '+1234567890' })
  phone_number: string | null;

  @ApiProperty({ example: 'https://example.com/avatar.jpg' })
  avatar_url: string | null;

  @ApiProperty({ example: 'active' })
  status: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  last_login_at: Date | null;
}

export class AuthMenusResponse {
  @ApiProperty({ type: [MenuItemData] })
  menus: MenuItemData[];
}
