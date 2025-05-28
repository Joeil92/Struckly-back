import { Test } from '@nestjs/testing'
import { EntreprisesService } from './entreprises.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Entreprise } from './entreprise.entity'
import { CreateEntrepriseDto } from './dto/create-entreprise'

const oneEntreprise = {
  compagnyName: 'Compagny Name',
  name: 'Entreprise Name',
  siretNumber: '123456789',
}

describe('EntreprisesService', () => {
  let service: EntreprisesService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntreprisesService,
        {
          provide: getRepositoryToken(Entreprise),
          useValue: {
            save: jest.fn().mockResolvedValue(oneEntreprise),
            findOneBy: jest
              .fn()
              .mockImplementation(({ siretNumber }: { siretNumber: string }) =>
                Promise.resolve(
                  siretNumber === '123456789' ? oneEntreprise : null
                )
              ),
            createQueryBuilder: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnThis(),
              leftJoin: jest.fn().mockReturnThis(),
              loadRelationCountAndMap: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(oneEntreprise),
            }),
          },
        },
      ],
    }).compile()

    service = module.get(EntreprisesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should successfully insert a entreprise', async () => {
      const entreprise: CreateEntrepriseDto = {
        compagnyName: 'Compagny Name',
        name: 'Entreprise Name',
        siretNumber: '12345678910',
        address: '1 rue de la maison',
        postalCode: '75001',
        city: 'Paris',
        country: 'France',
        email: 'john.doe@gmail.com',
        phoneNumber: '+33612345678',
        website: 'https://johndoe.com',
      }

      await expect(service.create(entreprise)).resolves.toEqual(oneEntreprise)
    })

    it('should throw an error if siretNumber already exists', async () => {
      const entreprise: CreateEntrepriseDto = {
        compagnyName: 'Compagny Name',
        name: 'Entreprise Name',
        siretNumber: '123456789',
        address: '1 rue de la maison',
        postalCode: '75001',
        city: 'Paris',
        country: 'France',
        email: 'john.doe@gmail.com',
        phoneNumber: '+33612345678',
        website: 'https://johndoe.com',
      }

      await expect(service.create(entreprise)).rejects.toThrow(
        'Siret already exists'
      )
    })
  })

  describe('findBySiret()', () => {
    it('should return an entreprise if siretNumber exists', async () => {
      const siretNumber = '123456789'
      await expect(service.findBySiret(siretNumber)).resolves.toEqual(
        oneEntreprise
      )
    })

    it('should return null if not found', async () => {
      const siretNumber = '12345678910'
      await expect(service.findBySiret(siretNumber)).resolves.toBeNull()
    })
  })
})
