import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entity/user.entity'
import { UserService } from './user.service'
import { APP_GUARD } from '@nestjs/core'
import { RolesGuard } from 'common/guard/role.guard'
import { UserController } from './user.controller'
import { AuthModule } from '../auth/auth.module'
import { MailerModule } from '../mailer/mailer.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    MailerModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
