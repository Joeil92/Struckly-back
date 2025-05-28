import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { ResetPasswordConfirmDto } from './dto/reset-password-confirm.dto'
import { ConfigService } from '@nestjs/config'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { MailerService } from '../mailer/mailer.service'
import * as crypto from 'crypto'
import { SendMailDto } from '../mailer/dto/send-mail.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { InvitationsService } from '../invitations/invitations.service'
import { AuthService } from '../auth/auth.service'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private mailerService: MailerService,
    private invitationsService: InvitationsService,
    private configService: ConfigService
  ) {}

  async create(userDto: CreateUserDto) {
    const userByEmail = await this.findByEmail(userDto.email)
    if (userByEmail) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT)
    }

    const user = new User()
    user.email = userDto.email
    user.firstName = userDto.firstName
    user.lastName = userDto.lastName
    user.gender = userDto.gender
    user.password = await bcrypt.hash(
      userDto.password,
      Number(this.configService.get<number>('SALT_ROUNDS'))
    )

    if (userDto.invitationToken) {
      const invitation =
        await this.invitationsService.checkAndConfirmInvitation(
          userDto.email,
          userDto.invitationToken
        )
      user.entreprise = invitation.entreprise
    }

    const userSaved = await this.userRepository.save(user)

    return this.authService.generateTokens(userSaved)
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .andWhere('user.deletedAt IS NULL')
      .getOne()
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
      return
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

    await this.mailerService.sendMail(mailOptions, 'reset-password')

    await this.userRepository.save(user)
  }

  async resetPasswordConfirm(
    resetPasswordDto: ResetPasswordConfirmDto
  ): Promise<{ message: string }> {
    const user = await this.findById(resetPasswordDto.userId)

    if (!user || !user.resetToken || !user.tokenExpiresAt) {
      throw new HttpException('Invalid payload', HttpStatus.BAD_REQUEST)
    }

    if (user.tokenExpiresAt < new Date()) {
      throw new HttpException('Token expired', HttpStatus.GONE)
    }

    const isValid = await bcrypt.compare(
      resetPasswordDto.token,
      user.resetToken
    )

    if (!isValid) {
      throw new HttpException('Invalid payload', HttpStatus.BAD_REQUEST)
    }

    user.password = await bcrypt.hash(
      resetPasswordDto.password,
      Number(this.configService.get<number>('SALT_ROUNDS'))
    )
    user.resetToken = null
    user.tokenExpiresAt = null
    await this.userRepository.save(user)

    return { message: 'Password reset successfully' }
  }
}
