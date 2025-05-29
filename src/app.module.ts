import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import authConfig from '../config/auth.config'
import databaseConfig from '../config/database.config'
import defaultConfig from '../config/configuration'
import { TypeOrmModule } from '@nestjs/typeorm'
import { HttpExceptionFilter } from '../common/exceptions/http-exception-filter'
import mailerConfig from '../config/mailer.config'
import { MailerModule } from './mailer/mailer.module'
import { AuthModule } from './auth/auth.module'
import { EntreprisesModule } from './entreprises/entreprises.module'
import { UsersModule } from './users/users.module'
import { InvitationsModule } from './invitations/invitations.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/env/.${process.env.NODE_ENV}.env`,
      load: [defaultConfig, authConfig, databaseConfig, mailerConfig],
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),
    MailerModule,
    AuthModule,
    EntreprisesModule,
    UsersModule,
    InvitationsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
