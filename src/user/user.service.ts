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
import { ResetPasswordDto } from './dto/reset-password.dto'
import { MailerService } from '../mailer/mailer.service'
import * as crypto from 'crypto'
import { SendMailDto } from '../mailer/dto/send-mail.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private mailerService: MailerService,
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

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.findByEmail(resetPasswordDto.email)

    if (!user) {
      throw new HttpException('Invalid payload', HttpStatus.NOT_FOUND)
    }

    const token = crypto.randomBytes(32).toString('hex')
    const hash = await bcrypt.hash(
      token,
      Number(this.configService.get<number>('SALT_ROUNDS'))
    )
    user.resetToken = hash
    user.tokenExpiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours expiration

    const mailOptions: SendMailDto = {
      to: user.email,
      subject: 'Struckly - Reset your password',
      context: {
        firstname: user.firstName,
        resetPasswordUrl: `${this.configService.get<string>('APP_URL')}/reset-password/confirm?token=${token}&userId=${user.id}`,
      },
    }

    const mail = await this.mailerService.sendMail(
      mailOptions,
      'reset-password'
    )

    await this.userRepository.save(user)

    return mail.messageId
  }

  async resetPasswordConfirm(
    resetPasswordDto: ResetPasswordConfirmDto
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.findById(resetPasswordDto.userId)

    if (!user || !user.resetToken) {
      throw new HttpException('Invalid payload', HttpStatus.BAD_REQUEST)
    }

    const isValid = await bcrypt.compare(
      resetPasswordDto.token,
      user.resetToken
    )

    if (!isValid) {
      throw new HttpException('Invalid payload', HttpStatus.BAD_REQUEST)
    }

    if (user.tokenExpiresAt && user.tokenExpiresAt < new Date()) {
      throw new HttpException('Token expired', HttpStatus.GONE)
    }

    user.password = await bcrypt.hash(
      resetPasswordDto.password,
      Number(this.configService.get<number>('SALT_ROUNDS'))
    )
    user.resetToken = null
    user.tokenExpiresAt = null
    await this.userRepository.save(user)

    return this.authService.generateTokens(user)
  }
}
