import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entity/user.entity'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { AuthService } from '../auth/auth.service'
import { ResetPasswordConfirmDto } from './dto/reset-password-confirm.dto'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private configService: ConfigService
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({
      email,
      deletedAt: undefined,
    })
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOneBy({
      id,
      deletedAt: undefined,
    })
  }

  async resetPasswordConfirm(
    resetPasswordDto: ResetPasswordConfirmDto
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.findById(resetPasswordDto.userId)

    if (
      !user ||
      !user.resetToken ||
      user.resetToken !== resetPasswordDto.token
    ) {
      throw new HttpException('Invalid payload', HttpStatus.BAD_REQUEST)
    }

    if (user.tokenExpiresAt! < new Date()) {
      throw new HttpException('Token expired', HttpStatus.GONE)
    }

    user.password = await bcrypt.hash(
      resetPasswordDto.password,
      this.configService.get<number>('SALT_ROUNDS') as number
    )
    await this.userRepository.save(user)

    return this.authService.generateTokens(user)
  }
}
