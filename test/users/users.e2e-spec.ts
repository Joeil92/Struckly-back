import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { UsersModule } from '../../src/users/users.module'

describe('Users - /users (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile()
    app = moduleRef.createNestApplication()
    await app.init()
  })

  it('Create [POST] /users', () => {
    throw new Error('Not implemented')
  })

  afterAll(async () => {
    await app.close()
  })
})
