import { Test } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import * as httpMocks from 'node-mocks-http'
import { ResetPasswordConfirmDto } from './dto/reset-password-confirm.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'

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
            resetPassword: jest.fn().mockReturnValue('messageId'),
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

  describe('resetPassword', () => {
    it('should return a messageId', async () => {
      const req: Request = httpMocks.createRequest({
        method: 'POST',
        url: 'api/v1/users/reset-password',
        user: {
          id: 1,
        },
      })

      const resetPasswordDto: ResetPasswordDto = {
        email: 'john.doe@gmail.com',
      }

      await expect(
        usersController.resetPassword(req, resetPasswordDto)
      ).resolves.toEqual('messageId')
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(usersService.resetPassword).toHaveBeenCalledWith(resetPasswordDto)
    })
  })

  describe('resetPasswordConfirm', () => {
    it('should return a token and refresh token', async () => {
      const req: Request = httpMocks.createRequest({
        method: 'PATCH',
        url: 'api/v1/users/reset-password/confirm',
        user: {
          id: 1,
        },
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
