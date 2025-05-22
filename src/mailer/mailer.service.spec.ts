import { Test } from '@nestjs/testing'
import { MailerService } from './mailer.service'
import { ConfigService } from '@nestjs/config'

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' }),
  })),
}))

jest.mock('pug', () => ({
  compileFile: jest.fn(() => () => 'test'),
}))

describe('MailerService', () => {
  let service: MailerService

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn((key) => {
        if (key === 'mailer') {
          return {
            host: 'test',
            port: 25,
            auth: {
              user: 'test',
              pass: 'test',
            },
          }
        }

        if (key === 'mailer.auth.user') {
          return {
            user: 'test',
            pass: 'test',
          }
        }
      }),
    }

    const module = await Test.createTestingModule({
      providers: [
        MailerService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile()

    service = module.get(MailerService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('sendMail()', () => {
    it('should send mail', async () => {
      const mailOptions = {
        to: 'test@test.com',
        subject: 'test',
        context: {
          test: 'test',
        },
      }
      const result = await service.sendMail(mailOptions, 'test')
      expect(result).toBeDefined()
      expect(result.messageId).toBe('test-id')
    })
  })
})
