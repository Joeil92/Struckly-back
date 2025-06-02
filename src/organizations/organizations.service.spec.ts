import { Test } from '@nestjs/testing'
import { OrganizationsService } from './organizations.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Organization } from './organization.entity'
import { CreateOrganizationDto } from './dto/create-organization'
import { User } from '../users/user.entity'
import * as slugify from '../../common/utils/slugify'

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

describe('OrganizationsService', () => {
  let service: OrganizationsService

  jest.spyOn(slugify, 'slugify').mockReturnValue('slug')

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    loadRelationCountAndMap: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockResolvedValue(oneOrganization),
  }

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OrganizationsService,
        {
          provide: getRepositoryToken(Organization),
          useValue: {
            save: jest.fn().mockResolvedValue(oneOrganization),
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile()

    service = module.get(OrganizationsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should successfully insert a organization', async () => {
      const organization: CreateOrganizationDto = {
        name: 'Organization Name',
        country: 'France',
      }

      mockUserRepository.findOne.mockResolvedValue({
        ...oneOrganization.owner,
        organization: null,
      })

      await expect(service.create(organization, '1')).resolves.toEqual(
        oneOrganization
      )
      expect(mockUserRepository.save).toHaveBeenCalled()
    })

    it('should throw an error if user already has an organization', async () => {
      const organization: CreateOrganizationDto = {
        name: 'Organization Name',
        country: 'France',
      }

      mockUserRepository.findOne.mockResolvedValue({
        ...oneOrganization.owner,
        organization: oneOrganization,
      })

      await expect(service.create(organization, '1')).rejects.toThrow(
        'User already has an organization'
      )
    })

    it('should throw an error if user not found', async () => {
      const organization: CreateOrganizationDto = {
        name: 'Organization Name',
        country: 'France',
      }

      mockUserRepository.findOne.mockResolvedValue(null)

      await expect(service.create(organization, '1')).rejects.toThrow(
        'User not found'
      )
    })
  })

  describe('findOrganizationByUserId()', () => {
    it('should return an organization if user exists', async () => {
      mockQueryBuilder.getOne.mockReturnValue(Promise.resolve(oneOrganization))

      const userId = '1'
      await expect(service.findByUserId(userId)).resolves.toEqual(
        oneOrganization
      )
    })

    it('should return null if not found', async () => {
      mockQueryBuilder.getOne.mockReturnValue(Promise.resolve(null))

      const userId = '1'
      await expect(service.findByUserId(userId)).resolves.toBeNull()
    })
  })
})
