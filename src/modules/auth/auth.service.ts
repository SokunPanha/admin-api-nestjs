import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { CenterUser } from '../../database/entities/center-user.entity';
import { RefreshToken } from '../../database/entities/refresh-token.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserStatus } from '../../common/constants/entity-status';
import { StatusCode } from '../../common/constants/status-codes';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(CenterUser)
    private userRepository: Repository<CenterUser>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if username already exists
    const existingUsername = await this.userRepository.findOne({
      where: { username: registerDto.username },
    });

    if (existingUsername) {
      throw new ConflictException({
        code: StatusCode.USERNAME_ALREADY_EXISTS,
        message: 'Username already exists',
      });
    }

    // Check if email already exists
    const existingEmail = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingEmail) {
      throw new ConflictException({
        code: StatusCode.EMAIL_ALREADY_EXISTS,
        message: 'Email already exists',
      });
    }

    // Hash password
    const password_hash = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const user = this.userRepository.create({
      ...registerDto,
      password_hash,
      status: UserStatus.PENDING_VERIFICATION,
    });

    await this.userRepository.save(user);

    // Remove password from response
    delete user.password_hash;

    return {
      code: StatusCode.CREATED,
      message: 'User registered successfully',
      data: user,
    };
  }

  async login(loginDto: LoginDto) {
    // Find user by username
    const user = await this.userRepository.findOne({
      where: { username: loginDto.username },
    });

    if (!user) {
      throw new UnauthorizedException({
        code: StatusCode.INVALID_CREDENTIALS,
        message: 'Invalid credentials',
      });
    }

    // Check if user is active
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException({
        code: StatusCode.ACCOUNT_NOT_ACTIVE,
        message: 'Account is not active',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password_hash || '');

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        code: StatusCode.INVALID_CREDENTIALS,
        message: 'Invalid credentials',
      });
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Update last login
    user.last_login_at = new Date();
    await this.userRepository.save(user);

    return {
      code: StatusCode.SUCCESS,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      },
    };
  }

  async refresh(refreshTokenString: string, tokenId: number) {
    // Get user from token
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { id: tokenId },
      relations: ['user'],
    });

    if (!refreshToken) {
      throw new UnauthorizedException({
        code: StatusCode.INVALID_REFRESH_TOKEN,
        message: 'Invalid refresh token',
      });
    }

    // Revoke old refresh token
    refreshToken.revoked_at = new Date();
    await this.refreshTokenRepository.save(refreshToken);

    // Generate new tokens
    const tokens = await this.generateTokens(refreshToken.user);

    return {
      code: StatusCode.SUCCESS,
      message: 'Token refreshed successfully',
      data: tokens,
    };
  }

  async logout(userId: number, tokenId: number) {
    // Revoke refresh token
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { id: tokenId, user: { id: userId } },
    });

    if (refreshToken) {
      refreshToken.revoked_at = new Date();
      await this.refreshTokenRepository.save(refreshToken);
    }

    return {
      code: StatusCode.SUCCESS,
      message: 'Logout successful',
      data: null,
    };
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['user_roles', 'user_roles.role', 'user_roles.role.role_menus', 'user_roles.role.role_menus.menu'],
    });

    if (!user) {
      throw new BadRequestException({
        code: StatusCode.USER_NOT_FOUND,
        message: 'User not found',
      });
    }

    // Remove password from response
    delete user.password_hash;

    return {
      code: StatusCode.SUCCESS,
      message: 'Profile retrieved successfully',
      data: user,
    };
  }

  private async generateTokens(user: CenterUser) {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    // Generate access token
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });

    // Generate refresh token JWT
    const refreshPayload = {
      sub: user.id,
      username: user.username,
      tokenId: 0, // Will be updated after saving
    };

    const refresh_token = this.jwtService.sign(refreshPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    // Hash the refresh token for storage
    const token_hash = await bcrypt.hash(refresh_token, 10);

    // Create refresh token record
    const refreshTokenRecord = this.refreshTokenRepository.create({
      user: { id: user.id },
      token_hash,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    const savedToken = await this.refreshTokenRepository.save(refreshTokenRecord);

    // Regenerate refresh token with actual tokenId
    const finalRefreshPayload = {
      sub: user.id,
      username: user.username,
      tokenId: savedToken.id,
    };

    const final_refresh_token = this.jwtService.sign(finalRefreshPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    return {
      access_token,
      refresh_token: final_refresh_token,
    };
  }
}
