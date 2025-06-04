import { Test } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import * as httpMocks from 'node-mocks-http'
import { ResetPasswordConfirmDto } from './dto/reset-password-confirm.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { CreateUserDto } from './dto/create-user.dto'

describe('UsersController', () => {
  let usersController: UsersController
  let usersService: UsersService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockReturnValue({
              access_token: 'token',
              refresh_token: 'token',
            }),
            resetPassword: jest.fn(),
            resetPasswordConfirm: jest.fn().mockReturnValue({
              access_token: 'token',
              refresh_token: 'token',
            }),
          },
        },
      ],
    }).compile()

    usersService = moduleRef.get(UsersService)
    usersController = moduleRef.get(UsersController)
  })

  it('shoulod be defined', () => {
    expect(usersController).toBeDefined()
  })

  describe('create', () => {
    it('should create a user and return auth tokens', () => {
      const req: Request = httpMocks.createRequest({
        method: 'POST',
        url: 'api/v1/users',
      })

      const createUserDto: CreateUserDto = {
        email: 'john.doe@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
        password: '123456789',
        gender: 'male',
      }

      expect(usersController.create(req, createUserDto)).toEqual({
        access_token: 'token',
        refresh_token: 'token',
      })
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(usersService.create).toHaveBeenCalledWith(createUserDto)
    })
  })

  describe('resetPassword', () => {
    it('should return a messageId', async () => {
      const req: Request = httpMocks.createRequest({
        method: 'POST',
        url: 'api/v1/users/reset-password',
      })

      const resetPasswordDto: ResetPasswordDto = {
        email: 'john.doe@gmail.com',
      }

      await usersController.resetPassword(req, resetPasswordDto)

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(usersService.resetPassword).toHaveBeenCalledWith(resetPasswordDto)
    })
  })

  describe('resetPasswordConfirm', () => {
    it('should return a token and refresh token', async () => {
      const req: Request = httpMocks.createRequest({
        method: 'PATCH',
        url: 'api/v1/users/reset-password/confirm',
      })

      const resetPasswordConfirmDto: ResetPasswordConfirmDto = {
        token: 'resetToken',
        userId: '1',
        password: '123456789',
      }

      await expect(
        usersController.resetPasswordConfirm(req, resetPasswordConfirmDto)
      ).resolves.toEqual({
        access_token: 'token',
        refresh_token: 'token',
      })
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(usersService.resetPasswordConfirm).toHaveBeenCalledWith(
        resetPasswordConfirmDto
      )
    })
  })
})
