import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import authConfig from 'config/auth.config'
import databaseConfig from 'config/database.config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { HttpExceptionFilter } from 'common/exception/http-exception-filter'
import mailerConfig from 'config/mailer.config'
import { MailerModule } from './mailer/mailer.module'
import { AuthModule } from './auth/auth.module'
import { EntrepriseModule } from './entreprise/entreprise.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [authConfig, databaseConfig, mailerConfig],
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),
    MailerModule,
    AuthModule,
    EntrepriseModule,
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
