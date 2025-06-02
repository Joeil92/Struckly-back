import { Test } from '@nestjs/testing'
import { InvitationsService } from './invitations.service'
import { Invitation, InvitationStatus } from './invitation.entity'
import { Organization } from '../organizations/organization.entity'
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
    organization: {
      id: 1,
    },
  } as User,
  organization: {
    id: 1,
  } as Organization,
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

  const mockInvitationRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  }

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
          useValue: mockInvitationRepository,
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
      mockInvitationRepository.save.mockResolvedValue([oneInvitation])
      mockInvitationRepository.find.mockResolvedValue([oneInvitation])

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
      expect(create).not.toHaveProperty(['token', 'sender', 'organization'])
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
        organization: null,
      })

      await expect(
        service.create(invitationDto, oneInvitation.sender.id)
      ).rejects.toThrow('User has no company')
    })
  })

  describe('checkAndConfirmInvitation', () => {
    it('should confirm and return invitation', async () => {
      mockInvitationRepository.findOne.mockResolvedValue(oneInvitation)
      mockInvitationRepository.save.mockResolvedValue(oneInvitation)
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true)
      await expect(
        service.checkAndConfirmInvitation('test@test.com', '123456789')
      ).resolves.toEqual(oneInvitation)
    })

    it('should throw an error if invitation not found', async () => {
      mockInvitationRepository.findOne.mockResolvedValue(null)

      await expect(
        service.checkAndConfirmInvitation('test@test.com', '123456789')
      ).rejects.toThrow('Invitation not found')
    })

    it('should throw an error if token is invalid', async () => {
      mockInvitationRepository.findOne.mockResolvedValue(oneInvitation)

      jest.spyOn(bcrypt, 'compare').mockImplementation(() => false)

      await expect(
        service.checkAndConfirmInvitation('test@test.com', '123456789')
      ).rejects.toThrow('Invalid token')
    })
  })
})
