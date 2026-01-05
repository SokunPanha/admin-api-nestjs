import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CenterUser } from '../../../database/entities/center-user.entity';
import { RefreshToken } from '../../../database/entities/refresh-token.entity';

export interface JwtRefreshPayload {
  sub: number;
  username: string;
  tokenId: number;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private configService: ConfigService,
    @InjectRepository(CenterUser)
    private userRepository: Repository<CenterUser>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET') || 'default-refresh-secret',
    });
  }

  async validate(payload: JwtRefreshPayload) {
    // Verify refresh token exists and is not revoked
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { id: payload.tokenId },
    });

    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (refreshToken.revoked_at) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    if (refreshToken.expires_at < new Date()) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    // Get user
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Remove password from response
    delete user.password_hash;

    return { user, tokenId: payload.tokenId };
  }
}
