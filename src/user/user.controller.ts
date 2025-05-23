import {
  Body,
  Controller,
  HttpStatus,
  Logger,
  Patch,
  Post,
  Request,
} from '@nestjs/common'
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger'
import { UserService } from './user.service'
import { ResetPasswordConfirmDto } from './dto/reset-password-confirm.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { Public } from '../../common/decorator/auth.decorator'

@ApiBearerAuth()
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name)

  constructor(private userService: UserService) {}

  @Public()
  @Post('reset-password')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully send mail to reset password',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async resetPassword(
    @Request() request: Request,
    @Body() resetPasswordDto: ResetPasswordDto
  ) {
    this.logger.log(`${request.method} ${request.url}`)
    return this.userService.resetPassword(resetPasswordDto)
  }

  @Public()
  @Patch('reset-password/confirm')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully reset password',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid payload',
  })
  @ApiResponse({
    status: HttpStatus.GONE,
    description: 'Token expired',
  })
  async resetPasswordConfirm(
    @Request() request: Request,
    @Body() ResetPasswordConfirmDto: ResetPasswordConfirmDto
  ) {
    this.logger.log(`${request.method} ${request.url}`)
    return this.userService.resetPasswordConfirm(ResetPasswordConfirmDto)
  }
}
