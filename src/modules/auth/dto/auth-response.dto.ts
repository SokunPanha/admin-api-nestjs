import { ApiProperty } from '@nestjs/swagger';
import { MultiLanguageText } from '../../../common/types/multi-language.type';

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
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: Number, example: 1, nullable: true })
  parent_id: number | null;

  @ApiProperty({ type: String, example: 'dashboard' })
  code: string;

  @ApiProperty({ type: MultiLanguageText })
  labels: MultiLanguageText;

  @ApiProperty({ type: String, example: 'dashboard', nullable: true })
  icon: string | null;

  @ApiProperty({ type: String, example: '/dashboard', nullable: true })
  route_path: string | null;

  @ApiProperty({ type: Number, example: 1 })
  sort_order: number;

  @ApiProperty({ type: [MenuItemData], required: false })
  children?: MenuItemData[];
}

// Response classes
export class AuthRegisterResponse {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: String, example: 'john_doe' })
  username: string;

  @ApiProperty({ type: String, example: 'john@example.com' })
  email: string;

  @ApiProperty({ type: String, example: 'John', nullable: true })
  first_name: string | null;

  @ApiProperty({ type: String, example: 'Doe', nullable: true })
  last_name: string | null;

  @ApiProperty({ type: String, example: '+1234567890', nullable: true })
  phone_number: string | null;

  @ApiProperty({ type: String, example: 'https://example.com/avatar.jpg', nullable: true })
  avatar_url: string | null;

  @ApiProperty({ type: String, example: 'active' })
  status: string;

  @ApiProperty({ type: Date, example: '2024-01-01T00:00:00.000Z', nullable: true })
  last_login_at: Date | null;
}

export class AuthLoginResponse {
  @ApiProperty({ type: String, example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ type: String, example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refresh_token: string;

  @ApiProperty({ type: Number, example: 3600 })
  expires_in: number;
}

export class AuthRefreshTokenResponse {
  @ApiProperty({ type: String, example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ type: String, example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refresh_token: string;

  @ApiProperty({ type: Number, example: 3600 })
  expires_in: number;
}

export class AuthLogoutResponse {
  @ApiProperty({ type: String, example: 'success' })
  message: string;
}

export class AuthProfileResponse {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: String, example: 'john_doe' })
  username: string;

  @ApiProperty({ type: String, example: 'john@example.com' })
  email: string;

  @ApiProperty({ type: String, example: 'John', nullable: true })
  first_name: string | null;

  @ApiProperty({ type: String, example: 'Doe', nullable: true })
  last_name: string | null;

  @ApiProperty({ type: String, example: '+1234567890', nullable: true })
  phone_number: string | null;

  @ApiProperty({ type: String, example: 'https://example.com/avatar.jpg', nullable: true })
  avatar_url: string | null;

  @ApiProperty({ type: String, example: 'active' })
  status: string;

  @ApiProperty({ type: Date, example: '2024-01-01T00:00:00.000Z', nullable: true })
  last_login_at: Date | null;
}

export class AuthMenusResponse {
  @ApiProperty({ type: [MenuItemData] })
  menus: MenuItemData[];
}
