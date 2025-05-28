import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Invitation, InvitationStatus } from './invitation.entity'
import { In, Repository } from 'typeorm'
import { CreateInvitationDto } from './dto/create-invitation.dto'
import { User } from '../users/user.entity'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import { MailerService } from '../mailer/mailer.service'

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(Invitation)
    private invitationRepository: Repository<Invitation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailerService: MailerService,
    private configService: ConfigService
  ) {}

  async create({ emails }: CreateInvitationDto, senderId: string) {
    const user = await this.userRepository.findOne({
      where: { id: senderId },
      relations: ['entreprise'],
    })
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    if (!user.entreprise) {
      throw new HttpException('User has no company', HttpStatus.BAD_REQUEST)
    }

    const emailsAlreadyExist = await this.invitationRepository.find({
      where: { email: In(emails) },
      select: ['email'],
    })
    const existingEmails = emailsAlreadyExist.map((inv) => inv.email)
    const clearEmails = emails.filter(
      (email) => !existingEmails.includes(email)
    )

    if (clearEmails.length === 0) {
      throw new HttpException('Emails already exist', HttpStatus.CONFLICT)
    }

    const invitations = []
    for (const email of clearEmails) {
      const token = crypto.randomBytes(32).toString('hex')
      const hash = await bcrypt.hash(
        token,
        Number(this.configService.get<string>('SALT_ROUNDS'))
      )

      await this.mailerService.sendMail(
        {
          to: email,
          subject: 'Struckly - Invitation',
          context: {
            invitationUrl: `${this.configService.get<string>('APP_URL')}/invitations/confirm?token=${token}`,
          },
        },
        'invitation'
      )

      const invitation = new Invitation()
      invitation.email = email
      invitation.token = hash
      invitation.entreprise = user.entreprise!
      invitation.sender = user
      invitation.status = InvitationStatus.PENDING

      invitations.push(invitation)
    }

    const invitationsSaved = await this.invitationRepository.save(invitations)

    return invitationsSaved.map((invitation) => ({
      id: invitation.id,
      email: invitation.email,
      status: invitation.status,
      validatedAt: invitation.validatedAt,
      createdAt: invitation.createdAt,
    }))
  }

  async checkAndConfirmInvitation(
    email: string,
    token: string
  ): Promise<Invitation> {
    const invitation = await this.invitationRepository.findOne({
      where: { email, token },
      relations: ['sender', 'entreprise'],
    })

    if (!invitation) {
      throw new HttpException('Invitation not found', HttpStatus.NOT_FOUND)
    }

    const isValid = await bcrypt.compare(token, invitation.token)
    if (!isValid) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST)
    }

    invitation.status = InvitationStatus.VALIDATED
    invitation.validatedAt = new Date()
    return await this.invitationRepository.save(invitation)
  }
}
