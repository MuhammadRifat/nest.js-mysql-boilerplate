import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  matchRoles(types: string[], userType: string): boolean {
    return types.some((role) => userType?.includes(role));
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const types = this.reflector.get<string[]>(
        'userTypes',
        context.getHandler(),
      );

      if (!types) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const user: User = request.user;
      return this.matchRoles(types, user.role);
    } catch (error) {
      throw new ForbiddenException();
    }
  }
}