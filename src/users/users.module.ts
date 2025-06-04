import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { UsersService } from './users.service'
import { APP_GUARD } from '@nestjs/core'
import { RolesGuard } from '../../common/guards/role.guard'
import { UsersController } from './users.controller'
import { MailerModule } from '../mailer/mailer.module'
import { InvitationsModule } from '../invitations/invitations.module'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    MailerModule,
    InvitationsModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
