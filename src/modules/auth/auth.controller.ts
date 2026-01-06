import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthRegisterRequest } from './dto/register.dto';
import { AuthLoginRequest } from './dto/login.dto';
import { AuthRefreshTokenRequest } from './dto/refresh-token.dto';
import {
  AuthRegisterResponse,
  AuthLoginResponse,
  AuthRefreshTokenResponse,
  AuthLogoutResponse,
  AuthProfileResponse,
  AuthMenusResponse,
} from './dto/auth-response.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtRefreshAuthGuard } from '../../common/guards/jwt-refresh-auth.guard';
import { CenterUser } from '../../database/entities/center-user.entity';

@ApiTags('Authentication')
@Controller('admin/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, type: AuthRegisterResponse })
  register(@Body() registerDto: AuthRegisterRequest) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login with username and password' })
  @ApiResponse({ status: 200, type: AuthLoginResponse })
  login(@Body() loginDto: AuthLoginRequest) {
    return this.authService.login(loginDto);
  }

  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ status: 200, type: AuthRefreshTokenResponse })
  refresh(
    @Body() refreshTokenDto: AuthRefreshTokenRequest,
    @CurrentUser() payload: any,
  ) {
    return this.authService.refresh(
      refreshTokenDto.refresh_token,
      payload.tokenId,
    );
  }

  @Post('logout')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Logout and revoke refresh token' })
  @ApiResponse({ status: 200, type: AuthLogoutResponse })
  logout(@CurrentUser() user: any, @Body('token_id') tokenId: number) {
    return this.authService.logout(user.id, tokenId);
  }

  @Post('profile')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, type: AuthProfileResponse })
  getProfile(@CurrentUser() user: CenterUser) {
    return this.authService.getProfile(user.id);
  }

  @Post('menus')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Get user accessible menus in hierarchical structure' })
  @ApiResponse({ status: 200, type: AuthMenusResponse })
  getMenus(@CurrentUser() user: CenterUser) {
    return this.authService.getMenus(user.id);
  }
}
