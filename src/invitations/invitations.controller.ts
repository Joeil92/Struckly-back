import { Body, Controller, Logger, Post, Request } from '@nestjs/common'
import { RequestAuthenticated } from '../../common/types/requestAuthenticated.interface'
import { CreateInvitationDto } from './dto/create-invitation.dto'
import { InvitationsService } from './invitations.service'
import { ApiBearerAuth } from '@nestjs/swagger'

@ApiBearerAuth()
@Controller('invitations')
export class InvitationsController {
  private readonly logger = new Logger(InvitationsController.name)

  constructor(private invitationsService: InvitationsService) {}

  @Post()
  create(
    @Request() request: RequestAuthenticated,
    @Body() invitation: CreateInvitationDto
  ) {
    this.logger.log(`${request.method} ${request.url}`)
    return this.invitationsService.create(invitation, request.user.id)
  }
}
