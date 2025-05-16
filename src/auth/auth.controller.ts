import { Body, Controller, Logger, Post, Request } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CredentialsDto } from './dto/credentials.dto'
import { Public } from '../../common/decorator/auth.decorator'
import { ApiResponse } from '@nestjs/swagger'
import { RefreshTokenDto } from './dto/refresh-token.dto'

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name)

  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'Successfully signed in',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async signIn(
    @Request() request: Request,
    @Body() credentials: CredentialsDto
  ) {
    this.logger.log(`${request.method} ${request.url}`)
    return this.authService.signIn(credentials)
  }

  @Post('refresh')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'Successfully refreshed token',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async refresh(
    @Request() request: Request,
    @Body() { refresh_token }: RefreshTokenDto
  ) {
    this.logger.log(`${request.method} ${request.url}`)
    return this.authService.verifyRefreshToken(refresh_token)
  }
}
