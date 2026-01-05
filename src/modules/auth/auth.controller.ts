import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
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
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login with username and password' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
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
  logout(@CurrentUser() user: any, @Body('token_id') tokenId: number) {
    return this.authService.logout(user.id, tokenId);
  }

  @Post('profile')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@CurrentUser() user: CenterUser) {
    return this.authService.getProfile(user.id);
  }
}
