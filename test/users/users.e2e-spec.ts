/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '../../src/app.module'
import { CreateUserDto } from '../../src/users/dto/create-user.dto'
import { ResetPasswordDto } from '../../src/users/dto/reset-password.dto'
import { ResetPasswordConfirmDto } from '../../src/users/dto/reset-password-confirm.dto'
import * as request from 'supertest'
import * as bcrypt from 'bcrypt'

describe('Users - /users (e2e)', () => {
  let app: INestApplication
  let userId: string

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

    const loginReq = await request(app.getHttpServer())
      .post('/users')
      .send(userDto)
      .expect(201)

    expect(loginReq.body).toMatchObject({
      access_token: expect.any(String),
      refresh_token: expect.any(String),
    })

    const decodedToken = JSON.parse(
      Buffer.from(loginReq.body.access_token.split('.')[1], 'base64').toString()
    )
    userId = decodedToken.id
  })

  it('Reset password [POST] /users/reset-password', async () => {
    const resetPasswordDto: ResetPasswordDto = {
      email: 'john.doe@gmail.com',
    }

    return request(app.getHttpServer())
      .post('/users/reset-password')
      .send(resetPasswordDto)
      .expect(200)
  })

  it('Reset password confirm [PATCH] /users/reset-password/confirm', async () => {
    const spy = jest.spyOn(bcrypt, 'compare')
    spy.mockImplementation(() => true)

    const resetPasswordConfirmDto: ResetPasswordConfirmDto = {
      userId: userId,
      token: 'resetToken',
      password: '123456789',
    }

    return request(app.getHttpServer())
      .patch('/users/reset-password/confirm')
      .send(resetPasswordConfirmDto)
      .expect(200)
  })

  afterAll(async () => {
    jest.restoreAllMocks()
    await app.close()
  })
})
