import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { CredentialsDto } from './dto/credentials.dto'
import { Payload } from './types/payload.interface'
import { UserService } from '../user/user.service'
import { User } from '../user/entity/user.entity'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  generateTokens(user: User) {
    const payload: Payload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      roles: user.roles,
    }

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1d' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    }
  }

  async signIn(
    credentials: CredentialsDto
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userService.findByEmail(credentials.email)

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    if (!user.password) {
      throw new HttpException('User has no password', HttpStatus.FORBIDDEN)
    }

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password
    )
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED)
    }

    return this.generateTokens(user)
  }

  async verifyRefreshToken(
    refreshToken: string
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payloadVerified = this.jwtService.verify<Payload>(refreshToken)

    if (!payloadVerified) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED)
    }

    const user = await this.userService.findByEmail(payloadVerified.email)

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    return this.generateTokens(user)
  }
}
