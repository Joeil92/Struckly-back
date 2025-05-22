import { Body, Controller, Logger, Patch, Request } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { UserService } from './user.service'
import { ResetPasswordConfirmDto } from './dto/reset-password-confirm.dto'

@ApiBearerAuth()
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name)

  constructor(private userService: UserService) {}

  @Patch('reset-password/confirm')
  async resetPasswordConfirm(
    @Request() request: Request,
    @Body() ResetPasswordConfirmDto: ResetPasswordConfirmDto
  ) {
    this.logger.log(`${request.method} ${request.url}`)
    return this.userService.resetPasswordConfirm(ResetPasswordConfirmDto)
  }
}
