import { ApiProperty } from '@nestjs/swagger';

export class AuthRegisterResponse {
  @ApiProperty({ example: 201 })
  code: number;

  @ApiProperty({ example: 'User registered successfully' })
  message: string;

  @ApiProperty()
  data: any;
}

export class AuthLoginResponse {
  @ApiProperty({ example: 200 })
  code: number;

  @ApiProperty({ example: 'Login successful' })
  message: string;

  @ApiProperty()
  data: any;
}

export class AuthRefreshTokenResponse {
  @ApiProperty({ example: 200 })
  code: number;

  @ApiProperty({ example: 'Token refreshed successfully' })
  message: string;

  @ApiProperty()
  data: any;
}

export class AuthLogoutResponse {
  @ApiProperty({ example: 200 })
  code: number;

  @ApiProperty({ example: 'Logged out successfully' })
  message: string;

  @ApiProperty()
  data: any;
}

export class AuthProfileResponse {
  @ApiProperty({ example: 200 })
  code: number;

  @ApiProperty({ example: 'Profile retrieved successfully' })
  message: string;

  @ApiProperty()
  data: any;
}

export class AuthMenusResponse {
  @ApiProperty({ example: 200 })
  code: number;

  @ApiProperty({ example: 'Menus retrieved successfully' })
  message: string;

  @ApiProperty()
  data: any;
}
