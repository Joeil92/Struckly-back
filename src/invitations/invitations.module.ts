import { Module } from '@nestjs/common'
import { InvitationsController } from './invitations.controller'
import { InvitationsService } from './invitations.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Invitation } from './invitation.entity'
import { User } from '../users/user.entity'
import { MailerModule } from '../mailer/mailer.module'

@Module({
  imports: [TypeOrmModule.forFeature([Invitation, User]), MailerModule],
  controllers: [InvitationsController],
  providers: [InvitationsService],
  exports: [InvitationsService],
})
export class InvitationsModule {}
