import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayloadType } from 'src/utils/types';
import { Reflector } from '@nestjs/core';
import { UserType } from 'src/utils/enums';
import { UserService } from '../users.service';

@Injectable()
export class AuthRolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector, 
    private readonly userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: UserType[] = this.reflector.getAllAndOverride('roles', [context.getHandler(), context.getClass()]);

    if (!roles || roles.length === 0) {
      throw new UnauthorizedException('No roles defined');
    }

    // Get request from client
    const req: Request = context.switchToHttp().getRequest();
    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    if (!token || type !== 'Bearer') {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload: JwtPayloadType = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      );

      const user = await this.userService.getCurrentUser(payload.id);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (roles.includes(user.userType)) {
        req['user'] = payload;
        return true;
      } else {
        throw new UnauthorizedException('User does not have the required role');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}