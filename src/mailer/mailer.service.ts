import { HttpException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SendMailDto } from './dto/send-mail.dto'
import * as nodemailer from 'nodemailer'
import * as pug from 'pug'
import { SentMessageInfo } from './types/Sent-message-info.interface'

@Injectable()
export class MailerService {
  private readonly transporter: nodemailer.Transporter

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport(
      this.configService.get<nodemailer.TransportOptions>('mailer')
    )
  }

  async sendMail(
    mailOptions: SendMailDto,
    pugTemplatePath: string
  ): Promise<SentMessageInfo> {
    const compiledFunction = pug.compileFile(
      `${__dirname}/../template/${pugTemplatePath}.pug`
    )
    const html = compiledFunction(mailOptions.context)

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await this.transporter.sendMail({
        ...mailOptions,
        html: html,
        from: this.configService.get<string>('mailer.auth.user'),
      })
    } catch (error) {
      throw new HttpException('Error while sending mail', 500, {
        description: String(error),
      })
    }
  }
}
