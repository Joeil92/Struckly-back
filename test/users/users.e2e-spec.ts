/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '../../src/app.module'
import { CreateUserDto } from '../../src/users/dto/create-user.dto'
import * as request from 'supertest'

describe('Users - /users (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = moduleRef.createNestApplication()
    await app.init()
  })

  it('Create [POST] /users', async () => {
    const userDto: CreateUserDto = {
      email: 'john.doe@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      password: '123456789',
      gender: 'male',
    }

    return request(app.getHttpServer())
      .post('/users')
      .send(userDto)
      .expect(201)
      .then(({ body }) => {
        expect(body).toMatchObject({
          access_token: expect.any(String),
          refresh_token: expect.any(String),
        })
      })
  })

  afterAll(async () => {
    await app.close()
  })
})
