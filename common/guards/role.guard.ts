import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from 'common/decorators/role.decorator'
import { UserRole } from 'src/users/user.entity'
import { Payload } from '../../src/auth/types/payload.interface'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    )

    if (!requiredRoles) {
      return true
    }

    const { user }: { user: Payload } = context.switchToHttp().getRequest()
    return requiredRoles.some((role) => user.roles.includes(role))
  }
}
