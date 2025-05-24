import { Test } from '@nestjs/testing'
import { UserService } from './user.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User, UserRole } from './entity/user.entity'
import { ResetPasswordConfirmDto } from './dto/reset-password-confirm.dto'
import { ConfigService } from '@nestjs/config'
import { MailerService } from '../mailer/mailer.service'
import * as bcrypt from 'bcrypt'

const oneUser: User = {
  id: '1',
  email: 'john.doe@gmail.com',
  firstName: 'John',
  lastName: 'Doe',
  gender: 'male',
  avatarUrl: 'https://avatar.com',
  roles: [UserRole.USER],
  entrepriseToUsers: [],
  password: '123456789',
  resetToken: 'resetToken',
  tokenExpiresAt: new Date('2025-05-23T00:00:00.000Z'),
  updatedAt: new Date('2025-05-23T00:00:00.000Z'),
  deletedAt: null,
  createdAt: new Date('2025-05-23T00:00:00.000Z'),
}

describe('UserService', () => {
  let service: UserService
  let mailerService: MailerService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn().mockReturnValue(Promise.resolve(oneUser)),
            findOneBy: jest
              .fn()
              .mockImplementation(
                ({ id, email }: { id: string; email: string }) =>
                  Promise.resolve(
                    email === 'john.doe@gmail.com' || id === '1'
                      ? oneUser
                      : null
                  )
              ),
          },
        },
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn().mockReturnValue({ messageId: 'messageId' }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(10),
          },
        },
      ],
    }).compile()

    service = module.get(UserService)
    mailerService = module.get(MailerService)
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

  describe('resetPassword()', () => {
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => 'hash')

    it('should send email and return messageId', async () => {
      await expect(
        service.resetPassword({ email: 'john.doe@gmail.com' })
      ).resolves.toBeUndefined()
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mailerService.sendMail).toHaveBeenCalled()
    })

    it("should don't send email and throw an error if user is not found", async () => {
      await expect(
        service.resetPassword({ email: 'john.not-doe@gmail.com' })
      ).resolves.toBeUndefined()
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mailerService.sendMail).not.toHaveBeenCalled()
    })
  })

  describe('resetPasswordConfirm()', () => {
    it('should reset user password and generate tokens successfully with tokenExpiresAt', async () => {
      const resetPasswordConfirmDto: ResetPasswordConfirmDto = {
        token: 'resetToken',
        userId: '1',
        password: '123456789',
      }

      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true)

      await expect(
        service.resetPasswordConfirm(resetPasswordConfirmDto)
      ).resolves.toEqual({ message: 'Password reset successfully' })
      expect(oneUser.resetToken).toBeNull()
      expect(oneUser.tokenExpiresAt).toBeNull()
    })

    it('should reset user password and generate tokens successfully without tokenExpiresAt', async () => {
      jest.spyOn(service, 'findById').mockImplementation(() =>
        Promise.resolve({
          ...oneUser,
          resetToken: 'resetToken',
          tokenExpiresAt: null,
        })
      )

      const resetPasswordConfirmDto: ResetPasswordConfirmDto = {
        token: 'resetToken',
        userId: '1',
        password: '123456789',
      }

      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true)

      await expect(
        service.resetPasswordConfirm(resetPasswordConfirmDto)
      ).resolves.toEqual({ message: 'Password reset successfully' })
      expect(oneUser.resetToken).toBeNull()
      expect(oneUser.tokenExpiresAt).toBeNull()
    })

    it('should throw an error if token is invalid', async () => {
      oneUser.resetToken = 'resetToken'
      oneUser.tokenExpiresAt = new Date('2025-05-23T00:00:00.000Z')

      const resetPasswordConfirmDto: ResetPasswordConfirmDto = {
        token: 'notResetToken',
        userId: '1',
        password: '123456789',
      }

      jest.spyOn(bcrypt, 'compare').mockImplementation(() => false)

      await expect(
        service.resetPasswordConfirm(resetPasswordConfirmDto)
      ).rejects.toThrow('Invalid payload')
    })

    it('should throw an error if user is not found', async () => {
      const resetPasswordConfirmDto: ResetPasswordConfirmDto = {
        token: 'resetToken',
        userId: '2',
        password: '123456789',
      }

      await expect(
        service.resetPasswordConfirm(resetPasswordConfirmDto)
      ).rejects.toThrow('Invalid payload')
    })

    it('should throw an error if token has expired', async () => {
      jest.spyOn(service, 'findById').mockImplementation(() =>
        Promise.resolve({
          ...oneUser,
          tokenExpiresAt: new Date(Date.now() - 1000),
        })
      )

      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true)

      const resetPasswordConfirmDto: ResetPasswordConfirmDto = {
        token: 'resetToken',
        userId: '1',
        password: '123456789',
      }

      await expect(
        service.resetPasswordConfirm(resetPasswordConfirmDto)
      ).rejects.toThrow('Token expired')
    })
  })
})
