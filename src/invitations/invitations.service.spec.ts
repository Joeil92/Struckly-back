import { Test } from '@nestjs/testing'
import { InvitationsService } from './invitations.service'
import { Invitation, InvitationStatus } from './invitation.entity'
import { Entreprise } from '../entreprises/entreprise.entity'
import { User } from '../users/user.entity'
import { MailerService } from '../mailer/mailer.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { CreateInvitationDto } from './dto/create-invitation.dto'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'

const oneInvitation: Invitation = {
  id: 1,
  sender: {
    id: '1',
    entreprise: {
      id: 1,
    },
  } as User,
  entreprise: {
    id: 1,
  } as Entreprise,
  email: 'test@test.com',
  token: '123456789',
  status: InvitationStatus.PENDING,
  validatedAt: null,
  createdAt: new Date(),
}

const invitationDto: CreateInvitationDto = {
  emails: ['test@test.com', 'test2@test.com'],
}

describe('InvitationsService', () => {
  let service: InvitationsService

  const mockUserRepository = {
    findOne: jest.fn(),
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        InvitationsService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Invitation),
          useValue: {
            save: jest.fn().mockResolvedValue([oneInvitation]),
            find: jest.fn().mockResolvedValue([oneInvitation]),
          },
        },
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn().mockResolvedValue({ messageId: '1' }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockResolvedValue(''),
          },
        },
      ],
    }).compile()

    service = module.get(InvitationsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => 'hash')

    it('should send invitations', async () => {
      mockUserRepository.findOne.mockResolvedValue(oneInvitation.sender)

      const invitation = {
        id: oneInvitation.id,
        email: oneInvitation.email,
        status: InvitationStatus.PENDING,
        validatedAt: oneInvitation.validatedAt,
        createdAt: oneInvitation.createdAt,
      }

      const create = await service.create(
        invitationDto,
        oneInvitation.sender.id
      )

      expect(create).toEqual([invitation])
      expect(create).not.toHaveProperty(['token', 'sender', 'entreprise'])
    })

    it('should throw an error if sender does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null)

      await expect(
        service.create(invitationDto, oneInvitation.sender.id)
      ).rejects.toThrow('User not found')
    })

    it('should throw an error if sender has no company', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        ...oneInvitation.sender,
        entreprise: null,
      })

      await expect(
        service.create(invitationDto, oneInvitation.sender.id)
      ).rejects.toThrow('User has no company')
    })
  })
})
