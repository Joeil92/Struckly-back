import { Test } from '@nestjs/testing'
import { EntrepriseController } from './entreprise.controller'
import { EntrepriseService } from './entreprise.service'
import { CreateEntrepriseDto } from './dto/create-entreprise'
import * as httpMocks from 'node-mocks-http'

const entreprise: CreateEntrepriseDto = {
  compagnyName: 'test',
  name: 'test',
  siretNumber: '123456789',
  address: 'test',
  postalCode: '75001',
  city: 'Paris',
  country: 'France',
  email: 'test@test.com',
  phoneNumber: '0123456789',
  website: 'http://test.com',
}

describe('EntrepriseController', () => {
  let entrepriseController: EntrepriseController
  let entrepriseService: EntrepriseService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [EntrepriseController],
      providers: [
        EntrepriseService,
        {
          provide: EntrepriseService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((entreprise: CreateEntrepriseDto) =>
                Promise.resolve({ id: 1, ...entreprise })
              ),
          },
        },
      ],
    }).compile()

    entrepriseService = moduleRef.get(EntrepriseService)
    entrepriseController = moduleRef.get(EntrepriseController)
  })

  it('should be defined', () => {
    expect(entrepriseController).toBeDefined()
  })

  describe('create', () => {
    it('should add a new entreprise', async () => {
      const req: Request = httpMocks.createRequest({
        method: 'POST',
        url: 'api/v1/entreprises',
        user: {
          id: 1,
        },
      })

      await expect(
        entrepriseController.create(req, entreprise)
      ).resolves.toEqual({
        id: 1,
        ...entreprise,
      })
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(entrepriseService.create).toHaveBeenCalledWith(entreprise)
    })
  })
})
