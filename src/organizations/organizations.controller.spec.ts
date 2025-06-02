import { Test } from '@nestjs/testing'
import { OrganizationsController } from './organizations.controller'
import { OrganizationsService } from './organizations.service'
import { CreateOrganizationDto } from './dto/create-organization'
import * as httpMocks from 'node-mocks-http'
import { RequestAuthenticated } from '../../common/types/requestAuthenticated.interface'
import { Organization } from './organization.entity'
import { User } from '../users/user.entity'

const oneOrganization = new Organization()
oneOrganization.id = 1
oneOrganization.name = 'test'
oneOrganization.slug = 'test'
oneOrganization.country = 'France'
oneOrganization.address = 'test'
oneOrganization.city = 'Paris'
oneOrganization.postalCode = '75001'
oneOrganization.phoneNumber = '0123456789'
oneOrganization.owner = new User()
oneOrganization.website = 'http://test.com'

describe('OrganizationController', () => {
  let organizationsController: OrganizationsController
  let organizationsService: OrganizationsService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [OrganizationsController],
      providers: [
        {
          provide: OrganizationsService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation(() => Promise.resolve(oneOrganization)),
            findByUserId: jest
              .fn()
              .mockImplementation(() => Promise.resolve(oneOrganization)),
          },
        },
      ],
    }).compile()

    organizationsService = moduleRef.get(OrganizationsService)
    organizationsController = moduleRef.get(OrganizationsController)
  })

  it('should be defined', () => {
    expect(organizationsController).toBeDefined()
  })

  describe('create', () => {
    it('should add a new organization', async () => {
      const organization: CreateOrganizationDto = {
        name: 'test',
        country: 'France',
      }

      const req: RequestAuthenticated = httpMocks.createRequest({
        method: 'POST',
        url: 'api/v1/organizations',
        user: {
          id: '1',
        },
      })

      await expect(
        organizationsController.create(req, organization)
      ).resolves.toEqual(oneOrganization)
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(organizationsService.create).toHaveBeenCalledWith(
        organization,
        '1'
      )
    })
  })

  describe('findByUserId', () => {
    it('should return an organization if user exists', async () => {
      const req: RequestAuthenticated = httpMocks.createRequest({
        method: 'GET',
        url: 'api/v1/organizations/me',
        user: {
          id: '1',
        },
      })

      await expect(organizationsController.findByUserId(req)).resolves.toEqual(
        oneOrganization
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(organizationsService.findByUserId).toHaveBeenCalledWith(
        req.user.id
      )
    })
  })
})
