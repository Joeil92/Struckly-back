import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Patch,
  Post,
  Request,
} from '@nestjs/common'
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { ResetPasswordConfirmDto } from './dto/reset-password-confirm.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { Public } from '../../common/decorators/auth.decorator'

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name)

  constructor(private usersService: UsersService) {}

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully send mail to reset password',
  })
  async resetPassword(
    @Request() request: Request,
    @Body() resetPasswordDto: ResetPasswordDto
  ) {
    this.logger.log(`${request.method} ${request.url}`)
    return this.usersService.resetPassword(resetPasswordDto)
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
    return this.usersService.resetPasswordConfirm(ResetPasswordConfirmDto)
  }
}
