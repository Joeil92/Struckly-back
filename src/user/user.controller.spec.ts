import { Test } from '@nestjs/testing'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import * as httpMocks from 'node-mocks-http'
import { ResetPasswordConfirmDto } from './dto/reset-password-confirm.dto'

describe('UserController', () => {
  let userController: UserController
  let userService: UserService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            resetPasswordConfirm: jest.fn().mockReturnValue({
              access_token: 'token',
              refresh_token: 'token',
            }),
          },
        },
      ],
    }).compile()

    userService = moduleRef.get(UserService)
    userController = moduleRef.get(UserController)
  })

  it('shoulod be defined', () => {
    expect(userController).toBeDefined()
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
        userController.resetPasswordConfirm(req, resetPasswordConfirmDto)
      ).resolves.toEqual({
        access_token: 'token',
        refresh_token: 'token',
      })
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userService.resetPasswordConfirm).toHaveBeenCalledWith(
        resetPasswordConfirmDto
      )
    })
  })
})
