import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { UsersService } from './users.service'
import { APP_GUARD } from '@nestjs/core'
import { RolesGuard } from 'common/guards/role.guard'
import { UsersController } from './users.controller'
import { MailerModule } from '../mailer/mailer.module'

@Module({
  imports: [TypeOrmModule.forFeature([User]), MailerModule],
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
