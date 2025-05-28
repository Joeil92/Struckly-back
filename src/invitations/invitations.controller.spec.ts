import { Test } from '@nestjs/testing'
import { CreateInvitationDto } from './dto/create-invitation.dto'
import { InvitationsController } from './invitations.controller'
import { InvitationsService } from './invitations.service'
import * as httpMocks from 'node-mocks-http'
import { Invitation, InvitationStatus } from './invitation.entity'
import { RequestAuthenticated } from '../../common/types/requestAuthenticated.interface'
import { User } from '../users/user.entity'
import { Entreprise } from '../entreprises/entreprise.entity'

const invitationsDto: CreateInvitationDto = {
  emails: ['test@test.com', 'test2@test.com'],
}

const invitation: Invitation = {
  id: 1,
  sender: {
    id: '1',
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

describe('InvitationsController', () => {
  let invitationsController: InvitationsController
  let invitationsService: InvitationsService

  const mockService = {
    create: jest.fn(),
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [InvitationsController],
      providers: [
        InvitationsService,
        {
          provide: InvitationsService,
          useValue: mockService,
        },
      ],
    }).compile()

    invitationsService = moduleRef.get(InvitationsService)
    invitationsController = moduleRef.get(InvitationsController)
  })

  it('should be defined', () => {
    expect(invitationsController).toBeDefined()
  })

  describe('create', () => {
    const req: RequestAuthenticated = httpMocks.createRequest({
      method: 'POST',
      url: 'api/v1/invitations',
      user: {
        id: '1',
      },
    })

    it('should send invitations', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { token, entreprise, ...invitations } = invitation

      mockService.create.mockResolvedValue([invitations])

      await expect(
        invitationsController.create(req, invitationsDto)
      ).resolves.toEqual([invitations])
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(invitationsService.create).toHaveBeenCalledWith(
        invitationsDto,
        req.user.id
      )
    })
  })
})
