import { Test } from '@nestjs/testing'
import { UserService } from './user.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from './entity/user.entity'

const oneUser = {
  email: 'john.doe@gmail.com',
  password: '123456789',
}

describe('UserService', () => {
  let service: UserService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest
              .fn()
              .mockImplementation(({ email }: { email: string }) =>
                Promise.resolve(email === 'john.doe@gmail.com' ? oneUser : null)
              ),
          },
        },
      ],
    }).compile()

    service = module.get(UserService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findByEmail()', () => {
    it('should return a user if email exists', async () => {
      const email = 'john.doe@gmail.com'
      await expect(service.findByEmail(email)).resolves.toEqual(oneUser)
    })

    it('should return null if not found', async () => {
      const email = 'john.not-doe@gmail.com'
      await expect(service.findByEmail(email)).resolves.toBeNull()
    })
  })
})
