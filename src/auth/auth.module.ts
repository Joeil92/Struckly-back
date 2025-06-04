import { forwardRef, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import authConfig from '../../config/auth.config'
import { AuthService } from './auth.service'
import { AuthGuard } from '../../common/guards/auth.guard'
import { AuthController } from './auth.controller'
import { UsersModule } from '../users/users.module'
import { APP_GUARD } from '@nestjs/core'

@Module({
  imports: [
    JwtModule.registerAsync(authConfig.asProvider()),
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
