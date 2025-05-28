import { Test } from '@nestjs/testing'
import { EntreprisesController } from './entreprises.controller'
import { EntreprisesService } from './entreprises.service'
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
  let entreprisesController: EntreprisesController
  let entreprisesService: EntreprisesService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [EntreprisesController],
      providers: [
        EntreprisesService,
        {
          provide: EntreprisesService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((entreprise: CreateEntrepriseDto) =>
                Promise.resolve({ id: 1, ...entreprise })
              ),
            findEntreprisesByUserId: jest
              .fn()
              .mockImplementation(() => Promise.resolve([])),
          },
        },
      ],
    }).compile()

    entreprisesService = moduleRef.get(EntreprisesService)
    entreprisesController = moduleRef.get(EntreprisesController)
  })

  it('should be defined', () => {
    expect(entreprisesController).toBeDefined()
  })

  describe('create', () => {
    it('should add a new entreprise', async () => {
      const req: Request = httpMocks.createRequest({
        method: 'POST',
        url: 'api/v1/entreprises',
        user: {
          id: '1',
        },
      })

      await expect(
        entreprisesController.create(req, entreprise)
      ).resolves.toEqual({
        id: 1,
        ...entreprise,
      })
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(entreprisesService.create).toHaveBeenCalledWith(entreprise)
    })
  })
})
