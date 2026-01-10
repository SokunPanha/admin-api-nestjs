import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CenterUser } from '../../../database/entities/center-user.entity';
import { UserStatus } from '../../../common/constants/entity-status';
import { StatusCode } from '../../../common/constants/status-codes';

export interface JwtPayload {
  sub: number;
  username: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    @InjectRepository(CenterUser)
    private userRepository: Repository<CenterUser>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET') || 'default-secret',
    });
  }
  async validate(payload: JwtPayload) {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      relations: ['user_roles', 'user_roles.role', 'user_roles.role.role_menus', 'user_roles.role.role_menus.menu'],
    });

    if (!user) {
      throw new UnauthorizedException({
        code: StatusCode.USER_NOT_FOUND,
        message: 'User not found',
      });
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException({
        code: StatusCode.ACCOUNT_NOT_ACTIVE,
        message: 'User account is not active',
      });
    }

    // Remove password from response
    delete user.password_hash;

    return user;
  }
}
